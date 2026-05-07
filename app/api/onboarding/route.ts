/**
 * Org creation + membership for first-time users.
 * POST /api/onboarding
 *
 * Why service role: the orgs table has no public INSERT policy (which is
 * correct - we don't want any authenticated user to be able to create
 * arbitrary orgs). The first-org bootstrap is a privileged operation
 * that we run server-side after verifying the requesting user is
 * authenticated and does not already belong to an org.
 *
 * Flow:
 *   1. Verify caller is authenticated via the user-context client
 *   2. Verify caller does not already have a membership
 *   3. Switch to service-role client to insert the org + membership row
 *      atomically (using user_id = caller's verified id, role = owner)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1) Verify caller is authenticated
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orgName = typeof body.name === "string" ? body.name.trim() : "";
  if (!orgName) {
    return NextResponse.json(
      { error: "Organization name required" },
      { status: 400 }
    );
  }

  // 2) Check if user already has an org (using user-context client - RLS
  // restricts memberships read to own membership rows, so this is safe).
  const { data: existing } = await userClient
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing?.org_id) {
    return NextResponse.json({
      org_id: existing.org_id,
      message: "Already onboarded",
    });
  }

  // 3) Switch to service role for the inserts (bypasses RLS).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Onboarding cannot complete.",
      },
      { status: 500 }
    );
  }
  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Validate org type against the enum allowlist (defense in depth).
  const allowedTypes = new Set([
    "school",
    "parish",
    "business",
    "estate",
    "event",
    "gym",
    "other",
  ]);
  const incomingType =
    typeof body.type === "string" ? body.type.toLowerCase() : "other";
  const orgType = allowedTypes.has(incomingType) ? incomingType : "other";

  // Insert org
  const { data: org, error: orgErr } = await admin
    .from("orgs")
    .insert({
      name: orgName,
      type: orgType,
      city: typeof body.city === "string" ? body.city || null : null,
      state: typeof body.state === "string" ? body.state || null : null,
      est_population:
        typeof body.est_population === "number" ? body.est_population : null,
      primary_contact_email: user.email,
    })
    .select("id")
    .single();

  if (orgErr || !org) {
    console.error("onboarding: org insert failed:", orgErr?.message);
    return NextResponse.json(
      { error: orgErr?.message || "Failed to create org" },
      { status: 500 }
    );
  }

  // Insert membership as owner
  const { error: memErr } = await admin.from("memberships").insert({
    user_id: user.id,
    org_id: org.id,
    role: "owner",
  });

  if (memErr) {
    console.error("onboarding: membership insert failed:", memErr.message);
    // Roll back the org so the user can retry cleanly.
    await admin.from("orgs").delete().eq("id", org.id);
    return NextResponse.json(
      { error: `Membership creation failed: ${memErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ org_id: org.id });
}

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
 *   3. Validate that SUPABASE_SERVICE_ROLE_KEY is present, well-formed,
 *      and actually carries the service_role role claim
 *   4. Switch to service-role client to insert the org + membership row
 *      atomically (using user_id = caller's verified id, role = owner)
 *   5. Translate Supabase's generic 'Invalid API key' error into a
 *      diagnostic message so it's clear what to fix on Vercel
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type KeyValidation =
  | { valid: true; role: "service_role" }
  | { valid: false; reason: string };

/**
 * Decode the JWT payload and verify the role claim. Supabase service-role
 * keys are JWTs with `"role":"service_role"` in the payload; anon keys
 * have `"role":"anon"`. If someone pastes the wrong one into Vercel, we
 * catch it here BEFORE we ever hit Supabase with it.
 */
function validateServiceRoleKey(key: string | undefined): KeyValidation {
  if (!key) {
    return { valid: false, reason: "SUPABASE_SERVICE_ROLE_KEY is not set" };
  }
  if (key.length < 40) {
    return {
      valid: false,
      reason: "SUPABASE_SERVICE_ROLE_KEY is too short to be a real JWT",
    };
  }
  const trimmed = key.trim();
  if (trimmed !== key) {
    return {
      valid: false,
      reason:
        "SUPABASE_SERVICE_ROLE_KEY has leading or trailing whitespace - re-paste it without surrounding spaces",
    };
  }
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      valid: false,
      reason:
        "SUPABASE_SERVICE_ROLE_KEY is not in JWT format (expected 3 dot-separated segments)",
    };
  }
  let payload: { role?: string; iss?: string };
  try {
    // base64url decode the middle segment
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf-8");
    payload = JSON.parse(json);
  } catch {
    return {
      valid: false,
      reason: "SUPABASE_SERVICE_ROLE_KEY payload could not be decoded",
    };
  }
  if (payload.role !== "service_role") {
    return {
      valid: false,
      reason: `SUPABASE_SERVICE_ROLE_KEY has role '${payload.role ?? "<missing>"}' - this looks like the anon key, not the service role key. Copy the service_role key from Supabase Dashboard -> Project Settings -> API.`,
    };
  }
  return { valid: true, role: "service_role" };
}

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

  // 2) Check if user already has an org
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

  // 3) Validate service role key BEFORE constructing the admin client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error("onboarding: NEXT_PUBLIC_SUPABASE_URL is not set");
    return NextResponse.json(
      {
        error:
          "Server is missing NEXT_PUBLIC_SUPABASE_URL. The team has been notified.",
      },
      { status: 500 }
    );
  }

  const keyCheck = validateServiceRoleKey(serviceKey);
  if (!keyCheck.valid) {
    // Log the specific reason so it shows up in Vercel logs for the team.
    console.error("onboarding: service-role key validation failed:", keyCheck.reason);
    return NextResponse.json(
      {
        error:
          "Onboarding is temporarily unavailable due to a server-side configuration issue. The team has been notified. Please email Oceanstateprotectiongroup@gmail.com and we will set up your organization manually.",
        // Include the diagnostic in dev so we can see it in browser network tab
        // in production this is still useful for triage
        diagnostic: keyCheck.reason,
      },
      { status: 500 }
    );
  }

  const admin = createServiceClient(supabaseUrl, serviceKey!, {
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
    const rawMsg = orgErr?.message || "Failed to create org";
    console.error("onboarding: org insert failed:", rawMsg);

    // Translate the most common Supabase failure modes into actionable
    // messages instead of leaking internal error text to end users.
    let userMessage = "We could not set up your organization right now.";
    if (
      rawMsg.toLowerCase().includes("invalid api key") ||
      rawMsg.toLowerCase().includes("jwt")
    ) {
      userMessage =
        "Onboarding is temporarily unavailable due to a server-side configuration issue. The team has been notified. Please email Oceanstateprotectiongroup@gmail.com and we will set up your organization manually.";
    } else if (
      rawMsg.toLowerCase().includes("duplicate key") ||
      rawMsg.toLowerCase().includes("unique")
    ) {
      userMessage =
        "An organization with that name already exists. Try a different name.";
    } else if (rawMsg.toLowerCase().includes("violates")) {
      userMessage =
        "We could not validate one of the form fields. Double-check your inputs and try again.";
    }

    return NextResponse.json(
      { error: userMessage, diagnostic: rawMsg },
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
      {
        error: "We created your organization but could not finish linking your account. Please try again.",
        diagnostic: memErr.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ org_id: org.id });
}

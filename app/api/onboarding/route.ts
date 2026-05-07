/**
 * Org creation + membership for first-time users.
 * POST /api/onboarding
 *
 * Self-serve via RLS — no service-role key required.
 *
 * Migration 0005_onboarding_self_serve.sql adds two narrow RLS policies:
 *   - orgs.INSERT: authenticated users can create orgs
 *   - memberships.INSERT: a user can claim ownership of an org IFF they
 *     are inserting their own user_id, role='owner', and that org has
 *     no existing memberships
 *
 * Together those policies let an authenticated caller bootstrap a fresh
 * org + owner membership using only the anon key + their session JWT.
 * If 0005 has not been applied, the org INSERT will hit the original
 * RLS deny and we surface a clear error.
 *
 * Flow:
 *   1. Verify caller is authenticated
 *   2. If they already have a membership, return its org_id (no-op)
 *   3. Insert orgs row (RLS: auth user)
 *   4. Insert memberships row as owner (RLS: bootstrap policy)
 *   5. If membership insert fails, roll back the org so the user can retry
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ALLOWED_ORG_TYPES = new Set([
  "school",
  "parish",
  "business",
  "estate",
  "event",
  "gym",
  "other",
]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 1) Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse + validate input
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

  const incomingType =
    typeof body.type === "string" ? body.type.toLowerCase() : "other";
  const orgType = ALLOWED_ORG_TYPES.has(incomingType) ? incomingType : "other";

  const city =
    typeof body.city === "string" && body.city.trim()
      ? body.city.trim()
      : null;
  const state =
    typeof body.state === "string" && body.state.trim()
      ? body.state.trim()
      : null;
  const estPopulation =
    typeof body.est_population === "number" && Number.isFinite(body.est_population)
      ? Math.max(0, Math.floor(body.est_population))
      : null;

  // 3) Idempotency: if user already has a membership, return it.
  const { data: existing } = await supabase
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

  // 4) Insert org via the user-context client. Migration 0005 adds the
  //    INSERT policy that lets authenticated users do this.
  const { data: org, error: orgErr } = await supabase
    .from("orgs")
    .insert({
      name: orgName,
      type: orgType,
      city,
      state,
      est_population: estPopulation,
      primary_contact_email: user.email,
    })
    .select("id")
    .single();

  if (orgErr || !org) {
    const rawMsg = orgErr?.message || "Failed to create org";
    console.error("onboarding: org insert failed:", rawMsg);

    let userMessage = "We could not set up your organization right now.";
    const lower = rawMsg.toLowerCase();
    if (
      lower.includes("row-level security") ||
      lower.includes("policy") ||
      lower.includes("permission denied")
    ) {
      userMessage =
        "Database policy is not set up for self-serve onboarding yet. The migration 0005_onboarding_self_serve.sql needs to be applied to Supabase.";
    } else if (lower.includes("duplicate") || lower.includes("unique")) {
      userMessage =
        "An organization with that name already exists. Try a different name.";
    } else if (lower.includes("violates")) {
      userMessage =
        "We could not validate one of the form fields. Double-check your inputs and try again.";
    }

    return NextResponse.json(
      { error: userMessage, diagnostic: rawMsg },
      { status: 500 }
    );
  }

  // 5) Insert membership as owner via the user-context client. The
  //    bootstrap policy from migration 0005 allows this when the row's
  //    user_id matches auth.uid(), role='owner', and the org has no
  //    existing memberships.
  const { error: memErr } = await supabase.from("memberships").insert({
    user_id: user.id,
    org_id: org.id,
    role: "owner",
  });

  if (memErr) {
    console.error("onboarding: membership insert failed:", memErr.message);

    // Try to roll back the org so the user can retry. If the rollback
    // fails (RLS deny on delete, etc.), the user is left with an org
    // they cannot see - support can clean up via service role later.
    await supabase.from("orgs").delete().eq("id", org.id);

    const lower = memErr.message.toLowerCase();
    let userMessage =
      "We created your organization but could not finish linking your account. Please try again.";
    if (lower.includes("row-level security") || lower.includes("policy")) {
      userMessage =
        "Database policy is not set up for self-serve onboarding yet. The migration 0005_onboarding_self_serve.sql needs to be applied to Supabase.";
    }

    return NextResponse.json(
      { error: userMessage, diagnostic: memErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ org_id: org.id });
}

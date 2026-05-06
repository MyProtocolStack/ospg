/**
 * Org creation + membership for first-time users.
 * POST /api/onboarding
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Organization name required" }, { status: 400 });
  }

  // Check if user already has an org
  const { data: existing } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing?.org_id) {
    return NextResponse.json({ org_id: existing.org_id, message: "Already onboarded" });
  }

  // Create org
  const { data: org, error: orgErr } = await supabase
    .from("orgs")
    .insert({
      name: body.name.trim(),
      type: body.type || "other",
      city: body.city || null,
      state: body.state || null,
      est_population: body.est_population ?? null,
      primary_contact_email: user.email,
    })
    .select()
    .single();

  if (orgErr || !org) {
    return NextResponse.json(
      { error: orgErr?.message || "Failed to create org" },
      { status: 500 }
    );
  }

  // Create membership (owner)
  const { error: memErr } = await supabase.from("memberships").insert({
    user_id: user.id,
    org_id: org.id,
    role: "owner",
  });

  if (memErr) {
    return NextResponse.json(
      { error: `Org created but membership failed: ${memErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ org_id: org.id });
}

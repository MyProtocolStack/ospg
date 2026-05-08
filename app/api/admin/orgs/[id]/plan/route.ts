/**
 * Admin: change an org's plan tier.
 *
 * POST /api/admin/orgs/[id]/plan
 * Body: { plan: 'free' | 'walkthrough' | 'shield' | 'subscriber' | 'enterprise' }
 *
 * Auth flow:
 *   1. Verify caller is authenticated
 *   2. Verify caller's email is in the admin allowlist (lib/admin.ts)
 *   3. Use the service-role client to update orgs.plan + audit columns
 *      (regular users cannot update orgs they don't belong to under
 *      RLS; admins flipping client-org plans need to bypass)
 *
 * If SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel, returns
 * a clear 503 telling the operator what to do.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const ALLOWED_PLANS = new Set([
  "free",
  "walkthrough",
  "shield",
  "subscriber",
  "enterprise",
]);

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // 1) Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Admin allowlist
  if (!isAdmin(user.email)) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  // 3) Validate payload
  let body: { plan?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const newPlan =
    typeof body.plan === "string" ? body.plan.toLowerCase() : "";
  if (!ALLOWED_PLANS.has(newPlan)) {
    return NextResponse.json(
      {
        error: `plan must be one of: ${[...ALLOWED_PLANS].join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 4) Service-role client to bypass RLS on orgs.UPDATE
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error:
          "Admin operations require SUPABASE_SERVICE_ROLE_KEY to be configured on Vercel. The action could not be completed.",
      },
      { status: 503 }
    );
  }
  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 5) Update
  const { data: org, error: updateErr } = await admin
    .from("orgs")
    .update({
      plan: newPlan,
      plan_updated_at: new Date().toISOString(),
      plan_updated_by: user.id,
    })
    .eq("id", id)
    .select("id, name, plan")
    .single();

  if (updateErr || !org) {
    console.error("admin: org plan update failed:", updateErr?.message);
    return NextResponse.json(
      { error: updateErr?.message || "Update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    org_id: org.id,
    name: org.name,
    plan: org.plan,
  });
}

/**
 * Org plan tier helper. Drives feature-gating across the dashboard.
 *
 * Uses the EXISTING `plan_tier` enum from migration 0001 with values:
 *   - 'free'        : self-serve evaluator
 *   - 'walkthrough' : booked but not yet delivered SHIELD Assessment - still
 *                     functionally evaluator until the walkthrough completes
 *   - 'shield'      : delivered paid SHIELD Assessment - engaged client
 *   - 'subscriber'  : ongoing subscription - engaged client
 *   - 'enterprise'  : multi-site / diocese-wide retainer - engaged client
 *
 * isEngaged = plan in (shield, subscriber, enterprise). Anything else is
 * treated as free-tier for feature-gating purposes.
 *
 * OSPG admins update orgs.plan via Supabase Studio after a paid engagement
 * is delivered. Future: Stripe-driven automatic tier updates.
 */
import { createClient } from "@/lib/supabase/server";

export type PlanTier =
  | "free"
  | "walkthrough"
  | "shield"
  | "subscriber"
  | "enterprise";

export type OrgPlanStatus = {
  org_id: string;
  plan: PlanTier;
  /** True if the user's plan unlocks gated features. */
  isEngaged: boolean;
  /** Convenience labels for UI. */
  labels: {
    badge: string;
    badgeShort: string;
  };
};

const PLAN_LABELS: Record<PlanTier, { badge: string; badgeShort: string }> = {
  free: { badge: "Trial Account", badgeShort: "Trial" },
  walkthrough: { badge: "Walkthrough Pending", badgeShort: "Pending" },
  shield: { badge: "Engaged Client", badgeShort: "Client" },
  subscriber: { badge: "Subscriber", badgeShort: "Subscriber" },
  enterprise: { badge: "Enterprise Client", badgeShort: "Enterprise" },
};

const ENGAGED_PLANS: ReadonlySet<PlanTier> = new Set([
  "shield",
  "subscriber",
  "enterprise",
]);

function normalizePlan(value: unknown): PlanTier {
  if (typeof value !== "string") return "free";
  if (
    value === "free" ||
    value === "walkthrough" ||
    value === "shield" ||
    value === "subscriber" ||
    value === "enterprise"
  ) {
    return value;
  }
  return "free";
}

/**
 * Fetch the current user's primary org plan. Returns null if the user
 * is not authenticated or has no membership yet (still onboarding).
 *
 * Defensive: if the column / enum is in an unexpected state, default to
 * 'free' so the dashboard does not crash.
 */
export async function getCurrentOrgPlan(): Promise<OrgPlanStatus | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership?.org_id) return null;

  let plan: PlanTier = "free";
  try {
    const { data: org, error } = await supabase
      .from("orgs")
      .select("plan")
      .eq("id", membership.org_id)
      .maybeSingle();
    if (!error && org) {
      plan = normalizePlan((org as { plan?: unknown }).plan);
    }
  } catch {
    plan = "free";
  }

  return {
    org_id: membership.org_id,
    plan,
    isEngaged: ENGAGED_PLANS.has(plan),
    labels: PLAN_LABELS[plan],
  };
}

/**
 * PRAESIDIUM analysis quota.
 *
 * Free orgs get FREE_ANALYSIS_LIMIT analyses. After that, the new-analysis
 * page surfaces a "book a walkthrough" CTA instead of the upload form,
 * and /api/praesidium/analyze rejects further uploads server-side.
 *
 * Engaged orgs (paid clients) skip the quota check entirely - they get
 * unlimited analyses.
 *
 * Counted as: rows in `assessments` where org_id = user's org and
 * status = 'complete'. Failed/in-flight rows do not count.
 */
import { createClient } from "@/lib/supabase/server";

export const FREE_ANALYSIS_LIMIT = 2;

export type QuotaStatus = {
  used: number;
  limit: number;
  remaining: number;
  exhausted: boolean;
  /** True if the user's org plan is 'engaged' - quota does not apply. */
  unlimited: boolean;
};

/**
 * Count completed assessments for the user's primary org and return
 * quota status. Engaged orgs are reported as unlimited (never exhausted).
 *
 * Returns null if the user has no membership yet (still onboarding).
 */
export async function getQuotaForCurrentUser(): Promise<QuotaStatus | null> {
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

  // Look up org plan from the existing plan_tier enum. Engaged plans are
  // shield / subscriber / enterprise. Free / walkthrough are evaluator.
  // Defensive: if the column read fails, treat as free.
  let isEngaged = false;
  try {
    const { data: org } = await supabase
      .from("orgs")
      .select("plan")
      .eq("id", membership.org_id)
      .maybeSingle();
    const plan = org && (org as { plan?: string }).plan;
    if (plan === "shield" || plan === "subscriber" || plan === "enterprise") {
      isEngaged = true;
    }
  } catch {
    isEngaged = false;
  }

  const { count } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .eq("org_id", membership.org_id)
    .eq("status", "complete");

  const used = count ?? 0;

  if (isEngaged) {
    return {
      used,
      limit: Infinity,
      remaining: Infinity,
      exhausted: false,
      unlimited: true,
    };
  }

  const remaining = Math.max(FREE_ANALYSIS_LIMIT - used, 0);
  return {
    used,
    limit: FREE_ANALYSIS_LIMIT,
    remaining,
    exhausted: used >= FREE_ANALYSIS_LIMIT,
    unlimited: false,
  };
}

/**
 * PRAESIDIUM free-analysis quota.
 *
 * Free orgs get FREE_ANALYSIS_LIMIT analyses. After that, the new-analysis
 * page surfaces a "book a walkthrough" CTA instead of the upload form,
 * and /api/praesidium/analyze rejects further uploads server-side.
 *
 * Counted as: rows in `assessments` where org_id = user's org and
 * status = 'complete'. Failed/in-flight rows do not count.
 *
 * Future extension: add an `orgs.plan` column. When plan != 'free',
 * skip the quota check entirely.
 */
import { createClient } from "@/lib/supabase/server";

export const FREE_ANALYSIS_LIMIT = 2;

export type QuotaStatus = {
  used: number;
  limit: number;
  remaining: number;
  exhausted: boolean;
};

/**
 * Count completed assessments for the user's primary org.
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

  const { count } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .eq("org_id", membership.org_id)
    .eq("status", "complete");

  const used = count ?? 0;
  const remaining = Math.max(FREE_ANALYSIS_LIMIT - used, 0);
  return {
    used,
    limit: FREE_ANALYSIS_LIMIT,
    remaining,
    exhausted: used >= FREE_ANALYSIS_LIMIT,
  };
}

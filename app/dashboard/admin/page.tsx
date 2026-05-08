/**
 * Admin: org tier management.
 *
 * Gated to email addresses in lib/admin.ts. Allows the founders to
 * flip a client's org from free / walkthrough -> shield / subscriber /
 * enterprise (engaged) - and back - without running raw SQL.
 *
 * Uses the service-role client to read all orgs (regular users only
 * see their own orgs under RLS). If SUPABASE_SERVICE_ROLE_KEY is not
 * configured, the page still renders but shows a clear message
 * explaining what to set on Vercel.
 */
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";
import { AdminOrgsClient, type AdminOrgRow } from "./client";

export const metadata = { title: "OSPG Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1) Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/dashboard/admin");
  }

  // 2) Admin gate
  if (!isAdmin(user.email)) {
    notFound();
  }

  // 3) Service-role client for full org list
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let orgs: AdminOrgRow[] = [];
  let configError: string | null = null;

  if (!supabaseUrl || !serviceKey) {
    configError =
      "SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel. Org listing and plan flipping require this environment variable. Set it in Vercel project settings (Settings -> Environment Variables -> SUPABASE_SERVICE_ROLE_KEY) and redeploy.";
  } else {
    const admin = createServiceClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await admin
      .from("orgs")
      .select(
        "id, name, type, city, state, plan, plan_updated_at, primary_contact_email, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      configError = `Could not load orgs: ${error.message}`;
    } else {
      orgs = (data ?? []) as AdminOrgRow[];
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Admin
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            Organization tiers
          </h1>
          <p className="text-[var(--color-silver-200)] max-w-3xl">
            Flip a client&apos;s plan tier after delivering a paid SHIELD
            Assessment or signing a retainer. Engaged plans (shield /
            subscriber / enterprise) unlock the full dashboard - unlimited
            PRAESIDIUM analyses, the full course library, detail bookings,
            and direct founder access. Changes take effect immediately on
            the user&apos;s next page load.
          </p>
        </div>

        {configError ? (
          <div className="surface-card-elevated p-6 border border-[var(--color-crimson-500)]/40">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-crimson-500)] mb-2 font-medium">
              Configuration Issue
            </p>
            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
              {configError}
            </p>
          </div>
        ) : (
          <AdminOrgsClient orgs={orgs} />
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Settings
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            Account
          </h1>
        </div>

        <div className="surface-card p-7 mb-5">
          <h3 className="font-display text-xl text-[var(--color-cream)] mb-4">
            Profile
          </h3>
          <dl className="space-y-3 text-[14px]">
            <div className="flex justify-between gap-4 py-2 border-b border-white/5">
              <dt className="text-[var(--color-silver-300)]">Email</dt>
              <dd className="text-[var(--color-cream)]">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2 border-b border-white/5">
              <dt className="text-[var(--color-silver-300)]">User ID</dt>
              <dd className="text-[var(--color-silver-200)] font-mono text-[12px]">
                {user.id.slice(0, 8)}...
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-[var(--color-silver-300)]">Member since</dt>
              <dd className="text-[var(--color-cream)]">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="surface-card p-7">
          <h3 className="font-display text-xl text-[var(--color-cream)] mb-4">
            Notifications
          </h3>
          <p className="text-[13px] text-[var(--color-silver-300)] leading-relaxed">
            Notification preferences coming soon. For now, all account-related
            email goes to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}

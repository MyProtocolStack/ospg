import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Camera,
  Compass,
  GraduationCap,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { getCurrentOrgPlan } from "@/lib/org-plan";
import { signOut } from "./actions";
import { MobileMenu } from "./mobile-menu";

export const metadata = { title: "Dashboard" };

// Nav items with `engagedOnly: true` are gated for free-tier users:
// they appear in the sidebar with a lock icon, but clicking lands on
// the LockedFeature page in that route. Free-tier users still see them
// so they understand what unlocks.
const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview", engagedOnly: false },
      { href: "/dashboard/praesidium", icon: Camera, label: "PRAESIDIUM", engagedOnly: false },
      { href: "/dashboard/pilot", icon: Compass, label: "PILOT (Grants)", engagedOnly: false },
      { href: "/dashboard/courses", icon: GraduationCap, label: "Courses", engagedOnly: false },
      { href: "/dashboard/bookings", icon: Calendar, label: "Bookings", engagedOnly: true },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing", engagedOnly: false },
      { href: "/dashboard/settings", icon: Settings, label: "Settings", engagedOnly: false },
    ],
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensively handle every Supabase failure mode so the dashboard never
  // hard-500s a logged-in user. Any unexpected error short-circuits to the
  // login redirect rather than letting it bubble to a generic Next error page.
  let userEmail = "";
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      redirect("/login?next=/dashboard");
    }

    userEmail = user.email ?? "";
    userId = user.id;
  } catch (e) {
    // redirect() throws a special error - re-throw it so Next handles it.
    if (
      e &&
      typeof e === "object" &&
      "digest" in e &&
      typeof (e as { digest: unknown }).digest === "string" &&
      ((e as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
        (e as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"))
    ) {
      throw e;
    }
    console.error("dashboard layout auth error:", e);
    redirect("/login?next=/dashboard");
  }

  // Bounce users without a membership to /onboarding so they can create
  // their org. Without this redirect, brand new accounts land on
  // /dashboard with empty data and no obvious next step. The /onboarding
  // page itself bounces back here once a membership exists, so this is
  // a one-shot check on first arrival, not a loop.
  if (userId) {
    try {
      const supabase = await createClient();
      const { data: membership } = await supabase
        .from("memberships")
        .select("org_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
      if (!membership?.org_id) {
        redirect("/onboarding");
      }
    } catch (e) {
      // redirect() throws a special signal - re-throw it so Next handles it.
      if (
        e &&
        typeof e === "object" &&
        "digest" in e &&
        typeof (e as { digest: unknown }).digest === "string" &&
        (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw e;
      }
      console.error("dashboard layout membership check error:", e);
      // If the membership check itself failed for a non-redirect reason,
      // let the user proceed - onboarding is a UX nudge, not a hard gate.
    }
  }

  let displayName = userEmail.split("@")[0] || "Member";
  if (userId) {
    try {
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();
      if (profile?.full_name) displayName = profile.full_name;
    } catch (e) {
      // Profile fetch is best-effort. Fall back to email-derived name.
      console.error("dashboard layout profile fetch error:", e);
    }
  }

  // Fetch the user's org plan so we can show the engagement-status pill
  // and lock icons next to gated nav items. Defensive: never throws.
  let isEngaged = false;
  let planLabel = "Trial Account";
  try {
    const planStatus = await getCurrentOrgPlan();
    if (planStatus) {
      isEngaged = planStatus.isEngaged;
      planLabel = planStatus.labels.badge;
    }
  } catch (e) {
    console.error("dashboard layout plan fetch error:", e);
  }

  // IMPORTANT: do NOT spread `i` here. Each NAV_GROUPS item contains an
  // `icon` field that holds a Lucide component (a function). Functions
  // cannot be serialized across the server-to-client boundary, so passing
  // them as props to the <MobileMenu> client component triggers a Server
  // Components render error. MobileMenu looks up icons from its own
  // ICON_MAP keyed by href - it doesn't need the function ref.
  const navItems = NAV_GROUPS.flatMap((g) =>
    g.items.map((i) => ({
      href: i.href,
      label: i.label,
      group: g.label,
      engagedOnly: i.engagedOnly,
    }))
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[var(--color-navy-800)] border-r border-white/5 sticky top-0 h-screen">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-6 py-6 border-b border-white/5 group"
        >
          <div className="relative">
            <Shield
              className="h-7 w-7 text-[var(--color-gold-400)]"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-[var(--color-gold-400)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base text-[var(--color-cream)] tracking-tight">
              {BRAND.shortName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
              Protection Group
            </span>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-400)]">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const showLock = item.engagedOnly && !isEngaged;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[var(--color-silver-100)] hover:bg-white/5 hover:text-[var(--color-cream)] transition-colors"
                        title={showLock ? "Engaged client only" : undefined}
                      >
                        <Icon className="h-4 w-4 text-[var(--color-silver-300)] group-hover:text-[var(--color-gold-400)] transition-colors" strokeWidth={1.5} />
                        <span className="flex-1">{item.label}</span>
                        {showLock && (
                          <Lock
                            className="h-3 w-3 text-[var(--color-silver-400)]"
                            strokeWidth={1.7}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User block + plan status + logout */}
        <div className="px-3 py-4 border-t border-white/5">
          {/* Engagement status pill */}
          <div className="px-2 mb-3">
            <div
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border ${
                isEngaged
                  ? "border-[var(--color-gold-400)]/30 bg-[var(--color-gold-400)]/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-silver-400)] mb-0.5">
                  Status
                </p>
                <p
                  className={`text-[12px] font-medium truncate ${
                    isEngaged
                      ? "text-[var(--color-gold-400)]"
                      : "text-[var(--color-silver-100)]"
                  }`}
                >
                  {planLabel}
                </p>
              </div>
              {!isEngaged && (
                <Link
                  href="/upgrade"
                  className="text-[11px] text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors flex items-center gap-0.5 shrink-0"
                  title="Unlock full access"
                >
                  Upgrade
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.7} />
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center font-display text-sm text-[var(--color-navy-700)]">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[var(--color-cream)] truncate">{displayName}</p>
              <p className="text-[11px] text-[var(--color-silver-400)] truncate">
                {userEmail}
              </p>
            </div>
          </div>
          <form action={signOut}>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[var(--color-silver-200)] hover:bg-white/5 hover:text-[var(--color-cream)] transition-colors">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile menu (client component - drawer + top bar) */}
      <MobileMenu
        navItems={navItems}
        displayName={displayName}
        userEmail={userEmail}
        isEngaged={isEngaged}
        planLabel={planLabel}
      />

      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0">{children}</main>
    </div>
  );
}

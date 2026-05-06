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
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { signOut } from "./actions";
import { MobileMenu } from "./mobile-menu";

export const metadata = { title: "Dashboard" };

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/shield-ai", icon: Camera, label: "SHIELD AI" },
      { href: "/dashboard/pilot", icon: Compass, label: "PILOT (Grants)" },
      { href: "/dashboard/courses", icon: GraduationCap, label: "Courses" },
      { href: "/dashboard/bookings", icon: Calendar, label: "Bookings" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard");

  let displayName = user.email?.split("@")[0] ?? "Member";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.full_name) displayName = profile.full_name;
  } catch {
    // table may not exist yet pre-migration
  }

  const navItems = NAV_GROUPS.flatMap((g) =>
    g.items.map((i) => ({ ...i, group: g.label }))
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
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[var(--color-silver-100)] hover:bg-white/5 hover:text-[var(--color-cream)] transition-colors"
                      >
                        <Icon className="h-4 w-4 text-[var(--color-silver-300)] group-hover:text-[var(--color-gold-400)] transition-colors" strokeWidth={1.5} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User block + logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center font-display text-sm text-[var(--color-navy-700)]">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[var(--color-cream)] truncate">{displayName}</p>
              <p className="text-[11px] text-[var(--color-silver-400)] truncate">
                {user.email}
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

      {/* Mobile menu (client component — drawer + top bar) */}
      <MobileMenu
        navItems={navItems}
        displayName={displayName}
        userEmail={user.email ?? ""}
      />

      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0">{children}</main>
    </div>
  );
}

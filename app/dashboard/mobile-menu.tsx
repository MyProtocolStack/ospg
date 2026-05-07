"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Shield,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Camera,
  Compass,
  GraduationCap,
  Calendar,
  CreditCard,
  Settings,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { signOut } from "./actions";

type NavItem = {
  href: string;
  label: string;
  group: string;
  /** True for items that require an engaged-tier org. Free users see a lock icon. */
  engagedOnly?: boolean;
  // No icon field - icons are looked up by href in ICON_MAP below.
  // Passing function refs from server components to client components
  // is not allowed in Next.js (causes a Server Components render error).
};

const ICON_MAP: Record<string, React.ElementType> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/praesidium": Camera,
  "/dashboard/pilot": Compass,
  "/dashboard/courses": GraduationCap,
  "/dashboard/bookings": Calendar,
  "/dashboard/billing": CreditCard,
  "/dashboard/settings": Settings,
};

export function MobileMenu({
  navItems,
  displayName,
  userEmail,
  isEngaged = false,
  planLabel = "Trial Account",
}: {
  navItems: NavItem[];
  displayName: string;
  userEmail: string;
  isEngaged?: boolean;
  planLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: Record<string, NavItem[]> = {};
  for (const item of navItems) {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  }

  return (
    <>
      {/* Top bar - only visible on < lg */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[var(--color-navy-800)]/95 border-b border-white/5 backdrop-blur px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
          <span className="font-display text-sm text-[var(--color-cream)]">
            OSPG
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 text-[var(--color-cream)]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Drawer overlay */}
      {open && (
        <button
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-[var(--color-navy-800)] border-l border-white/10 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--color-gold-400)]" strokeWidth={1.5} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm text-[var(--color-cream)]">
                OSPG
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
                Dashboard
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 text-[var(--color-silver-200)]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-400)]">
                {group}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.href] ?? LayoutDashboard;
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const showLock = item.engagedOnly && !isEngaged;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] transition-colors ${
                          active
                            ? "bg-[var(--color-gold-400)]/10 text-[var(--color-cream)]"
                            : "text-[var(--color-silver-100)] hover:bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${active ? "text-[var(--color-gold-400)]" : "text-[var(--color-silver-300)]"}`}
                          strokeWidth={1.5}
                        />
                        <span className="flex-1">{item.label}</span>
                        {showLock && (
                          <Lock
                            className="h-3.5 w-3.5 text-[var(--color-silver-400)]"
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

        {/* Drawer footer - plan status + user + sign out */}
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
              <p className="text-[11px] text-[var(--color-silver-400)] truncate">{userEmail}</p>
            </div>
          </div>
          <form action={signOut}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-[var(--color-silver-200)] hover:bg-white/5 hover:text-[var(--color-cream)] transition-colors">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </form>

          {/* Quick public-site links - so the mobile drawer is not a
              dead-end. Lets users navigate back to marketing pages
              without typing the URL. */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-400)]">
              Public Site
            </p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/blog", label: "Insights" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-lg text-[12px] text-[var(--color-silver-300)] hover:bg-white/5 hover:text-[var(--color-cream)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

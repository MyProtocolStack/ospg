import Link from "next/link";
import {
  Camera,
  Compass,
  GraduationCap,
  Calendar,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    href: "/dashboard/praesidium/new",
    icon: Camera,
    title: "Run a PRAESIDIUM Analysis",
    body: "Upload a photo of any campus location. Get an expert-grade vulnerability analysis in 90 seconds.",
    badge: "Most used",
  },
  {
    href: "/dashboard/pilot",
    icon: Compass,
    title: "Talk to PILOT",
    body: "Ask anything about FEMA NSGP grants. PILOT generates threat narratives, investment justifications, and pre-fills forms.",
    badge: "Federal funding",
  },
  {
    href: "/dashboard/courses",
    icon: GraduationCap,
    title: "Browse Training Courses",
    body: "Threat assessment, shelter-in-place, and lockdown scenarios - for staff, volunteers, and ushers.",
  },
  {
    href: "/dashboard/bookings/new",
    icon: Calendar,
    title: "Book Security Detail",
    body: "Vetted retired LE and military veterans for events, weekend masses, school dismissals, and one-off engagements. Coordinated through OSPG.",
  },
];

export default function DashboardHome() {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Dashboard
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-3">
            Welcome to your{" "}
            <span className="italic text-gradient-gold">command center.</span>
          </h1>
          <p className="text-[var(--color-silver-200)] max-w-2xl">
            Run a PRAESIDIUM analysis, talk to PILOT about your FEMA grant
            application, complete training courses, or book a security detail -
            everything in one place.
          </p>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Assessments Run", value: "0", icon: Camera },
            { label: "Active Grants", value: "0", icon: Compass },
            { label: "Courses In Progress", value: "0", icon: GraduationCap },
            { label: "Upcoming Details", value: "0", icon: Calendar },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="surface-card p-5">
                <Icon
                  className="h-5 w-5 text-[var(--color-gold-400)] mb-3"
                  strokeWidth={1.5}
                />
                <div className="font-display text-3xl text-[var(--color-cream)] mb-1">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)]">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <h2 className="font-display text-2xl text-[var(--color-cream)] mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="surface-card p-7 hover:surface-card-elevated transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center">
                    <Icon
                      className="h-5 w-5 text-[var(--color-gold-400)]"
                      strokeWidth={1.5}
                    />
                  </div>
                  {a.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-medium text-[var(--color-gold-400)] px-2 py-1 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/20">
                      {a.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl text-[var(--color-cream)] mb-2 group-hover:text-gradient-gold transition-all">
                  {a.title}
                </h3>
                <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed mb-4">
                  {a.body}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[var(--color-gold-400)] font-medium">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state / first-time CTA */}
        <div className="surface-card-elevated p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--color-gold-400)]/5 blur-[80px] pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles
                  className="h-4 w-4 text-[var(--color-gold-400)]"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium">
                  Get Started
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3">
                Run your first PRAESIDIUM analysis.
              </h3>
              <p className="text-[var(--color-silver-200)] leading-relaxed">
                Pick the most concerning entrance on your property - side door,
                rear loading dock, sanctuary entrance. Snap a photo. Upload it.
                You&apos;ll have a written assessment, annotated photo, and
                downloadable PDF in under two minutes. First analysis is on us.
              </p>
            </div>
            <div className="flex justify-end">
              <Link href="/dashboard/praesidium/new" className="btn-primary">
                Start Free Analysis
                <TrendingUp className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

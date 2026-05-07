import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Camera,
  Compass,
  GraduationCap,
  Users,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getCurrentOrgPlan } from "@/lib/org-plan";

export const metadata = {
  title: "Unlock Full Access - Ocean State Protection Group",
  description:
    "Free OSPG accounts get PRAESIDIUM photo analysis and PILOT grant guidance. Full features unlock for active engagement clients - those who have a delivered SHIELD Assessment or signed retainer.",
};

export const dynamic = "force-dynamic";

const FREE_FEATURES = [
  {
    icon: Camera,
    title: "PRAESIDIUM photo analysis",
    body: "Upload up to 2 property photos. Get AI vulnerability findings instantly.",
  },
  {
    icon: Compass,
    title: "PILOT grant chat",
    body: "Ask anything about FEMA NSGP eligibility, deadlines, threat narratives.",
  },
  {
    icon: GraduationCap,
    title: "Course catalog browse",
    body: "See all training courses we offer. First lesson of each is free preview.",
  },
  {
    icon: Calendar,
    title: "Free walkthrough booking",
    body: "Book the free in-person walkthrough by both founders - the entry path to becoming an engaged client.",
  },
];

const ENGAGED_FEATURES = [
  {
    icon: Camera,
    title: "Unlimited PRAESIDIUM analyses",
    body: "Run AI vulnerability analysis on every door, fenceline, lot, and approach across your campus. No quota.",
  },
  {
    icon: GraduationCap,
    title: "Full course library",
    body: "Active threat training, school safety modules, scenario walkthroughs - all unlocked end to end.",
  },
  {
    icon: Users,
    title: "Security detail booking",
    body: "Book vetted retired LE / military veteran operators for events, dispersal coverage, VIP visits, after-hours patrol.",
  },
  {
    icon: ShieldCheck,
    title: "Direct founder access",
    body: "Priority response from the founders for ongoing operational questions. Quarterly site check-ins included.",
  },
];

export default async function UpgradePage() {
  const plan = await getCurrentOrgPlan();
  const alreadyEngaged = plan?.isEngaged ?? false;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Lock
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.7}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                {alreadyEngaged ? "You're an Engaged Client" : "Unlock Full Access"}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              {alreadyEngaged ? (
                <>
                  Your account is{" "}
                  <span className="italic text-gradient-gold">fully unlocked.</span>
                </>
              ) : (
                <>
                  The path to full access is a{" "}
                  <span className="italic text-gradient-gold">walkthrough</span>,
                  not a checkout.
                </>
              )}
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              {alreadyEngaged
                ? "Thanks for being an active OSPG client. You have unlimited PRAESIDIUM analyses, the full course library, security detail booking, and direct founder access. If anything looks locked, email us - we'll fix it."
                : "OSPG is a high-touch consulting practice, not a SaaS subscription. Free accounts get enough to evaluate us. Active clients - those who've had a SHIELD Assessment delivered or signed a retainer - get the full system."}
            </p>
            {!alreadyEngaged && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                <Link href="/walkthrough" className="btn-primary">
                  <Calendar className="h-4 w-4" />
                  Book Free Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard/praesidium" className="btn-secondary">
                  <Camera className="h-4 w-4" />
                  Run PRAESIDIUM First
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Tier comparison */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Free tier */}
              <div className="surface-card p-7 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)] font-medium">
                    Trial Account
                  </p>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-silver-300)] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    Free
                  </span>
                </div>
                <h2 className="font-display text-2xl text-[var(--color-cream)] mb-2">
                  Evaluate the work
                </h2>
                <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed mb-6">
                  Self-serve. Enough to see the quality of our analysis and
                  decide whether a real walkthrough is worth your time.
                </p>
                <ul className="space-y-3 mb-6 flex-1">
                  {FREE_FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.title} className="flex items-start gap-3">
                        <Icon
                          className="h-4 w-4 text-[var(--color-silver-300)] shrink-0 mt-0.5"
                          strokeWidth={1.5}
                        />
                        <div>
                          <p className="text-[14px] text-[var(--color-cream)] font-medium leading-tight">
                            {f.title}
                          </p>
                          <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed mt-0.5">
                            {f.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/dashboard" className="btn-secondary justify-center">
                  Continue with Trial
                </Link>
              </div>

              {/* Engaged tier */}
              <div className="surface-card-elevated p-7 flex flex-col relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[var(--color-gold-400)]/10 blur-[80px] pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] font-medium">
                      Engaged Client
                    </p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                      Active
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[var(--color-cream)] mb-2">
                    Use the whole system
                  </h2>
                  <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-6">
                    Unlocked when we deliver a paid SHIELD Assessment for your
                    campus or you sign an ongoing retainer. The dashboard
                    becomes your operations layer.
                  </p>
                  <ul className="space-y-3 mb-6 flex-1">
                    {ENGAGED_FEATURES.map((f) => {
                      const Icon = f.icon;
                      return (
                        <li key={f.title} className="flex items-start gap-3">
                          <Icon
                            className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                            strokeWidth={1.5}
                          />
                          <div>
                            <p className="text-[14px] text-[var(--color-cream)] font-medium leading-tight">
                              {f.title}
                            </p>
                            <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed mt-0.5">
                              {f.body}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {alreadyEngaged ? (
                    <Link
                      href="/dashboard"
                      className="btn-primary justify-center"
                    >
                      Open Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/walkthrough"
                      className="btn-primary justify-center"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Free Walkthrough
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How activation actually works */}
        {!alreadyEngaged && (
          <section className="py-16 bg-[var(--color-navy-800)]/40">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
              <div className="text-center mb-12">
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                  Activation Path
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                  How accounts get unlocked.
                </h2>
              </div>

              <ol className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Run a PRAESIDIUM analysis or two",
                    body: "Upload property photos. See the kind of finding-by-finding output we produce. Free, no credit card.",
                  },
                  {
                    step: "2",
                    title: "Book a free walkthrough",
                    body: "Both founders attend. 90 minutes on-site. We tell you honestly whether a paid engagement makes sense for your situation. No obligation.",
                  },
                  {
                    step: "3",
                    title: "Receive a paid SHIELD Assessment",
                    body: "If we're a fit, we deliver the full written assessment with FEMA-grade documentation. This is the engagement event - the moment your account flips to engaged client.",
                  },
                  {
                    step: "4",
                    title: "Dashboard unlocks immediately",
                    body: "Within minutes of delivery, your dashboard reflects the new tier. Unlimited PRAESIDIUM, full courses, detail bookings, founder access.",
                  },
                ].map((s) => (
                  <li
                    key={s.step}
                    className="surface-card p-6 flex items-start gap-5"
                  >
                    <span className="shrink-0 font-display text-3xl text-[var(--color-gold-400)]/40 leading-none">
                      {s.step}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-[var(--color-cream)] mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Already a client clause */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="surface-card p-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2
                  className="h-5 w-5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                  strokeWidth={1.7}
                />
                <h3 className="font-display text-xl text-[var(--color-cream)]">
                  Already worked with us?
                </h3>
              </div>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-2">
                If we delivered a SHIELD Assessment for your school, parish, or
                organization and you're seeing locked features, email us at{" "}
                <span className="text-[var(--color-gold-400)]">
                  Oceanstateprotectiongroup@gmail.com
                </span>
                . We'll activate your account inside 24 hours.
              </p>
              <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
                For v1, account activation is a manual step we run after each
                engagement. Future: automatic upgrade tied to delivery
                milestones in the dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        {!alreadyEngaged && (
          <section className="py-20">
            <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
                Start with a walkthrough.
              </h2>
              <p className="text-[var(--color-silver-200)] mb-10">
                Free. No commitment. Both founders attend. We tell you honestly
                whether a paid engagement makes sense for your campus.
              </p>
              <Link href="/walkthrough" className="btn-primary">
                Book Free Walkthrough
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

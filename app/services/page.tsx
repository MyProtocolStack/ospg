import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import {
  Shield,
  Camera,
  GraduationCap,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Services - Ocean State Protection Group",
  description:
    "SHIELD vulnerability assessments, AI photo analysis, active threat training, security details, and grant-application support. Active-duty Rhode Island law enforcement.",
};

const SERVICES = [
  {
    slug: "shield-assessment",
    icon: Shield,
    name: "SHIELD Assessment",
    blurb:
      "Comprehensive on-site vulnerability assessment by both founders. The deliverable insurance carriers and grant administrators actually accept.",
    features: [
      "Two active-duty officers walk every door, hallway, and approach",
      "Stakeholder interviews with leadership and key personnel",
      "Risk-prioritized written report with cost ranges and vendor pointers",
      "Implementation roadmap and 30-day follow-up",
      "Compatible with FEMA NSGP investment-justification format",
    ],
    cta: "Request Quote",
    ctaHref: "/walkthrough",
    price: "$1,500–$20,000+ (scales with facility)",
    nsgpEligible: true,
  },
  {
    slug: "shield-ai",
    icon: Camera,
    name: "SHIELD AI Photo Analysis",
    blurb:
      "Upload a photo of any property location. Get an expert-grade preliminary assessment in 90 seconds. Powered by Claude vision and tuned by 75+ years of law enforcement and military experience.",
    features: [
      "40+ security markers analyzed per photo",
      "Annotated overlay highlighting each finding",
      "Severity-tagged recommendations with cost estimates",
      "Downloadable PDF report",
      "First analysis free with every account",
    ],
    cta: "Try SHIELD AI",
    ctaHref: "/shield-ai",
    price: "Free with account",
    nsgpEligible: false,
  },
  {
    slug: "training",
    icon: GraduationCap,
    name: "Active Threat Training",
    blurb:
      "Half-day or full-day staff training led by FLETC-certified active threat instructors. Customized to your facility, your protocols, and your operational rhythm.",
    features: [
      "Half-day session: $2,800",
      "Full-day session: $4,800",
      "2-day advanced track: $500 per attendee",
      "Tactical Combat Casualty Care (TCCC) module available",
      "Emergency Operations Plan development: $3,000",
    ],
    cta: "Schedule Training",
    ctaHref: "/walkthrough",
    price: "$2,800–$4,800 per session",
    nsgpEligible: true,
  },
  {
    slug: "security-detail",
    icon: Users,
    name: "Security Detail",
    blurb:
      "Active-duty officer presence for events, dispersal windows, and high-risk meetings. Off-duty rates apply through Cranston PD detail process.",
    features: [
      "Mass dispersal coverage (post-service safety windows)",
      "Event-day uniformed presence",
      "VIP visit coordination",
      "After-hours building check",
      "Booked through dashboard or by phone",
    ],
    cta: "Book Detail",
    ctaHref: "/dashboard/bookings/new",
    price: "Off-duty officer rates apply",
    nsgpEligible: false,
  },
  {
    slug: "enterprise",
    icon: Building2,
    name: "Multi-Site / Enterprise",
    blurb:
      "Diocese-wide, multi-campus, or full security partnership. Drill design, EOP development, ongoing advisory retainer.",
    features: [
      "Quarterly drill design and execution",
      "EOP development and revision",
      "Insurance-carrier liaison",
      "Annual retainer pricing",
      "Single point of contact across portfolio",
    ],
    cta: "Talk to a Founder",
    ctaHref: "/contact",
    price: "Custom annual retainer",
    nsgpEligible: true,
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Shield className="h-3.5 w-3.5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Services
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Five engagements.{" "}
              <span className="italic text-gradient-gold">One operating model.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Whether you need a 30-minute SHIELD AI screen, a full SHIELD
              walkthrough, training for staff, or ongoing diocesan advisory -
              you work with the same two active-duty officers every time.
            </p>
          </div>
        </section>

        {/* Services list */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.slug} className="surface-card p-7 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-[var(--color-gold-400)]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h2 className="font-display text-xl text-[var(--color-cream)]">{s.name}</h2>
                          {s.nsgpEligible && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                              NSGP-Eligible
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[var(--color-silver-300)]">{s.price}</p>
                      </div>
                    </div>

                    <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-5">
                      {s.blurb}
                    </p>

                    <ul className="space-y-2 mb-6 flex-1">
                      {s.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                            strokeWidth={2}
                          />
                          <span className="text-[13px] text-[var(--color-silver-200)] leading-relaxed">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href={s.ctaHref} className="btn-primary w-full justify-center group">
                      {s.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What we are NOT */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="surface-card p-8">
              <AlertTriangle className="h-6 w-6 text-[var(--color-gold-400)] mb-4" strokeWidth={1.5} />
              <h2 className="font-display text-2xl text-[var(--color-cream)] mb-4">
                What we are not
              </h2>
              <ul className="space-y-3">
                {[
                  "We are not a licensed alarm or monitoring company. We do not install or monitor alarm panels.",
                  "We are not a guard agency. We do not staff posts on a recurring full-time basis.",
                  "We are not licensed engineers. Structural and life-safety engineering recommendations are referred to credentialed partners.",
                  "We are not attorneys. Legal review of policies and contracts is referred to outside counsel.",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                    <span className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4">
              Start with a free walkthrough.
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              No commitment. Both founders attend. We tell you which engagement
              fits and whether you qualify for federal funding.
            </p>
            <Link href="/walkthrough" className="btn-primary">
              Book Free Walkthrough
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

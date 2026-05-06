import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  MapPin,
  Award,
  Search,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "Ocean State Protection Group — active-duty law enforcement officers and military veterans building modern security for schools, parishes, and high-net-worth properties across New England.",
};

const METHODOLOGY = [
  {
    step: "1",
    icon: Users,
    title: "Initial Consultation",
    body: "Identify client needs, concerns, and priorities. We listen first — every organization has its own threat profile, culture, and operational rhythm.",
  },
  {
    step: "2",
    icon: Shield,
    title: "On-Site Assessment",
    body: "Comprehensive walkthrough of all facilities. We observe daily operations, entry/exit flow, lockdown capability, and existing protocols in real time.",
  },
  {
    step: "3",
    icon: ClipboardList,
    title: "Stakeholder Interviews",
    body: "Conversations with school leadership, key personnel, and (where appropriate) volunteers and front-line staff. The people on the ground see things leadership doesn't.",
  },
  {
    step: "4",
    icon: AlertTriangle,
    title: "Risk Analysis",
    body: "Identification and prioritization of vulnerabilities. We rank by genuine severity — not alarm — and tag NSGP-grant-eligible items.",
  },
  {
    step: "5",
    icon: FileText,
    title: "Report Development",
    body: "Detailed written report with executive summary, findings, risk-prioritization matrix, and a specific implementation roadmap. Insurance-carrier compatible.",
  },
  {
    step: "6",
    icon: CheckCircle2,
    title: "Follow-Up Consultation",
    body: "Review findings together and assist with implementation planning. We stay engaged after the report is delivered.",
  },
];

const SERVICES = [
  {
    title: "Security & Risk Assessments",
    items: [
      "Full campus and facility evaluations",
      "Access control and entry point analysis",
      "Perimeter and environmental security review",
      "Identification and prioritization of vulnerabilities",
    ],
  },
  {
    title: "Emergency Preparedness",
    items: [
      "Lockdown, evacuation, and shelter-in-place procedures",
      "Crisis response planning",
      "Coordination with local emergency services",
    ],
  },
  {
    title: "Training Services",
    items: [
      "Active-threat-based training",
      "Staff awareness and response training",
      "Scenario-based exercises",
    ],
  },
  {
    title: "Consulting & Advisory",
    items: [
      "Ongoing security consulting",
      "Policy and procedure development",
      "Incident response support",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              About OSPG
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Vigilance,{" "}
              <span className="italic text-gradient-gold">without compromise.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Ocean State Protection Group is a private security and threat-assessment
              firm built by active-duty Rhode Island law-enforcement officers and
              military veterans — for the institutions and individuals that
              can&apos;t afford to be wrong.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
              The Mission
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight mb-8">
              Why we built this.
            </h2>
            <div className="space-y-5 text-[16px] text-[var(--color-silver-100)] leading-[1.8]">
              <p>
                The August 2025 attack on a Catholic church in Minneapolis was the
                inflection point. In the weeks that followed, faith-based institutions
                across the country called every security firm they could find — and
                every firm sent a retired officer to walk the building.
              </p>
              <p>
                We saw the gap immediately. The threat landscape moves faster than
                anyone&apos;s ability to retire from law enforcement and report on
                it. The school-shooting playbook of 2015 doesn&apos;t match what is
                happening in 2026. Current best practices live in active-duty
                briefing rooms — not in textbooks from a decade ago.
              </p>
              <p>
                OSPG exists to close that gap. Our co-founders are sworn
                officers with combined 75+ years of law enforcement and military
                experience. We see what is actually happening because we
                respond to it. We bring that current operational reality into
                walkthroughs at schools, parishes, businesses, and properties
                that need it most.
              </p>
              <p>
                We are not retired. We are not theoretical. We are the people you
                actually want walking your building.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-20 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Active-Duty Authority",
                  body: "Both founders are sworn officers. Every other firm in this space is staffed by retired professionals. The difference is operational currency.",
                },
                {
                  icon: MapPin,
                  title: "Locally Accountable",
                  body: "Headquartered in Rhode Island. Our reputation lives in the same communities we serve. We are not a national firm flying in for a day.",
                },
                {
                  icon: Award,
                  title: "Federally Trained",
                  body: "FLETC Certified Active Shooter Instructors. TCCC, RIEMA, and multiple industry-recognized active threat response credentials. Verified with our chiefs and references on request.",
                },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="surface-card p-7">
                    <Icon
                      className="h-7 w-7 text-[var(--color-gold-400)] mb-5"
                      strokeWidth={1.3}
                    />
                    <h3 className="font-display text-xl text-[var(--color-cream)] mb-2">
                      {p.title}
                    </h3>
                    <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology — 6 step process */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Methodology
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--color-cream)] leading-tight mb-4">
                Our six-step{" "}
                <span className="italic text-gradient-gold">assessment process.</span>
              </h2>
              <p className="text-[var(--color-silver-200)] max-w-2xl mx-auto">
                Structured, professional, and tailored to each client. Same rigor
                every engagement — so your insurer, your bishop, and your safety
                committee see the same evidence on every page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {METHODOLOGY.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div
                    key={i}
                    className="surface-card p-7 relative overflow-hidden hover:surface-card-elevated transition-all duration-500"
                  >
                    <span className="absolute top-4 right-5 font-display text-5xl text-[var(--color-gold-400)]/20 leading-none">
                      {m.step}
                    </span>
                    <Icon
                      className="h-7 w-7 text-[var(--color-gold-400)] mb-5 relative"
                      strokeWidth={1.3}
                    />
                    <h3 className="font-display text-xl text-[var(--color-cream)] mb-2 relative">
                      {m.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed relative">
                      {m.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services scope */}
        <section className="py-24 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Scope of Services
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--color-cream)] leading-tight mb-4">
                What we{" "}
                <span className="italic text-gradient-gold">deliver.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((s, i) => (
                <div key={i} className="surface-card p-7">
                  <h3 className="font-display text-xl text-[var(--color-cream)] mb-4">
                    {s.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex gap-2.5 items-start text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                        <CheckCircle2
                          className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-1"
                          strokeWidth={1.5}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-6 leading-tight">
              Two ways to get started.
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              Free consultation is the lowest-friction first step — no obligation.
              Or talk to one of our founders directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/walkthrough" className="btn-primary group">
                Book Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to a Founder
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

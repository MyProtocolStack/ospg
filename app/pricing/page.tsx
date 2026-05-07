import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SectionPricing } from "../components/SectionPricing";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export const metadata = {
  title: "Pricing - Ocean State Protection Group",
  description:
    "Transparent pricing for SHIELD vulnerability assessments, active threat training, and multi-site enterprise engagements. Built for Catholic schools, parishes, and high-net-worth properties. Federal NSGP grant paths included.",
};

export default function PricingPage() {
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
                Pricing
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Built for the people{" "}
              <span className="italic text-gradient-gold">we actually serve.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              No sales call required to see what something costs. Most of our
              engagements are partially or fully reimbursable through the FEMA
              Nonprofit Security Grant Program for qualifying 501(c)(3) clients.
            </p>
          </div>
        </section>

        <SectionPricing />

        {/* What's included in every engagement */}
        <section className="py-20 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Every Engagement
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                What you get, regardless of tier.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Active-duty officer attention",
                  body: "Both founders are on every walkthrough. Not associates, not retired contractors.",
                },
                {
                  title: "Written deliverables",
                  body: "Every recommendation in writing. Insurance carriers and grant administrators want documentation, and you get it.",
                },
                {
                  title: "FEMA NSGP advisory",
                  body: "If you're eligible, we tell you. We help generate the threat narrative and investment justification artifacts.",
                },
                {
                  title: "30-day follow-up",
                  body: "We circle back at 30 days to verify what was implemented and what stalled. Most firms ghost after the report.",
                },
                {
                  title: "Compliance-aware copy",
                  body: "Documents written to satisfy your insurance carrier, not to fluff up a sales pitch.",
                },
                {
                  title: "Local accountability",
                  body: "Headquartered in Rhode Island. We see our clients in the same towns we live in.",
                },
              ].map((row) => (
                <div key={row.title} className="surface-card p-6">
                  <h3 className="font-display text-lg text-[var(--color-cream)] mb-2">
                    {row.title}
                  </h3>
                  <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed">
                    {row.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4">
              Not sure which tier you need?
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              Start with a free walkthrough. Both founders attend. We tell you
              honestly which engagement fits, and whether you qualify for NSGP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/walkthrough" className="btn-primary">
                Book Free Walkthrough
                <ArrowRight className="h-4 w-4" />
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

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import { ArrowRight, Shield, MapPin, Award } from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "Lighthouse Protection Group — active-duty law enforcement officers building modern security for schools, parishes, and high-net-worth properties across New England.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              About Lighthouse
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Vigilance,{" "}
              <span className="italic text-gradient-gold">without compromise.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Lighthouse Protection Group is a private security and threat-assessment
              firm built by two active-duty Rhode Island law-enforcement officers — for
              the institutions and individuals that can&apos;t afford to be wrong.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 prose-block">
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
                anyone&apos;s ability to retire from law enforcement and report on it.
                The school shooting playbook of 2015 doesn&apos;t match what&apos;s
                happening in 2026. The current best practices live in active-duty
                briefing rooms — not in a textbook from a decade ago.
              </p>
              <p>
                Lighthouse exists to close that gap. We&apos;re currently sworn
                officers. We see what&apos;s actually happening because we
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
                  body: "FLETC-certified. Active in regional intelligence-sharing networks. Verified with our chiefs and references on request.",
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

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-6 leading-tight">
              Two ways to get started.
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              Free walkthrough is the lowest-friction first step — 90 minutes, no
              obligation. Or talk to one of our founders directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/walkthrough" className="btn-primary group">
                Book Free Walkthrough
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

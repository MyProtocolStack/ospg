import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ReadinessDiagnostic } from "./diagnostic";
import { Eye, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Readiness Diagnostic - Ocean State Protection Group",
  description:
    "Free 4-minute self-assessment for schools, parishes, and dioceses. Get a personalized risk tier, top vulnerability categories, FEMA NSGP eligibility verdict, and recommended next step. Built from the same questions OSPG founders run during a SHIELD walkthrough.",
};

export default function ReadinessPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Sparkles
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Readiness Diagnostic
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Where does your security{" "}
              <span className="italic text-gradient-gold">actually stand?</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Ten questions. Four minutes. A real assessment of your physical
              security posture, your top vulnerability categories, your FEMA
              NSGP grant eligibility, and the engagement tier that actually
              fits your situation. Free, no signup required to see results.
            </p>
          </div>
        </section>

        {/* Diagnostic */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <ReadinessDiagnostic />
          </div>
        </section>

        {/* Why it works */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                How this is different
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                Built from a real walkthrough.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Eye,
                  title: "Same questions we ask on site",
                  body: "Every question maps to something we evaluate during a SHIELD walkthrough. The diagnostic is a preview of the real assessment, not a marketing gate.",
                },
                {
                  icon: ShieldCheck,
                  title: "Honest output, not upsell",
                  body: "If your posture is strong, the diagnostic says so and recommends a lighter engagement. If gaps are real, it surfaces them by category with severity tags.",
                },
                {
                  icon: Sparkles,
                  title: "FEMA NSGP eligibility logic",
                  body: "The NSGP verdict is computed from your tax status, threat profile, and incident history - the same factors a state administering agency reviewer would weigh.",
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="surface-card p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-4">
                      <Icon
                        className="h-5 w-5 text-[var(--color-gold-400)]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-display text-lg text-[var(--color-cream)] mb-2 leading-tight">
                      {c.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

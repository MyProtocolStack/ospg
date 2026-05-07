import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WalkthroughForm } from "./form";
import {
  Shield,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Book Free Walkthrough",
  description:
    "90 minutes. Two officers. One look at your campus. No invoice. No obligation.",
};

const WHAT_HAPPENS = [
  {
    icon: Shield,
    title: "We arrive in plain clothes",
    body: "Two active-duty Cranston PD officers. We don't bring uniforms or badges visible - your community doesn't know we're security.",
  },
  {
    icon: Clock,
    title: "90 minutes on-site",
    body: "We walk your property the way an attacker would, then the way a defender would. You walk with us.",
  },
  {
    icon: Users,
    title: "Verbal top-3 before we leave",
    body: "Before we drive off, you have the three highest-impact things to fix today. No paperwork, no follow-up sales call required.",
  },
  {
    icon: CheckCircle2,
    title: "What's next is your call",
    body: "If we're a fit, we propose the full SHIELD Assessment. If not, no harm done. You got a free outside set of eyes.",
  },
];

export default function WalkthroughPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              Free Walkthrough Request
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              90 minutes.{" "}
              <span className="italic text-gradient-gold">Two officers.</span>{" "}
              One look at your campus.
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              No invoice. No obligation. We walk your property with you, give
              you the top three things we&apos;d fix today, and you decide what
              comes next.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* What happens */}
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                What Happens
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-8 leading-tight">
                Here&apos;s exactly what to expect.
              </h2>
              <ul className="space-y-6">
                {WHAT_HAPPENS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <li key={i} className="flex gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center">
                        <Icon
                          className="h-5 w-5 text-[var(--color-gold-400)]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-[var(--color-cream)] mb-1">
                          {s.title}
                        </h3>
                        <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Form */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="surface-card-elevated p-8">
                <h3 className="font-display text-2xl text-[var(--color-cream)] mb-2">
                  Request your slot.
                </h3>
                <p className="text-[14px] text-[var(--color-silver-200)] mb-6">
                  We confirm availability within 24 hours. Most walkthroughs
                  happen within 2 weeks.
                </p>
                <WalkthroughForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

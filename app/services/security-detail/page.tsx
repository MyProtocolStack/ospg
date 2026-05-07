import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import Link from "next/link";
import {
  Users,
  Shield,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Security Detail - Ocean State Protection Group",
  description:
    "Vetted retired law enforcement and military veterans booked for events, mass dispersal windows, VIP visits, and after-hours coverage. Coordinated through OSPG's network. Active-duty officers are never used for private detail work.",
};

export default function SecurityDetailPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Users className="h-3.5 w-3.5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Security Detail
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Retired law enforcement.{" "}
              <span className="italic text-gradient-gold">Military veterans.</span>{" "}
              On your property.
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              When you need a uniformed presence on site, OSPG dispatches
              vetted operators from our network of retired law enforcement and
              military veterans. Coordinated, insured, and accountable to
              OSPG - not a third-party staffing agency.
            </p>
          </div>
        </section>

        {/* Compliance / who staffs it */}
        <section className="pt-12 pb-4">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="surface-card p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2 font-medium">
                  Who actually shows up
                </p>
                <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-2">
                  Every operator on an OSPG security detail is a{" "}
                  <strong className="text-[var(--color-cream)]">retired law enforcement officer or military veteran</strong>{" "}
                  vetted, contracted, and insured through OSPG. Active-duty
                  officers are never used for private security detail work,
                  including our two co-founders. Founders lead assessments,
                  training, and engagement design - they do not work the
                  detail itself.
                </p>
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
                  This is the legally and professionally correct model for
                  Rhode Island and the surrounding states.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Common Engagements
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                When clients book a detail.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: Calendar,
                  title: "Mass dispersal coverage",
                  body: "Sunday and weekday evening Mass have a 15-20 minute peak vulnerability window when 200+ congregants reach their cars. A trained, uniformed presence in the lot during dispersal is the highest-leverage detail booking for parishes.",
                },
                {
                  icon: Users,
                  title: "Special events",
                  body: "Confirmation, graduation, fundraisers, large funerals, school plays. Anything where attendance spikes outside your normal operational rhythm.",
                },
                {
                  icon: Shield,
                  title: "VIP visits",
                  body: "Bishop visits, donor receptions, alumni dignitary events. Coordinated entry and discreet visibility throughout the event.",
                },
                {
                  icon: Clock,
                  title: "After-hours coverage",
                  body: "Construction site coverage, evening tutoring, extended-day school programs, late staff meetings. Right-sized to the hours you actually need.",
                },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.title} className="surface-card p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-lg text-[var(--color-cream)] mb-2">{row.title}</h3>
                    <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">{row.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-3 text-center leading-tight">
              How a detail is booked through OSPG.
            </h2>
            <p className="text-[var(--color-silver-200)] text-center mb-12 max-w-2xl mx-auto">
              You contract with OSPG. OSPG selects operators from our network,
              briefs them on your event, and stands behind the engagement.
              You never have to vet, schedule, or manage individual operators
              yourself.
            </p>

            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Submit the request",
                  body: "Use the dashboard booking form or call us. Include date, time window, location, the nature of the event, and any special considerations.",
                },
                {
                  step: "2",
                  title: "OSPG matches operators",
                  body: "We select retired LE / military veterans from our network whose experience profile fits the engagement. You get a written confirmation with the assigned operator profile and the all-in rate.",
                },
                {
                  step: "3",
                  title: "Pre-event briefing",
                  body: "We connect with you 24-48 hours before the event to confirm specifics: parking, contact person, access, expectations. Operators receive a written event brief.",
                },
                {
                  step: "4",
                  title: "On-site presence",
                  body: "Operators arrive 15 minutes before the start window. Uniformed, trained, and prepared. OSPG owns operator conduct on site - if anything is off, you call us, not them.",
                },
                {
                  step: "5",
                  title: "Invoice and after-action",
                  body: "Single invoice from OSPG. Brief written after-action note delivered with the invoice covering anything notable from the engagement.",
                },
              ].map((s) => (
                <div key={s.step} className="surface-card p-6 flex items-start gap-5">
                  <span className="shrink-0 font-display text-3xl text-[var(--color-gold-400)]/40 leading-none">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-[var(--color-cream)] mb-1.5">{s.title}</h3>
                    <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing transparency */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="surface-card p-8">
              <h2 className="font-display text-2xl text-[var(--color-cream)] mb-4">Pricing</h2>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-4">
                Transparent flat rates. No hidden fees, no per-engagement
                negotiation. 4-hour minimum on every detail.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Weekday rate (Monday-Friday): $75 per hour, 4-hour minimum",
                  "Weekend rate (Saturday-Sunday): $90 per hour, 4-hour minimum",
                  "Detail officers are former law enforcement, vetted and insured through OSPG",
                  "Recurring weekly engagements eligible for blocked-rate arrangements",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[13px] text-[var(--color-silver-200)] leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/20">
                <AlertCircle className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-[12px] text-[var(--color-silver-100)] leading-relaxed">
                  Holiday rates and overnight engagements may carry a
                  supplemental rate. All operators are insured under OSPG&apos;s
                  commercial security-services policy for the duration of the
                  engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4">
              Need coverage soon?
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              Most details require 5-10 business days lead time so we can
              match the right operator to the engagement. For urgent
              requests, call us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/bookings/new" className="btn-primary">
                Book a Detail
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Call or Email
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

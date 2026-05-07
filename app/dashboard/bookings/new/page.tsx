import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewBookingForm } from "./form";
import { getCurrentOrgPlan } from "@/lib/org-plan";
import { LockedFeature } from "@/app/components/LockedFeature";

export const metadata = { title: "Request Security Detail" };
export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  // Security details (uniformed presence by retired LE / military veterans)
  // are an engaged-client feature. Free users cannot book details directly -
  // they're routed to /walkthrough first, which is the conversion path.
  const plan = await getCurrentOrgPlan();
  if (!plan?.isEngaged) {
    return (
      <LockedFeature
        feature="Security detail booking"
        description="OSPG security details - retired law enforcement and military veterans for events, dispersal coverage, VIP visits - are coordinated for active engagement clients. New visitors start with a free walkthrough so we can match the right operators to your specific environment."
        unlocks={[
          "Vetted retired LE / military veteran operators",
          "Mass dispersal, event coverage, VIP visits, after-hours patrol",
          "Coordinated, insured, and accountable through OSPG",
          "Direct dashboard booking with operator profiles and confirmations",
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bookings
        </Link>

        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            New Booking
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            Request a security detail
          </h1>
          <p className="text-[var(--color-silver-200)]">
            Tell us when, where, and what. We confirm availability within 24
            hours.
          </p>
        </div>

        <div className="surface-card-elevated p-8">
          <NewBookingForm />
        </div>
      </div>
    </div>
  );
}

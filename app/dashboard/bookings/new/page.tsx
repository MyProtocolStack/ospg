import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewBookingForm } from "./form";

export const metadata = { title: "Request Security Detail" };

export default function NewBookingPage() {
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

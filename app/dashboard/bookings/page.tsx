import Link from "next/link";
import { Calendar, ArrowRight, Plus, Clock, MapPin } from "lucide-react";

export const metadata = { title: "Security Detail Bookings" };

export default function BookingsIndexPage() {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
              Bookings
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
              Security Detail
            </h1>
            <p className="text-[var(--color-silver-200)]">
              Active-duty officers for events, weekend services, school
              dismissals, and one-off engagements.
            </p>
          </div>
          <Link href="/dashboard/bookings/new" className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            New Booking
          </Link>
        </div>

        {/* Empty state */}
        <div className="surface-card-elevated p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-5">
            <Calendar
              className="h-8 w-8 text-[var(--color-gold-400)]"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-display text-2xl text-[var(--color-cream)] mb-3">
            No upcoming bookings.
          </h2>
          <p className="text-[var(--color-silver-200)] max-w-md mx-auto mb-7">
            Request a security detail for any event. We confirm availability
            within 24 hours.
          </p>
          <Link href="/dashboard/bookings/new" className="btn-primary">
            Request Detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Rate card */}
        <div className="mt-10 surface-card p-7">
          <h3 className="font-display text-xl text-[var(--color-cream)] mb-4">
            Detail rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Clock
                className="h-5 w-5 text-[var(--color-gold-400)] mb-2"
                strokeWidth={1.5}
              />
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-silver-300)] mb-1">
                Standard rate
              </p>
              <p className="text-[var(--color-cream)] font-display text-xl">
                $200<span className="text-[14px] text-[var(--color-silver-300)]">/hr</span>
              </p>
              <p className="text-[12px] text-[var(--color-silver-300)] mt-1">4-hour minimum</p>
            </div>
            <div>
              <MapPin
                className="h-5 w-5 text-[var(--color-gold-400)] mb-2"
                strokeWidth={1.5}
              />
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-silver-300)] mb-1">
                Elevated threat
              </p>
              <p className="text-[var(--color-cream)] font-display text-xl">
                $250<span className="text-[14px] text-[var(--color-silver-300)]">/hr</span>
              </p>
              <p className="text-[12px] text-[var(--color-silver-300)] mt-1">Specific threat indicators</p>
            </div>
            <div>
              <Calendar
                className="h-5 w-5 text-[var(--color-gold-400)] mb-2"
                strokeWidth={1.5}
              />
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-silver-300)] mb-1">
                Full-time / contract
              </p>
              <p className="text-[var(--color-cream)] font-display text-xl">Custom</p>
              <p className="text-[12px] text-[var(--color-silver-300)] mt-1">Multi-shift / ongoing</p>
            </div>
          </div>
          <p className="mt-5 text-[12px] text-[var(--color-silver-400)] leading-relaxed">
            OSPG detail officers are off-duty Cranston PD personnel
            operating under their department&apos;s extra-duty authorization. All
            engagements include liability coverage.
          </p>
        </div>
      </div>
    </div>
  );
}

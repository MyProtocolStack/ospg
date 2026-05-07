/**
 * Reusable "engaged client only" gate. Render this in place of the actual
 * feature when the current user's org is on the free plan and the feature
 * requires engagement.
 *
 * Usage:
 *   import { LockedFeature } from "@/app/components/LockedFeature";
 *
 *   if (!plan.isEngaged) return <LockedFeature feature="Course library" />;
 *
 * Server component. No client-side state.
 */
import Link from "next/link";
import { Lock, Calendar, Camera, ArrowRight, ShieldCheck } from "lucide-react";

type LockedFeatureProps = {
  /** What the user was trying to access ("Course library", "Detail booking", etc.) */
  feature: string;
  /** Optional one-line description. */
  description?: string;
  /** Optional list of bullets describing what they unlock. */
  unlocks?: string[];
};

export function LockedFeature({
  feature,
  description,
  unlocks,
}: LockedFeatureProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full surface-card-elevated p-8 md:p-12 relative overflow-hidden">
        {/* Decorative gold halo */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-400)]/8 blur-[100px] pointer-events-none" />

        <div className="relative">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
              <Lock
                className="h-6 w-6 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-2 font-medium">
                Engaged Client Only
              </p>
              <h1 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] leading-tight">
                {feature} is unlocked for{" "}
                <span className="italic text-gradient-gold">
                  active OSPG clients.
                </span>
              </h1>
            </div>
          </div>

          <p className="text-[15px] text-[var(--color-silver-100)] leading-relaxed mb-6">
            {description ??
              "OSPG runs a high-touch consulting practice. Free accounts get PRAESIDIUM photo analysis (2 free runs) and the PILOT chatbot to help you qualify. Full features unlock once we deliver a SHIELD Assessment for your campus or sign an ongoing retainer."}
          </p>

          {unlocks && unlocks.length > 0 && (
            <div className="mb-7 p-5 rounded-xl bg-[var(--color-navy-800)]/60 border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
                What this unlocks
              </p>
              <ul className="space-y-2">
                {unlocks.map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[14px] text-[var(--color-silver-100)] leading-relaxed"
                  >
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link href="/walkthrough" className="btn-primary justify-center">
              <Calendar className="h-4 w-4" />
              Book Free Walkthrough
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/praesidium/new"
              className="btn-secondary justify-center"
            >
              <Camera className="h-4 w-4" />
              Run PRAESIDIUM
            </Link>
          </div>

          <div className="flex items-start gap-2.5 pt-5 border-t border-white/5">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[var(--color-silver-400)] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <p className="text-[11px] text-[var(--color-silver-400)] leading-relaxed">
              Already worked with us? Email{" "}
              <span className="text-[var(--color-gold-400)]">
                Oceanstateprotectiongroup@gmail.com
              </span>{" "}
              and we will activate your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

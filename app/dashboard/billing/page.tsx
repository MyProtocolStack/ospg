import Link from "next/link";
import { CreditCard, Sparkles, Check } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { BillingActions } from "./client";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Billing
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            Plan &amp; payment
          </h1>
          <p className="text-[var(--color-silver-200)]">
            Manage your subscription, view invoices, update payment methods.
          </p>
        </div>

        {/* Current plan */}
        <div className="surface-card-elevated p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
              <CreditCard
                className="h-6 w-6 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-2">
                Current Plan
              </p>
              <h2 className="font-display text-2xl text-[var(--color-cream)] mb-2">
                Free
              </h2>
              <p className="text-[14px] text-[var(--color-silver-200)] mb-5">
                You&apos;re on the free plan. Upgrade to unlock unlimited SHIELD AI
                analyses, full course library, quarterly walkthroughs, and PILOT.
              </p>
              <BillingActions />
            </div>
          </div>
        </div>

        {/* Upgrade tiers */}
        <h3 className="font-display text-2xl text-[var(--color-cream)] mb-5">
          Upgrade options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BRAND.tiers
            .filter((t) => t.slug === "shield" || t.slug === "training")
            .map((tier) => (
              <div
                key={tier.slug}
                className={
                  tier.featured
                    ? "surface-card-elevated p-7 relative"
                    : "surface-card p-7"
                }
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-gold-400)] to-[var(--color-gold-300)] flex items-center gap-1.5">
                    <Sparkles
                      className="h-3 w-3 text-[var(--color-navy-700)]"
                      strokeWidth={2}
                    />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-navy-700)]">
                      Most Popular
                    </span>
                  </div>
                )}
                <h4 className="font-display text-xl text-[var(--color-cream)] mb-2">
                  {tier.name}
                </h4>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="font-display text-3xl text-gradient-gold">
                    {tier.price}
                  </span>
                  <span className="text-[13px] text-[var(--color-silver-300)]">
                    {tier.period}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed mb-5 min-h-[60px]">
                  {tier.blurb}
                </p>
                {"features" in tier && Array.isArray(tier.features) && (
                  <ul className="space-y-2 mb-6">
                    {tier.features.slice(0, 4).map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                          strokeWidth={2}
                        />
                        <span className="text-[12px] text-[var(--color-silver-200)] leading-snug">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <UpgradeButton tierSlug={tier.slug} featured={tier.featured} />
              </div>
            ))}
        </div>

        <p className="mt-10 text-center text-[12px] text-[var(--color-silver-400)]">
          Need enterprise pricing or multi-site / diocese-wide?{" "}
          <Link href="/contact" className="link-underline text-[var(--color-silver-200)]">
            Talk to a founder
          </Link>
        </p>
      </div>
    </div>
  );
}

function UpgradeButton({ tierSlug, featured }: { tierSlug: string; featured?: boolean }) {
  // Server component; we render a client form button
  return <UpgradeButtonClient tierSlug={tierSlug} featured={featured} />;
}

import { UpgradeButtonClient } from "./client";

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SectionPricing() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
            Investment
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight">
            Transparent pricing.{" "}
            <span className="italic text-gradient-gold">Federal funding paths.</span>
          </h2>
          <div className="gold-rule mt-8" />
          <p className="mt-8 text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
            Most security firms hide pricing behind a sales call. We don't.
            Here's exactly what each tier costs and what's included. NSGP-eligible expenses noted.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRAND.tiers.map((tier, i) => (
            <motion.div
              key={tier.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={cn(
                "relative p-7 rounded-2xl flex flex-col",
                tier.featured ? "surface-card-elevated" : "surface-card",
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-gold-400)] to-[var(--color-gold-300)] flex items-center gap-1.5">
                  <Star
                    className="h-3 w-3 text-[var(--color-navy-700)] fill-[var(--color-navy-700)]"
                  />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-navy-700)]">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="font-display text-[20px] text-[var(--color-cream)] mb-2">
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-display text-4xl text-gradient-gold">
                  {tier.price}
                </span>
                <span className="text-[13px] text-[var(--color-silver-300)]">
                  {tier.period}
                </span>
              </div>
              <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed mb-6 min-h-[60px]">
                {tier.blurb}
              </p>

              {"features" in tier && Array.isArray(tier.features) && (
                <ul className="space-y-2.5 mb-8 flex-1">
                  {(tier.features as readonly string[]).slice(0, 5).map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5">
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

              <Link
                href={`/${tier.slug}`}
                className={cn(
                  "w-full justify-center group",
                  tier.featured ? "btn-primary" : "btn-secondary"
                )}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-[13px] text-[var(--color-silver-300)] mb-3">
            Looking for hourly security details? <Link href="/walkthrough" className="text-[var(--color-gold-400)] link-underline">Request a quote</Link>
            {" • "}
            Multi-site or diocese-wide? <Link href="/contact" className="text-[var(--color-gold-400)] link-underline">Talk to a founder</Link>
          </p>
          <p className="text-[11px] text-[var(--color-silver-400)] max-w-xl mx-auto leading-relaxed">
            SHIELD Assessments may be eligible for FEMA Nonprofit Security
            Grant (NSGP) funding for qualifying 501(c)(3) organizations. We
            provide grant-application support to evaluate eligibility.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

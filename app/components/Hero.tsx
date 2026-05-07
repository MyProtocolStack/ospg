"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-hero-gradient grain pt-36 pb-32 overflow-hidden">
      {/* Background decorative orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-[var(--color-navy-300)]/20 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
          className="flex items-center gap-2 justify-center mb-8"
        >
          <div className="px-4 py-1.5 surface-card border-glow-gold inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
            <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
              Active-Duty Law Enforcement
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.7, 0, 0.3, 1] }}
          className="font-display text-center text-5xl md:text-7xl lg:text-[88px] leading-[1.05] tracking-[-0.03em] text-[var(--color-cream)] mb-7 max-w-5xl mx-auto"
        >
          Protect Your Sanctuary{" "}
          <span className="italic text-gradient-gold">Before</span> Threats
          Find It.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.7, 0, 0.3, 1] }}
          className="text-center text-lg md:text-xl text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Federally-funded vulnerability assessments, AI-powered threat
          intelligence, and grant-application support - for schools, parishes,
          and properties that can&apos;t afford to be wrong.
        </motion.p>

        {/* Primary CTA - Try SHIELD AI Free (oversized, glowing, dominant) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.7, 0, 0.3, 1] }}
          className="flex flex-col items-center mb-6"
        >
          <div className="relative group">
            {/* Animated gold halo behind the button */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[var(--color-gold-400)] via-[var(--color-gold-300)] to-[var(--color-gold-400)] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
            <Link
              href="/shield-ai"
              className="relative inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 rounded-2xl bg-gradient-to-r from-[var(--color-gold-400)] to-[var(--color-gold-300)] text-[var(--color-navy-700)] font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight shadow-2xl shadow-[var(--color-gold-400)]/40 hover:shadow-[var(--color-gold-400)]/60 hover:scale-[1.02] transition-all duration-300"
            >
              <Sparkles
                className="h-6 w-6 md:h-7 md:w-7"
                strokeWidth={2}
              />
              Try SHIELD AI Free
              <ArrowRight
                className="h-6 w-6 md:h-7 md:w-7 transition-transform group-hover:translate-x-1.5"
                strokeWidth={2}
              />
            </Link>
          </div>

          {/* Microcopy under the button */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mt-5 text-[12px] md:text-[13px] text-[var(--color-silver-100)]">
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-gold-400)]">✓</span>
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-gold-400)]">✓</span>
              See real findings in 90 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-gold-400)]">✓</span>
              Built for schools, parishes, estates
            </span>
          </div>
        </motion.div>

        {/* Secondary CTA - book walkthrough (smaller, supporting) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.7, 0, 0.3, 1] }}
          className="flex justify-center mb-20"
        >
          <Link
            href="/walkthrough"
            className="inline-flex items-center gap-2 text-[14px] text-[var(--color-silver-100)] hover:text-[var(--color-cream)] transition-colors group"
          >
            Or book a free in-person walkthrough
            <ArrowRight
              className="h-3.5 w-3.5 text-[var(--color-gold-400)] transition-transform group-hover:translate-x-1"
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 surface-card overflow-hidden max-w-4xl mx-auto"
        >
          {[
            { value: "75+", label: "Years Combined LE / Military" },
            { value: "$200K", label: "FEMA Grant Per Site" },
            { value: "FLETC", label: "Active Shooter Instructors" },
            { value: "<24hr", label: "Response Time" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--color-navy-700)]/50 p-6 text-center"
            >
              <div className="font-display text-2xl md:text-3xl text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-navy-700)] pointer-events-none" />
    </section>
  );
}

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

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.7, 0, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/walkthrough" className="btn-primary group">
            Book Free Walkthrough
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/signup" className="btn-secondary">
            Try SHIELD AI
            <Sparkles className="h-4 w-4" />
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

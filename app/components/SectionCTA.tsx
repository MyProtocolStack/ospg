"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function SectionCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
            Start Where It's Free
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
            90 minutes.{" "}
            <span className="italic text-gradient-gold">Two officers.</span>{" "}
            One look at your campus.
          </h2>
          <p className="mt-8 text-lg md:text-xl text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed mb-12">
            No invoice. No obligation. We walk your property with you, give
            you the top three things we'd fix today, and you decide what comes
            next. Worst case, you got a free outside set of eyes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/walkthrough" className="btn-primary group">
              Book Free Walkthrough
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="tel:+14015550100" className="btn-secondary">
              <Phone className="h-4 w-4" />
              Call Direct
            </a>
          </div>

          <p className="mt-12 text-[13px] text-[var(--color-silver-300)]">
            Headquartered in Rhode Island • Serving Catholic schools, parishes, and properties across New England
          </p>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Shield, Award } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function SectionFounders() {
  return (
    <section className="relative py-32 bg-[var(--color-navy-800)]/40 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
            The Operators
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight max-w-4xl mx-auto">
            Active-duty.{" "}
            <span className="italic text-gradient-gold">Not retired.</span>
          </h2>
          <div className="gold-rule mt-8" />
          <p className="mt-8 text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
            Every other firm in this space is staffed by retired law-enforcement
            professionals. We're the only one currently wearing the uniform.
            We see what's actually happening — not what was happening when we
            wore the badge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {BRAND.founders.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="surface-card-elevated p-8 group"
            >
              {/* Avatar placeholder */}
              <div className="relative mb-6 inline-flex">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-navy-500)] via-[var(--color-navy-600)] to-[var(--color-navy-700)] border-2 border-[var(--color-gold-400)]/30 flex items-center justify-center text-3xl font-display text-gradient-gold">
                  {f.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter((c) => /[A-Z]/.test(c))
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--color-gold-400)] flex items-center justify-center border-4 border-[var(--color-navy-800)]">
                  <Shield
                    className="h-4 w-4 text-[var(--color-navy-700)]"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <h3 className="font-display text-2xl text-[var(--color-cream)] mb-1">
                {f.name}
              </h3>
              <p className="text-[14px] text-[var(--color-gold-400)] mb-1 font-medium">
                {f.title}
              </p>
              <p className="text-[12px] uppercase tracking-[0.15em] text-[var(--color-silver-300)] mb-5">
                {f.role}
              </p>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-5">
                {f.bio}
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                <Award
                  className="h-4 w-4 text-[var(--color-gold-400)]"
                  strokeWidth={1.5}
                />
                <span className="text-[12px] uppercase tracking-[0.15em] text-[var(--color-silver-200)]">
                  FLETC Certified
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

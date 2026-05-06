"use client";

import { motion } from "framer-motion";
import { Shield, Award, Check } from "lucide-react";
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
            professionals. We&apos;re currently wearing the uniform.
            We see what&apos;s actually happening - not what was happening when
            we wore the badge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {BRAND.founders.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="surface-card-elevated p-8 group"
            >
              {/* Avatar with initials */}
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
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-6">
                {f.bio}
              </p>

              {/* Credentials list */}
              {"credentials" in f && Array.isArray(f.credentials) && (
                <div className="pt-5 border-t border-white/5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium mb-3 flex items-center gap-2">
                    <Award className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Credentials &amp; Certifications
                  </p>
                  <ul className="space-y-1.5">
                    {(f.credentials as readonly string[]).map((c, j) => (
                      <li key={j} className="flex gap-2 items-start text-[13px] text-[var(--color-silver-100)] leading-snug">
                        <Check
                          className="h-3.5 w-3.5 text-[var(--color-gold-400)] shrink-0 mt-1"
                          strokeWidth={2}
                        />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

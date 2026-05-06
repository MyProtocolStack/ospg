"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Shield, Calendar } from "lucide-react";

const STATS = [
  {
    icon: AlertTriangle,
    value: "533+",
    label: "deaths from faith-based and school violence",
    source: "FBI / DHS aggregated reporting",
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "surge in synagogue and church targeting since 2023",
    source: "FBI Hate Crime Statistics",
  },
  {
    icon: Calendar,
    value: "Aug 2025",
    label: "Minneapolis Catholic church shooting reset the threat landscape",
    source: "Public reporting",
  },
  {
    icon: Shield,
    value: "$200K",
    label: "available per-site through FEMA NSGP for nonprofits at risk",
    source: "FEMA Nonprofit Security Grant Program",
  },
];

export function SectionThreatLandscape() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
            The Threat Landscape
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight max-w-3xl mx-auto">
            What's changed{" "}
            <span className="italic text-gradient-gold">since 2023</span>.
          </h2>
          <div className="gold-rule mt-8" />
          <p className="mt-8 text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
            Catholic schools, parishes, and religious institutions sit at the
            intersection of two trend lines moving in the wrong direction.
            The data is public. The math has changed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="surface-card p-7 hover:surface-card-elevated transition-all duration-500 group"
              >
                <Icon
                  className="h-7 w-7 text-[var(--color-gold-400)] mb-6 transition-transform group-hover:scale-110"
                  strokeWidth={1.3}
                />
                <div className="font-display text-4xl text-gradient-gold mb-3">
                  {stat.value}
                </div>
                <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-4">
                  {stat.label}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-silver-400)] pt-3 border-t border-white/5">
                  {stat.source}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

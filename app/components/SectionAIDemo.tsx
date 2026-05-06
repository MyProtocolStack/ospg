"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Camera,
  FileText,
  Layers3,
  CheckCircle2,
} from "lucide-react";

export function SectionAIDemo() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Sparkles
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Powered by Claude Vision
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight mb-6">
              Meet{" "}
              <span className="italic text-gradient-gold">SHIELD AI</span>.
            </h2>
            <p className="text-lg text-[var(--color-silver-100)] leading-relaxed mb-8 max-w-lg">
              Upload a photo of any door, hallway, parking lot, or gathering
              area. Get an expert-grade vulnerability analysis in 90 seconds —
              prioritized, actionable, and grant-application ready.
            </p>

            <div className="space-y-4 mb-10">
              {[
                {
                  icon: Camera,
                  title: "Upload",
                  body: "Snap a photo with your phone. Side entrance, classroom door, fenceline, parking lot — anything.",
                },
                {
                  icon: Layers3,
                  title: "Analyze",
                  body: "SHIELD AI evaluates 40+ security markers: lockdown capability, sightlines, hardening, lighting, access control.",
                },
                {
                  icon: FileText,
                  title: "Receive",
                  body: "Detailed text assessment + annotated image + downloadable PDF report. All three. Ready for your insurer.",
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center">
                      <Icon
                        className="h-5 w-5 text-[var(--color-gold-400)]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h4 className="font-display text-[18px] text-[var(--color-cream)] mb-1">
                        {step.title}
                      </h4>
                      <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/shield-ai" className="btn-primary group">
              Try SHIELD AI Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — Visual demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative glow */}
            <div className="absolute -inset-10 bg-[var(--color-gold-400)]/10 blur-[80px] pointer-events-none" />

            <div className="relative surface-card-elevated p-1 animate-pulse-glow rounded-[20px] overflow-hidden">
              <div className="bg-[var(--color-navy-800)] rounded-[18px] p-6">
                {/* Mock image area */}
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-[var(--color-navy-600)] via-[var(--color-navy-700)] to-[var(--color-navy-800)] border border-white/5 mb-4 relative overflow-hidden">
                  {/* Mock annotations */}
                  <div className="absolute top-[15%] left-[10%] w-12 h-12 rounded-full border-2 border-[var(--color-gold-400)] bg-[var(--color-gold-400)]/10 animate-pulse-glow flex items-center justify-center">
                    <span className="text-[var(--color-gold-400)] text-xs font-bold">
                      1
                    </span>
                  </div>
                  <div
                    className="absolute top-[55%] left-[60%] w-12 h-12 rounded-full border-2 border-[var(--color-crimson-500)] bg-[var(--color-crimson-500)]/10 animate-pulse-glow flex items-center justify-center"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <span className="text-[var(--color-crimson-500)] text-xs font-bold">
                      2
                    </span>
                  </div>
                  <div
                    className="absolute top-[35%] left-[40%] w-12 h-12 rounded-full border-2 border-[var(--color-gold-400)] bg-[var(--color-gold-400)]/10 animate-pulse-glow flex items-center justify-center"
                    style={{ animationDelay: "1s" }}
                  >
                    <span className="text-[var(--color-gold-400)] text-xs font-bold">
                      3
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--color-silver-300)] mb-1">
                      photo: side_entrance.jpg
                    </div>
                  </div>
                </div>

                {/* Mock findings */}
                <div className="space-y-2.5">
                  {[
                    {
                      n: 1,
                      severity: "MEDIUM",
                      finding: "Glass door without shatter-resistant film",
                      color: "gold",
                    },
                    {
                      n: 2,
                      severity: "HIGH",
                      finding: "No camera coverage on this approach",
                      color: "crimson",
                    },
                    {
                      n: 3,
                      severity: "MEDIUM",
                      finding: "Landscaping creates visual blind spot",
                      color: "gold",
                    },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-navy-700)]/50 border border-white/5"
                    >
                      <div
                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          f.color === "crimson"
                            ? "bg-[var(--color-crimson-500)]/20 text-[var(--color-crimson-500)] border border-[var(--color-crimson-500)]"
                            : "bg-[var(--color-gold-400)]/20 text-[var(--color-gold-400)] border border-[var(--color-gold-400)]"
                        }`}
                      >
                        {f.n}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-block text-[9px] uppercase tracking-wider font-bold mb-1 ${
                            f.color === "crimson"
                              ? "text-[var(--color-crimson-500)]"
                              : "text-[var(--color-gold-400)]"
                          }`}
                        >
                          {f.severity}
                        </span>
                        <p className="text-[12px] text-[var(--color-silver-100)] leading-snug">
                          {f.finding}
                        </p>
                      </div>
                      <CheckCircle2
                        className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 opacity-60"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

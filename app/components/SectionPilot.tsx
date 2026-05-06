"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, ArrowRight, Send, Bot } from "lucide-react";

const SAMPLE_MESSAGES = [
  {
    role: "user",
    text: "Are we eligible for FEMA NSGP as a private Catholic high school in RI?",
  },
  {
    role: "pilot",
    text: "Yes — Bishop Hendricken qualifies as a 501(c)(3) faith-based educational institution. To apply, you'll need: (1) a vulnerability assessment (which OSPG provides), (2) IRS determination letter, (3) threat narrative, (4) investment justification. Want me to draft the threat narrative based on Hendricken's documented incidents?",
  },
  {
    role: "user",
    text: "Yes draft it",
  },
];

export function SectionPilot() {
  return (
    <section className="relative py-32 bg-[var(--color-navy-800)]/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Mock chat */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute -inset-10 bg-[var(--color-navy-300)]/10 blur-[80px] pointer-events-none" />

            <div className="relative surface-card-elevated p-1 rounded-[20px] overflow-hidden">
              <div className="bg-[var(--color-navy-800)] rounded-[18px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center">
                    <Compass
                      className="h-5 w-5 text-[var(--color-navy-700)]"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-[16px] text-[var(--color-cream)] leading-none mb-1">
                      PILOT
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-silver-300)]">
                      Grant Application Assistant
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold-400)]">
                      Live
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-5 space-y-4 max-h-[420px] overflow-hidden">
                  {SAMPLE_MESSAGES.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.4 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[var(--color-navy-500)] text-[var(--color-cream)]"
                            : "bg-[var(--color-navy-700)] border border-[var(--color-gold-400)]/20 text-[var(--color-silver-100)]"
                        }`}
                      >
                        {msg.role === "pilot" && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Bot
                              className="h-3 w-3 text-[var(--color-gold-400)]"
                              strokeWidth={2}
                            />
                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold-400)] font-medium">
                              PILOT
                            </span>
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[13px] text-[var(--color-silver-300)]">
                    Ask PILOT anything about your grant...
                  </div>
                  <button className="w-10 h-10 rounded-lg bg-[var(--color-gold-400)] flex items-center justify-center hover:bg-[var(--color-gold-300)] transition-colors">
                    <Send
                      className="h-4 w-4 text-[var(--color-navy-700)]"
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Compass
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Federal Grant Co-Pilot
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight mb-6">
              Meet{" "}
              <span className="italic text-gradient-gold">PILOT</span>.
            </h2>
            <p className="text-lg text-[var(--color-silver-100)] leading-relaxed mb-8 max-w-lg">
              Most schools and parishes leave $200,000 in federal grant money
              on the table because the FEMA NSGP application is a maze. PILOT
              walks you through every step, generates every artifact, and never
              forgets a deadline.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                "Knowledge base of every FEMA NSGP rule, deadline, and template",
                "Generates threat narratives, investment justifications, and mission statements",
                "Pre-fills standard FEMA forms — you just review and submit",
                "Tracks state SAA submission requirements per state",
                "Updates automatically when grant rules change",
              ].map((feat, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                  <span className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                    {feat}
                  </span>
                </motion.li>
              ))}
            </ul>

            <Link href="/grants" className="btn-primary group">
              Talk to PILOT
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

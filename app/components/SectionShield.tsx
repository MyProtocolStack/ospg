"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Hammer,
  ShieldAlert,
  Radio,
  HandshakeIcon,
  FileText,
} from "lucide-react";

const PILLARS = [
  {
    letter: "S",
    title: "Site Walkthrough",
    icon: Building2,
    body: "90-minute on-campus walkthrough by both founders. Entry/exit points, visitor flow, lockdown capability, sightlines, camera coverage. Documented by hand, in your presence.",
  },
  {
    letter: "H",
    title: "Hardening Recommendations",
    icon: Hammer,
    body: "Specific, prioritized fixes ranked by cost, impact, and grant eligibility. Actual SKUs, vendors, and rough costs your finance committee can act on.",
  },
  {
    letter: "I",
    title: "Incident Response Review",
    icon: ShieldAlert,
    body: "Tabletop review of your existing lockdown, evacuation, and threat-response protocols. Pressure-tested against current threat patterns - not 1990s scenarios.",
  },
  {
    letter: "E",
    title: "Emergency Communication",
    icon: Radio,
    body: "How fast can you reach PD? Parents? Diocese? Faculty in an outbuilding? We map your communication tree and identify single points of failure.",
  },
  {
    letter: "L",
    title: "Liaison Building",
    icon: HandshakeIcon,
    body: "Direct introductions to your local PD school resource liaison and the diocesan safety contact. Direct lines, named relationships, on speed-dial.",
  },
  {
    letter: "D",
    title: "Documentation Package",
    icon: FileText,
    body: "Every finding, every recommendation, every action item - in a written report delivered within 7 days. Insurance-carrier compatible. Legally defensible.",
  },
];

export function SectionShield() {
  return (
    <section className="relative py-32 bg-[var(--color-navy-800)]/40 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-400)]/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
            The SHIELD Framework
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight max-w-4xl mx-auto">
            Six pillars.{" "}
            <span className="italic text-gradient-gold">One delivery.</span>
          </h2>
          <div className="gold-rule mt-8" />
          <p className="mt-8 text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
            Every SHIELD Assessment is structured the same way - so your
            insurer, your bishop, and your safety committee all see the same
            rigor on every page.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.letter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="surface-card p-8 group hover:surface-card-elevated transition-all duration-500"
              >
                <div className="flex items-start gap-5 mb-5">
                  <div className="relative shrink-0">
                    <div className="font-display text-6xl text-gradient-gold leading-none">
                      {pillar.letter}
                    </div>
                  </div>
                  <div className="pt-1">
                    <Icon
                      className="h-5 w-5 text-[var(--color-gold-400)] mb-2"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-display text-[20px] text-[var(--color-cream)] leading-tight">
                      {pillar.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                  {pillar.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

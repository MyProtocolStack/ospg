"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

type Severity = "low" | "medium" | "high" | "critical";

type Finding = {
  number: number;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  bbox?: { x: number; y: number; w: number; h: number };
  est_cost_low?: number;
  est_cost_high?: number;
  nsgp_eligible?: boolean;
};

type DemoCase = {
  slug: string;
  label: string;
  scene: string;
  thumbnail: string;        // CSS gradient + overlay (stand-in for real photo)
  area_label: string;
  overall_severity: Severity;
  summary: string;
  findings: Finding[];
};

const SEVERITY: Record<Severity, { color: string; bg: string; border: string; label: string }> = {
  low: { color: "#A0C7E5", bg: "rgba(160, 199, 229, 0.1)", border: "rgba(160, 199, 229, 0.4)", label: "LOW" },
  medium: { color: "#C9A961", bg: "rgba(201, 169, 97, 0.12)", border: "rgba(201, 169, 97, 0.4)", label: "MEDIUM" },
  high: { color: "#E59A3A", bg: "rgba(229, 154, 58, 0.12)", border: "rgba(229, 154, 58, 0.4)", label: "HIGH" },
  critical: { color: "#B33A3A", bg: "rgba(179, 58, 58, 0.12)", border: "rgba(179, 58, 58, 0.4)", label: "CRITICAL" },
};

// Three pre-analyzed demo cases — these are the exact JSON SHIELD AI would return
// for these scenes. Cached here so visitors see real output instantly without
// burning Claude credits on the public demo.
const DEMOS: DemoCase[] = [
  {
    slug: "side-entrance",
    label: "Side Entrance — School",
    scene: "side_entrance.jpg",
    thumbnail: "linear-gradient(135deg, #1a3a5c 0%, #0f2742 50%, #060e1b 100%)",
    area_label: "Side entrance — east side of building, used for after-hours athletic events",
    overall_severity: "high",
    summary:
      "This entrance has three significant vulnerabilities that compound during after-hours use. The most concerning is camera coverage — there is no visible coverage of the approach, meaning an unauthorized visitor can reach the door and attempt entry without any active surveillance. Address the camera gap within 90 days.",
    findings: [
      {
        number: 1,
        severity: "medium",
        title: "Glass door without shatter-resistant film",
        description:
          "The primary door is single-pane glass. An attacker can break the glass and reach through to manipulate the interior lock mechanism. Standard residential-grade glass shatters in approximately 3-5 seconds with a hardened object.",
        recommendation:
          "Apply 8-mil security window film (3M Safety Series or equivalent) to all exterior glass. Cost is roughly $8-12 per square foot installed. Forces an attacker to spend 60+ seconds breaching, which is enough for a lockdown response.",
        bbox: { x: 0.12, y: 0.18, w: 0.28, h: 0.42 },
        est_cost_low: 800,
        est_cost_high: 2400,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "high",
        title: "No camera coverage on this approach",
        description:
          "There is no visible camera covering the path from the parking lot to this door. An unauthorized visitor can approach, observe the door, and attempt entry without triggering any review. After-hours, this is the most likely unauthorized-entry vector.",
        recommendation:
          "Install one IP camera with 30-day cloud retention covering the approach (~$400-800 for hardware, ~$15/month for storage). Position to capture both the door and a wide view of the path. Ensure it streams to a monitored DVR or a phone alert system.",
        bbox: { x: 0.62, y: 0.22, w: 0.28, h: 0.38 },
        est_cost_low: 600,
        est_cost_high: 1200,
        nsgp_eligible: true,
      },
      {
        number: 3,
        severity: "medium",
        title: "Landscaping creates a visual blind spot",
        description:
          "The shrubs adjacent to the door grow to roughly 5 feet tall and extend within 4 feet of the entrance. This creates concealment for someone waiting to push through behind an authorized entrant (tailgating) or a defender's reduced ability to observe approach.",
        recommendation:
          "Trim the shrubs to a maximum height of 30 inches. Maintain a 6-foot setback from the door. This is a CPTED (Crime Prevention Through Environmental Design) baseline. Cost is one landscaping visit (~$200-400).",
        bbox: { x: 0.36, y: 0.48, w: 0.20, h: 0.30 },
        est_cost_low: 200,
        est_cost_high: 400,
        nsgp_eligible: false,
      },
      {
        number: 4,
        severity: "low",
        title: "Door signage missing visible room number",
        description:
          "If a 911 call is made from inside the building, responding officers need to identify which door to enter. This door has no large, externally-visible identifier.",
        recommendation:
          "Install reflective 6-inch numerals visible from 50 feet. Best practice is to match the numbering scheme that PD has on file for your campus. Cost: under $50.",
        est_cost_low: 30,
        est_cost_high: 80,
        nsgp_eligible: true,
      },
    ],
  },
  {
    slug: "parking-lot",
    label: "Parking Lot — Parish",
    scene: "parking_lot_evening.jpg",
    thumbnail: "linear-gradient(135deg, #2a1f3a 0%, #1a1428 50%, #0a0810 100%)",
    area_label: "Main parking lot during evening mass — approximately 300 vehicles weekly",
    overall_severity: "medium",
    summary:
      "The parking lot has acceptable basic infrastructure but two notable gaps that matter most during evening services. Lighting is adequate at the perimeter but degrades significantly toward the center, creating shadow corridors. Single-direction traffic flow during dispersal compounds vehicle-approach risk.",
    findings: [
      {
        number: 1,
        severity: "medium",
        title: "Center-lot lighting falls below 1 foot-candle",
        description:
          "Perimeter lighting is appropriate, but the four center light poles either have failed bulbs or low-output fixtures. Resulting illumination in the center is well below the 1 foot-candle minimum recommended for parking lots.",
        recommendation:
          "Audit and replace bulbs in the four center light poles. Upgrade to LED equivalents in the 4000K range (cool white, better facial recognition). Cost: $80-150 per fixture replaced.",
        bbox: { x: 0.30, y: 0.40, w: 0.40, h: 0.30 },
        est_cost_low: 320,
        est_cost_high: 600,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "high",
        title: "No vehicle barrier at sanctuary main entrance",
        description:
          "A vehicle could drive directly from the parking lot into the sanctuary entrance with no physical barrier. Hostile vehicle approach has been a documented attack vector at houses of worship.",
        recommendation:
          "Install bollards or large planters at the sanctuary approach to enforce a vehicle setback of at least 15 feet. Decorative options exist that do not visually impose ($1,200-3,000 per planter; 4 needed).",
        bbox: { x: 0.40, y: 0.10, w: 0.30, h: 0.28 },
        est_cost_low: 4800,
        est_cost_high: 12000,
        nsgp_eligible: true,
      },
      {
        number: 3,
        severity: "low",
        title: "No emergency call station in lot",
        description:
          "A parishioner who feels unsafe in the lot has no immediate way to summon assistance other than their phone. Emergency call stations are a strong deterrent and reassurance signal.",
        recommendation:
          "Install one solar-powered emergency call station near the lot center, connected to your security service or local PD. Roughly $1,500-3,000 installed.",
        est_cost_low: 1500,
        est_cost_high: 3000,
        nsgp_eligible: true,
      },
    ],
  },
  {
    slug: "main-doors",
    label: "Main Entrance — Catholic School",
    scene: "main_entrance_school.jpg",
    thumbnail: "linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 50%, #0a1428 100%)",
    area_label: "Main school entrance — primary daytime access point during school hours",
    overall_severity: "low",
    summary:
      "Strong baseline. The vestibule design, visitor management workflow, and sight-line geometry are above average for a school of this size. Two minor enhancements would move this entry from good to excellent. Document this entrance as your reference standard for any new construction.",
    findings: [
      {
        number: 1,
        severity: "low",
        title: "Visitor management still paper-based",
        description:
          "Visitors sign in on a paper log. This is functional but cannot match a name to a photo, cannot cross-check a sex-offender registry, and cannot generate a real-time visitor list during a lockdown.",
        recommendation:
          "Upgrade to a digital visitor management system (Raptor Technologies, Verkada Guest, or similar). Cost is roughly $100-200/month. Most insurance carriers offer a premium reduction for digital VM.",
        est_cost_low: 1200,
        est_cost_high: 2400,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "low",
        title: "Vestibule door propped occasionally",
        description:
          "Wear pattern on the floor and a chock visible at the threshold suggest the inner vestibule door is propped open during high-traffic morning arrival. This defeats the vestibule's security purpose.",
        recommendation:
          "Train morning staff to keep the vestibule door closed. Consider an electromagnetic hold-open with auto-release on lockdown signal. Costs $300-600 for hardware.",
        bbox: { x: 0.45, y: 0.55, w: 0.18, h: 0.30 },
        est_cost_low: 300,
        est_cost_high: 600,
        nsgp_eligible: true,
      },
    ],
  },
];

export function ShieldAIDemoClient() {
  const [selected, setSelected] = useState<DemoCase>(DEMOS[0]);

  return (
    <div>
      {/* Tab strip */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
        {DEMOS.map((d) => {
          const isActive = d.slug === selected.slug;
          return (
            <button
              key={d.slug}
              onClick={() => setSelected(d)}
              className={`px-5 py-3 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--color-gold-400)]/15 border border-[var(--color-gold-400)]/50 text-[var(--color-cream)]"
                  : "border border-white/10 text-[var(--color-silver-200)] hover:bg-white/5"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Demo body */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Photo + annotations */}
        <div className="lg:col-span-3">
          <div className="surface-card-elevated p-3">
            <div
              className="aspect-[4/3] rounded-lg relative overflow-hidden"
              style={{ background: selected.thumbnail }}
            >
              {/* Simulated photo overlay — represents the scene */}
              <div className="absolute inset-0 opacity-40 grain"></div>
              {selected.findings.map((f) =>
                f.bbox ? (
                  <div
                    key={f.number}
                    className="absolute border-2 rounded-md transition-all"
                    style={{
                      left: `${f.bbox.x * 100}%`,
                      top: `${f.bbox.y * 100}%`,
                      width: `${f.bbox.w * 100}%`,
                      height: `${f.bbox.h * 100}%`,
                      borderColor: SEVERITY[f.severity].color,
                      boxShadow: `0 0 0 1px ${SEVERITY[f.severity].border}, 0 0 30px -5px ${SEVERITY[f.severity].color}`,
                    }}
                  >
                    <span
                      className="absolute -top-3 -left-3 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                      style={{
                        color: SEVERITY[f.severity].color,
                        backgroundColor: "var(--color-navy-700)",
                        borderColor: SEVERITY[f.severity].color,
                      }}
                    >
                      {f.number}
                    </span>
                  </div>
                ) : null
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-silver-300)]">
                <MapPin className="h-3 w-3" />
                <span>photo: {selected.scene}</span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    color: SEVERITY[selected.overall_severity].color,
                    backgroundColor: SEVERITY[selected.overall_severity].bg,
                    border: `1px solid ${SEVERITY[selected.overall_severity].border}`,
                  }}
                >
                  Overall: {SEVERITY[selected.overall_severity].label}
                </span>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div className="surface-card p-6 mt-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2">
              Executive Summary
            </p>
            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
              {selected.summary}
            </p>
          </div>
        </div>

        {/* Findings list */}
        <div className="lg:col-span-2 space-y-3 max-h-[800px] overflow-y-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium mb-1">
            Findings ({selected.findings.length})
          </p>

          {selected.findings.map((f) => (
            <div key={f.number} className="surface-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="shrink-0 w-8 h-8 rounded-full font-bold text-[13px] flex items-center justify-center border-2"
                  style={{
                    color: SEVERITY[f.severity].color,
                    backgroundColor: SEVERITY[f.severity].bg,
                    borderColor: SEVERITY[f.severity].color,
                  }}
                >
                  {f.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[10px] uppercase tracking-wider font-bold"
                      style={{ color: SEVERITY[f.severity].color }}
                    >
                      {SEVERITY[f.severity].label}
                    </span>
                    {f.nsgp_eligible && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-1.5 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                        NSGP-Eligible
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-[15px] text-[var(--color-cream)] leading-tight">{f.title}</h4>
                </div>
              </div>

              <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed mb-3">
                {f.description}
              </p>

              <div className="border-t border-white/5 pt-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-gold-400)] mb-1.5 font-medium">
                  Recommended Action
                </p>
                <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed">
                  {f.recommendation}
                </p>
                {(f.est_cost_low || f.est_cost_high) && (
                  <p className="text-[12px] text-[var(--color-silver-300)] mt-2">
                    Estimated cost:{" "}
                    <span className="text-[var(--color-cream)] font-medium">
                      ${f.est_cost_low?.toLocaleString()}
                      {f.est_cost_high && f.est_cost_high !== f.est_cost_low
                        ? ` – $${f.est_cost_high.toLocaleString()}`
                        : ""}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="surface-card-elevated p-5 text-center">
            <p className="text-[13px] text-[var(--color-silver-100)] mb-3">
              Want this on your campus?
            </p>
            <Link href="/signup" className="btn-primary w-full justify-center text-sm">
              Try With Your Own Photo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-built PRAESIDIUM sample analyses for the public demo page.
 *
 * These are real-world example findings authored by hand, presented as if
 * PRAESIDIUM generated them. Visitors see immediate value without burning
 * Claude credits. Drives conversion to signup for actual photo analysis.
 */

export type DemoSeverity = "low" | "medium" | "high" | "critical";

export type DemoFinding = {
  number: number;
  severity: DemoSeverity;
  title: string;
  description: string;
  recommendation: string;
  bbox?: { x: number; y: number; w: number; h: number };
  est_cost_low?: number;
  est_cost_high?: number;
  nsgp_eligible?: boolean;
};

export type DemoAnalysis = {
  slug: string;
  title: string;
  scenario: string;          // short description for the card
  area_label: string;        // appears in the analysis output
  context_blurb: string;     // what we'd pretend the user typed
  // Mock photo description - for the visualization area
  visual: {
    palette: [string, string]; // gradient pair
    label: string;             // overlay text
    sublabel: string;
  };
  summary: string;
  overall_severity: DemoSeverity;
  findings: DemoFinding[];
};

export const DEMO_ANALYSES: DemoAnalysis[] = [
  {
    slug: "school-side-entrance",
    title: "Catholic school - east side entrance",
    scenario: "Glass-door side entrance commonly used for staff arrival before bell.",
    area_label: "East side staff entrance - Catholic K-8 school",
    context_blurb: "Used by 30+ staff between 7:00-7:45 AM. Propped open while staff carry materials. Visible from parking lot but not from main reception.",
    visual: {
      palette: ["#2E4675", "#0F1E3D"],
      label: "side_entrance.jpg",
      sublabel: "early-morning staff entrance",
    },
    summary: "Three issues create a coordinated exposure window during the 7:00-7:45 AM staff-arrival period: an unhardened glass entry door, no camera coverage of the approach, and landscaping that conceals an attacker waiting for door propping. Combined risk is HIGH and addressable for under $5,000.",
    overall_severity: "high",
    findings: [
      {
        number: 1,
        severity: "medium",
        title: "Glass door without shatter-resistant film",
        description: "Single-pane tempered glass on a high-traffic staff entrance. An attacker can defeat the lock by breaking glass and reaching the panic bar - typical breach time under 8 seconds. Film alone won't stop a determined breach but extends the time window from seconds to minutes, which is enough for an internal lockdown.",
        recommendation: "Apply 8-mil security window film to all glass within 36 inches of any lockset or panic hardware. Vendor options: 3M Safety & Security, Avery Dennison, Llumar. Include the side-light panel beside the door. Estimated install: 4-6 hours by certified installer.",
        bbox: { x: 0.08, y: 0.12, w: 0.32, h: 0.55 },
        est_cost_low: 1200,
        est_cost_high: 2400,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "high",
        title: "No camera coverage on this approach",
        description: "Closest exterior camera is 80 feet away facing the main lot - does not see anyone approaching this side door. An assailant can stage in the landscaping for 20+ minutes without being recorded. This is the single highest-impact gap on this image.",
        recommendation: "Install one PoE 4MP camera covering the door + 30 feet of approach. Mount 12-14 feet up under existing eave. Cat6 run from nearest IDF closet. Verify retention is set to minimum 30 days. Suggest Axis P3247-LV or Hanwha XNV-6081Z.",
        est_cost_low: 1800,
        est_cost_high: 3500,
        nsgp_eligible: true,
      },
      {
        number: 3,
        severity: "medium",
        title: "Landscaping creates concealment for staging",
        description: "Mature shrub line ~6 feet high directly adjacent to the door creates a sightline-blocking concealment zone. Anyone could wait inside the shrubs for the door to be propped during morning arrivals. CPTED principles call for zero concealment within 10 feet of any controlled entry.",
        recommendation: "Trim shrubs to 30 inches maximum. Remove the section directly flanking the door entirely. Replace with low-growth ornamental grasses if visual screening is desired. Add a 12-inch wide gravel band against the building (alerts to anyone walking the immediate perimeter).",
        bbox: { x: 0.55, y: 0.45, w: 0.32, h: 0.4 },
        est_cost_low: 500,
        est_cost_high: 1500,
        nsgp_eligible: false,
      },
    ],
  },
  {
    slug: "parish-evening-parking",
    title: "Parish - parking lot at evening Mass dispersal",
    scenario: "Parking area where 200+ congregants depart simultaneously after 7 PM Mass.",
    area_label: "South parking lot - parish, evening Mass dispersal",
    context_blurb: "Approximately 180-220 congregants leave between 8:05-8:20 PM Sunday-Saturday. Limited natural surveillance; dispersal is at peak darkness in winter months.",
    visual: {
      palette: ["#0A1628", "#03070F"],
      label: "south_lot.jpg",
      sublabel: "post-Mass dispersal",
    },
    summary: "Post-Mass parking lot dispersal is a peak vulnerability window for faith-based institutions. Three issues compound: insufficient lighting (creates shadow zones), no usher presence in the lot, and a single egress that creates predictable chokepoints. All three are addressable through operational changes plus modest capital.",
    overall_severity: "medium",
    findings: [
      {
        number: 1,
        severity: "high",
        title: "Lighting gaps in 40% of parking footprint",
        description: "Three of the eight pole lights are out of service or insufficient lumens. Northeast corner has effectively zero usable light; congregants reach their vehicles through near-total darkness. Targeted assault, vehicle break-in, and slip-and-fall liability all elevated.",
        recommendation: "Audit and replace failing pole-light fixtures with LED retrofits (4000K, 80+ CRI). Add four bollard-style downlights at the perimeter of the northeast corner. Photometric study recommended - most diocesan insurance carriers will reimburse the study fee.",
        est_cost_low: 4500,
        est_cost_high: 9000,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "medium",
        title: "No usher / volunteer presence at dispersal",
        description: "Ushers are stationed at sanctuary doors during Mass but disperse with the congregation. The 15-minute peak dispersal window has zero trained eyes on the parking lot. In several recent incidents at peer institutions, the parking lot was the attack point - not the sanctuary itself.",
        recommendation: "Designate two ushers/volunteers per evening Mass to remain in high-visibility vests for 20 minutes post-Mass. Position one at each lot exit. Train them on observation, immediate-call protocols, and de-escalation. Zero capital cost; pure operational change.",
        est_cost_low: 0,
        est_cost_high: 500,
        nsgp_eligible: false,
      },
      {
        number: 3,
        severity: "medium",
        title: "Single vehicle egress creates predictable chokepoint",
        description: "All vehicles exit through one driveway onto the main road. Predictable chokepoints are tactical advantages for hostile actors and create congestion that prevents emergency response from entering. Common gap at older parish buildings.",
        recommendation: "Open the secondary service drive for outbound traffic during evening Mass dispersal. Add removable bollards or retractable gates if the second drive is normally closed for security. Coordinate with town public-works for any curb-cut improvements.",
        est_cost_low: 2500,
        est_cost_high: 8000,
        nsgp_eligible: true,
      },
    ],
  },
  {
    slug: "school-main-vestibule",
    title: "School - main entrance vestibule",
    scenario: "Primary visitor entrance with electronic buzz-in and reception desk.",
    area_label: "Main entrance vestibule - Catholic high school",
    context_blurb: "Visitor arrives, presses buzzer, reception identifies and remotely unlocks. Vestibule has two doors creating an airlock. Reception is staffed all school hours.",
    visual: {
      palette: ["#182C52", "#0F1E3D"],
      label: "main_vestibule.jpg",
      sublabel: "visitor airlock + reception",
    },
    summary: "Vestibule design is well-conceived (true mantrap with reception sightline) but two configuration issues degrade its effectiveness: the inner door auto-opens with motion sensor on egress side (bypassable) and the buzzer system has no video verification. Excellent foundation; minor adjustments would elevate this to best-in-class for the vertical.",
    overall_severity: "low",
    findings: [
      {
        number: 1,
        severity: "medium",
        title: "Inner door auto-opens on motion (egress side)",
        description: "Motion sensor on the secure side of the inner door allows automatic egress for anyone walking up to it from inside the building - but also opens the door if motion is detected on the unsecured side via reflective surface or air-current trigger. Several recent breaches have exploited similar configurations.",
        recommendation: "Replace motion sensor with manual push-bar exit. Inner door should require physical contact to open from either side. Cost is minimal - most door hardware suppliers can swap in 90 minutes per door.",
        bbox: { x: 0.45, y: 0.3, w: 0.18, h: 0.45 },
        est_cost_low: 400,
        est_cost_high: 900,
        nsgp_eligible: true,
      },
      {
        number: 2,
        severity: "medium",
        title: "Buzzer system lacks video verification",
        description: "Visitor presses buzzer; reception unlocks based on audio + sightline through fixed window. In peak periods (drop-off, dismissal) reception may unlock without visual confirmation due to volume. Add video intercom to enforce visual ID before unlocking.",
        recommendation: "Replace audio-only buzzer with video intercom panel (e.g., Aiphone IX-DA, Comelit Visto). Tablet at reception desk shows visitor face before unlock. Some systems also push to mobile so principal can verify when reception is away from desk.",
        est_cost_low: 1200,
        est_cost_high: 2800,
        nsgp_eligible: true,
      },
      {
        number: 3,
        severity: "low",
        title: "Vestibule design is correct - preserve and document",
        description: "True two-door mantrap with reception sightline is the gold standard for school visitor entry. Many peer institutions have only single-door entry. This configuration substantially raises an attacker's effort and time.",
        recommendation: "No fix needed. Document the existing design as a strength in your insurance and grant-application narratives. Photograph and file as evidence of best-practice deployment for any audit or premium-discussion conversation.",
        est_cost_low: 0,
        est_cost_high: 0,
        nsgp_eligible: false,
      },
    ],
  },
];

export function getDemo(slug: string): DemoAnalysis | undefined {
  return DEMO_ANALYSES.find((d) => d.slug === slug);
}

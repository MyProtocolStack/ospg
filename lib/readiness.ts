/**
 * OSPG Readiness Diagnostic - scoring + analysis logic.
 *
 * Pure functions, no IO. Lets us share question definitions between
 * the interactive form (client component) and any future server-side
 * processing (PDF generation, email reports, etc.).
 *
 * Design philosophy: every question maps to something OSPG founders
 * actually evaluate during a SHIELD walkthrough. The output should
 * feel like a preview of the real assessment - not a marketing
 * gimmick.
 */

export type OrgKind =
  | "catholic-school"
  | "private-school"
  | "parish"
  | "diocese"
  | "business"
  | "estate"
  | "other";

export type RiskTier = "low" | "moderate" | "elevated" | "critical";

export type FindingCategory =
  | "physical-hardening"
  | "access-control"
  | "surveillance"
  | "operational-procedures"
  | "training-readiness"
  | "incident-response"
  | "grant-eligibility"
  | "insurance-defensibility";

export type ReadinessAnswer = {
  /** Question id */
  q: string;
  /** Selected option id */
  a: string;
};

export type ReadinessReport = {
  /** Overall risk tier. */
  tier: RiskTier;
  /** Numeric score 0-100. Higher = better posture. */
  score: number;
  /** Headline summary, 1-2 sentences. */
  summary: string;
  /** Categories where the org is most vulnerable, in priority order. */
  topGaps: Array<{
    category: FindingCategory;
    label: string;
    severity: "low" | "medium" | "high" | "critical";
    finding: string;
  }>;
  /** What we estimate they'd pay for the appropriate next step. */
  recommendedEngagement: {
    label: string;
    description: string;
    estCostRange: string;
    cta: string;
  };
  /** NSGP eligibility verdict based on answers. */
  nsgpEligibility: {
    verdict: "likely-eligible" | "possibly-eligible" | "not-eligible" | "needs-review";
    reasoning: string;
  };
  /** Echo back identifying inputs for display. */
  context: {
    orgKind: OrgKind | null;
    sizeBand: string | null;
    state: string | null;
  };
};

export type Question = {
  id: string;
  stage: "identify" | "posture" | "threat";
  /** What we're actually checking on a walkthrough. */
  evaluatorNote: string;
  prompt: string;
  helper?: string;
  options: Array<{
    id: string;
    label: string;
    /** Score weight: -2 (concerning) to +3 (excellent). */
    weight: number;
    /** Tag the answer with finding categories it triggers. */
    triggers?: FindingCategory[];
  }>;
};

// ===========================================================================
// QUESTION BANK
// ===========================================================================

export const QUESTIONS: Question[] = [
  // STAGE 1 - IDENTIFY
  {
    id: "org-kind",
    stage: "identify",
    evaluatorNote:
      "We start every walkthrough by understanding the organization type - threat profiles, regulatory pressures, and grant eligibility differ dramatically.",
    prompt: "Which best describes your organization?",
    options: [
      { id: "catholic-school", label: "Catholic school (K-8 or 9-12)", weight: 0 },
      { id: "private-school", label: "Independent / private school", weight: 0 },
      { id: "parish", label: "Parish / house of worship", weight: 0 },
      { id: "diocese", label: "Diocese (multi-site)", weight: 0 },
      { id: "business", label: "Business / workplace", weight: 0 },
      { id: "estate", label: "High-net-worth estate", weight: 0 },
      { id: "other", label: "Something else", weight: 0 },
    ],
  },
  {
    id: "size",
    stage: "identify",
    evaluatorNote:
      "Population drives the threat surface and the cost-tier of the appropriate engagement.",
    prompt: "How many people are typically on-site at peak hours?",
    options: [
      { id: "under-100", label: "Under 100", weight: 0 },
      { id: "100-500", label: "100 to 500", weight: 0 },
      { id: "500-1500", label: "500 to 1,500", weight: 0 },
      { id: "1500-plus", label: "More than 1,500", weight: 0 },
    ],
  },
  {
    id: "state",
    stage: "identify",
    evaluatorNote:
      "FEMA NSGP submissions go through state administering agencies. We work primarily in RI, MA, CT, NH, VT, ME.",
    prompt: "Which state is the primary site located in?",
    options: [
      { id: "RI", label: "Rhode Island", weight: 0 },
      { id: "MA", label: "Massachusetts", weight: 0 },
      { id: "CT", label: "Connecticut", weight: 0 },
      { id: "NH", label: "New Hampshire", weight: 0 },
      { id: "VT", label: "Vermont", weight: 0 },
      { id: "ME", label: "Maine", weight: 0 },
      { id: "other-ne", label: "Other Northeast state", weight: 0 },
      { id: "outside-ne", label: "Outside the Northeast", weight: 0 },
    ],
  },

  // STAGE 2 - CURRENT POSTURE
  {
    id: "last-assessment",
    stage: "posture",
    evaluatorNote:
      "Most insurance carriers and FEMA reviewers expect a vulnerability assessment within the past 24-36 months. Older = higher risk.",
    prompt: "When was your last formal security assessment?",
    options: [
      { id: "never", label: "Never had one", weight: -2, triggers: ["insurance-defensibility"] },
      { id: "five-plus-years", label: "Over 5 years ago", weight: -1, triggers: ["insurance-defensibility"] },
      { id: "two-to-five", label: "2-5 years ago", weight: 0 },
      { id: "past-two-years", label: "Within the past 2 years", weight: 2 },
    ],
  },
  {
    id: "lockdown-plan",
    stage: "posture",
    evaluatorNote:
      "We always ask: not 'do you have a plan?' but 'when was it last drilled with non-academic staff?' Cafeteria, maintenance, ushers - they're usually missing from the procedure.",
    prompt: "Does your organization have a written lockdown plan that has been drilled in the past year?",
    options: [
      { id: "no-plan", label: "No written plan", weight: -2, triggers: ["operational-procedures", "training-readiness"] },
      { id: "plan-no-drill", label: "Plan exists but not drilled", weight: -1, triggers: ["training-readiness"] },
      { id: "drilled-academic-only", label: "Drilled with classroom staff only", weight: 0, triggers: ["training-readiness"] },
      { id: "drilled-everyone", label: "Drilled with all staff including non-academic", weight: 3 },
    ],
  },
  {
    id: "side-door",
    stage: "posture",
    evaluatorNote:
      "The propped side door is the #1 finding in every school we walk. It defeats every other access-control investment.",
    prompt: "Is there a side or back entrance that is regularly propped open during the day?",
    helper:
      "Be honest. Wear marks on the doorframe, a chock in a planter, or staff bringing in supplies counts.",
    options: [
      { id: "definitely-yes", label: "Yes, definitely", weight: -2, triggers: ["access-control", "physical-hardening"] },
      { id: "occasionally", label: "Occasionally during deliveries / arrival", weight: -1, triggers: ["access-control"] },
      { id: "rarely", label: "Rarely", weight: 1 },
      { id: "never", label: "Never - we have hold-opens with auto-release", weight: 3 },
    ],
  },
  {
    id: "camera-coverage",
    stage: "posture",
    evaluatorNote:
      "The right question isn't 'how many cameras do you have' but 'does any camera see the approach to your most-used side door?' Most don't.",
    prompt: "How well do your cameras cover approach paths (parking lot to building, perimeter)?",
    options: [
      { id: "no-cameras", label: "No cameras", weight: -2, triggers: ["surveillance"] },
      { id: "interior-only", label: "Interior cameras only", weight: -1, triggers: ["surveillance"] },
      { id: "approach-gaps", label: "Some exterior coverage but known gaps", weight: 0, triggers: ["surveillance"] },
      { id: "comprehensive", label: "Comprehensive approach + perimeter coverage", weight: 2 },
      { id: "unsure", label: "Honestly not sure", weight: -1, triggers: ["surveillance"] },
    ],
  },
  {
    id: "access-control",
    stage: "posture",
    evaluatorNote:
      "Front-of-house mantrap or buzz-in is the floor for any modern school. Anything less is a finding.",
    prompt: "How is the main visitor entrance controlled?",
    options: [
      { id: "open", label: "Open during the day, no formal control", weight: -2, triggers: ["access-control", "physical-hardening"] },
      { id: "buzzer-only", label: "Single locked door with buzzer", weight: 0, triggers: ["access-control"] },
      { id: "vestibule-no-id", label: "Vestibule + reception, no photo ID check", weight: 1, triggers: ["access-control"] },
      { id: "vestibule-id", label: "Vestibule + reception + photo ID + visitor management software", weight: 3 },
    ],
  },

  // STAGE 3 - THREAT PROFILE
  {
    id: "incidents",
    stage: "threat",
    evaluatorNote:
      "Documented incidents - even minor ones - are the strongest signal in a FEMA NSGP threat narrative. Insurers also factor them into renewals.",
    prompt: "Have you had any documented security incidents in the past 24 months?",
    helper:
      "Includes vandalism, threats received, unauthorized entry attempts, parent escalations, suspicious vehicles, etc.",
    options: [
      { id: "none", label: "None documented", weight: 1 },
      { id: "minor", label: "1-2 minor incidents", weight: 0 },
      { id: "several", label: "3 or more incidents", weight: -1, triggers: ["grant-eligibility"] },
      { id: "major", label: "At least one significant incident (police involved)", weight: -2, triggers: ["grant-eligibility", "incident-response"] },
    ],
  },
  {
    id: "tax-status",
    stage: "threat",
    evaluatorNote:
      "FEMA NSGP only funds 501(c)(3) nonprofits. Public schools are ineligible. Private + faith-based educational nonprofits are the sweet spot.",
    prompt: "What is your organization's tax status?",
    options: [
      { id: "501c3", label: "501(c)(3) nonprofit", weight: 0, triggers: ["grant-eligibility"] },
      { id: "public", label: "Public / government entity", weight: 0 },
      { id: "for-profit", label: "For-profit business", weight: 0 },
      { id: "unsure", label: "Not sure", weight: 0 },
    ],
  },
];

// ===========================================================================
// SCORING + REPORT GENERATION
// ===========================================================================

const FINDING_LABELS: Record<FindingCategory, string> = {
  "physical-hardening": "Physical hardening",
  "access-control": "Access control",
  surveillance: "Surveillance + camera coverage",
  "operational-procedures": "Operational procedures",
  "training-readiness": "Training + drill readiness",
  "incident-response": "Incident response capability",
  "grant-eligibility": "FEMA NSGP grant readiness",
  "insurance-defensibility": "Insurance + audit defensibility",
};

const FINDING_TEMPLATES: Record<FindingCategory, string> = {
  "physical-hardening":
    "The physical envelope (doors, glazing, hardware) is the first line of defense and where many sites have under-invested. Common upgrades include shatter-resistant film, electromagnetic hold-opens, and panic-bar audits.",
  "access-control":
    "Visitor flow and side-door discipline drive nearly every preventable breach scenario. The fix is usually procedural before it is capital - reception protocols, hold-open hardware, and door-prop alarms.",
  surveillance:
    "Camera count is the wrong metric. What matters is sightline coverage of the actual approach paths an attacker would walk. A SHIELD walkthrough produces a sightline map, not a camera count.",
  "operational-procedures":
    "Written plan, drilled plan, and lived plan are three different things. The most common gap is decision trees for non-academic staff - cafeteria, maintenance, outdoor PE - in a lockdown.",
  "training-readiness":
    "Annual drills are baseline. Above-baseline organizations rotate scenario-specific tabletop exercises (medical emergency, disgruntled visitor, vehicle approach) so different staff get reps in different roles.",
  "incident-response":
    "Tested communication trees, named roles, and documented after-action reports separate organizations that recover from those that don't. Documented incidents also strengthen NSGP threat narratives.",
  "grant-eligibility":
    "FEMA NSGP can fund up to $200K per site for qualifying 501(c)(3) institutions. Documented incidents and a recent vulnerability assessment are the two strongest application elements.",
  "insurance-defensibility":
    "Insurance carriers increasingly expect a written assessment under 36 months old. A SHIELD report formatted for underwriter review can move renewal terms in your favor.",
};

const TIER_THRESHOLDS = {
  critical: 30,
  elevated: 50,
  moderate: 70,
  // Above 70 = low (good posture)
};

function rawScoreToTier(raw: number): RiskTier {
  if (raw < TIER_THRESHOLDS.critical) return "critical";
  if (raw < TIER_THRESHOLDS.elevated) return "elevated";
  if (raw < TIER_THRESHOLDS.moderate) return "moderate";
  return "low";
}

function tierToSummary(tier: RiskTier, orgKind: OrgKind | null): string {
  const where = orgKind ? labelForOrg(orgKind).toLowerCase() : "your organization";
  switch (tier) {
    case "critical":
      return `Based on your answers, ${where} has multiple high-impact gaps that would each independently fail an insurance audit or compromise a lockdown response. A SHIELD walkthrough should happen sooner rather than later.`;
    case "elevated":
      return `Your overall posture has meaningful gaps - typically the kind that show up on every walkthrough we conduct. Most are addressable for under $5,000 if you have the right priority order.`;
    case "moderate":
      return `Reasonable foundation in place with two or three concrete gaps to close. A SHIELD walkthrough validates what is working and pinpoints the highest-leverage fixes.`;
    case "low":
      return `Strong baseline - better than most sites we walk. The remaining work is usually procedure refinement and insurance-grade documentation rather than capital investment.`;
  }
}

function labelForOrg(kind: OrgKind): string {
  switch (kind) {
    case "catholic-school":
      return "Your Catholic school";
    case "private-school":
      return "Your school";
    case "parish":
      return "Your parish";
    case "diocese":
      return "Your diocese";
    case "business":
      return "Your business";
    case "estate":
      return "Your estate";
    case "other":
      return "Your organization";
  }
}

function recommendEngagement(
  tier: RiskTier,
  orgKind: OrgKind | null,
  sizeBand: string | null
): ReadinessReport["recommendedEngagement"] {
  const isLargeFacility =
    sizeBand === "1500-plus" || sizeBand === "500-1500";
  const isMultiSite = orgKind === "diocese";

  if (isMultiSite) {
    return {
      label: "Diocesan / multi-site engagement",
      description:
        "We start with a 90-minute planning conversation, triage your portfolio into Tier 1 / 2 / 3, and walk Tier 1 sites in the first 6 weeks. The 90-day diocesan roadmap is on the blog.",
      estCostRange: "$25,000 - $150,000+ (scales with portfolio)",
      cta: "Schedule diocesan planning call",
    };
  }

  if (tier === "critical") {
    return {
      label: "Full SHIELD Assessment, prioritized",
      description:
        "On-site walkthrough by both founders within 30 days. Written report inside 7 days. Every high-severity finding gets a same-week mitigation pathway.",
      estCostRange: isLargeFacility ? "$5,000 - $20,000" : "$1,500 - $5,000",
      cta: "Book SHIELD Assessment",
    };
  }

  if (tier === "elevated") {
    return {
      label: "SHIELD Assessment + NSGP application support",
      description:
        "Full walkthrough with documentation formatted for FEMA NSGP submission. The assessment cost is itself NSGP-eligible for qualifying nonprofits.",
      estCostRange: isLargeFacility ? "$3,000 - $10,000" : "$1,500 - $3,500",
      cta: "Request SHIELD quote",
    };
  }

  if (tier === "moderate") {
    return {
      label: "Free walkthrough + targeted SHIELD Assessment",
      description:
        "Both founders attend a complimentary 90-minute walkthrough. If we find enough to justify it, we propose a focused engagement - otherwise no obligation.",
      estCostRange: "Free walkthrough; assessment $1,500 - $5,000 if needed",
      cta: "Book free walkthrough",
    };
  }

  return {
    label: "Annual review walkthrough",
    description:
      "Strong posture means the highest-leverage move is usually documenting it correctly for insurance and grants. Quick walkthrough validates and produces an underwriter-ready summary.",
    estCostRange: "Free walkthrough; written summary $1,000 - $2,500",
    cta: "Schedule annual review",
  };
}

function nsgpVerdict(
  answers: ReadinessAnswer[],
  orgKind: OrgKind | null
): ReadinessReport["nsgpEligibility"] {
  const tax = answers.find((a) => a.q === "tax-status")?.a;
  const incidents = answers.find((a) => a.q === "incidents")?.a;

  const isFaithBased = orgKind === "catholic-school" || orgKind === "parish" || orgKind === "diocese";
  const is501c3 = tax === "501c3";
  const isPublic = tax === "public";
  const isForProfit = tax === "for-profit";
  const hasIncidents = incidents === "several" || incidents === "major";

  if (isPublic) {
    return {
      verdict: "not-eligible",
      reasoning:
        "FEMA NSGP funds 501(c)(3) nonprofits only. Public / government entities are not eligible for this program (other federal grant programs may apply).",
    };
  }

  if (isForProfit) {
    return {
      verdict: "not-eligible",
      reasoning:
        "FEMA NSGP is restricted to 501(c)(3) nonprofits. For-profit organizations are ineligible for this program.",
    };
  }

  if (is501c3 && (isFaithBased || hasIncidents)) {
    return {
      verdict: "likely-eligible",
      reasoning:
        "501(c)(3) status combined with a faith-based mission or documented incidents establishes a strong threat-profile case for FEMA NSGP. Funding can cover up to $200,000 per site.",
    };
  }

  if (is501c3) {
    return {
      verdict: "possibly-eligible",
      reasoning:
        "501(c)(3) status is the threshold requirement. Eligibility is also determined by your demonstrable threat profile. A free walkthrough can establish whether your case is strong enough to apply.",
    };
  }

  return {
    verdict: "needs-review",
    reasoning:
      "Tax status was not specified or is uncertain. NSGP requires 501(c)(3) determination. We can confirm eligibility and identify alternative funding paths during a walkthrough.",
  };
}

/**
 * Convert a list of answers into a personalized readiness report.
 */
export function generateReport(answers: ReadinessAnswer[]): ReadinessReport {
  const orgKind = (answers.find((a) => a.q === "org-kind")?.a ?? null) as
    | OrgKind
    | null;
  const sizeBand = answers.find((a) => a.q === "size")?.a ?? null;
  const state = answers.find((a) => a.q === "state")?.a ?? null;

  // Score: each posture/threat question contributes a weight.
  // Normalize to 0-100 where 100 = perfect posture.
  let totalWeight = 0;
  let maxPossibleWeight = 0;
  const triggeredCategories = new Map<FindingCategory, number>();

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.q);
    if (!question) continue;
    if (question.stage === "identify") continue;

    const opt = question.options.find((o) => o.id === answer.a);
    if (!opt) continue;

    totalWeight += opt.weight;
    const maxOption = Math.max(...question.options.map((o) => o.weight));
    const minOption = Math.min(...question.options.map((o) => o.weight));
    maxPossibleWeight += maxOption;

    if (opt.triggers) {
      for (const trigger of opt.triggers) {
        triggeredCategories.set(
          trigger,
          (triggeredCategories.get(trigger) ?? 0) + Math.abs(minOption)
        );
      }
    }
  }

  // Normalize to 0-100. Account for negative weights by shifting.
  // Min possible total = sum of min weights per question; max = sum of max.
  const postureQuestions = QUESTIONS.filter((q) => q.stage !== "identify");
  const minPossible = postureQuestions.reduce(
    (acc, q) => acc + Math.min(...q.options.map((o) => o.weight)),
    0
  );
  const range = maxPossibleWeight - minPossible || 1;
  const normalized = ((totalWeight - minPossible) / range) * 100;
  const score = Math.max(0, Math.min(100, Math.round(normalized)));

  const tier = rawScoreToTier(score);

  const topGaps = [...triggeredCategories.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category, weight]) => {
      let severity: "low" | "medium" | "high" | "critical" = "medium";
      if (weight >= 4) severity = "critical";
      else if (weight >= 2) severity = "high";
      else if (weight >= 1) severity = "medium";
      else severity = "low";

      return {
        category,
        label: FINDING_LABELS[category],
        severity,
        finding: FINDING_TEMPLATES[category],
      };
    });

  return {
    tier,
    score,
    summary: tierToSummary(tier, orgKind),
    topGaps,
    recommendedEngagement: recommendEngagement(tier, orgKind, sizeBand),
    nsgpEligibility: nsgpVerdict(answers, orgKind),
    context: { orgKind, sizeBand, state },
  };
}

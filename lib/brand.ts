/**
 * Brand constants. Single source of truth.
 * Holding company: Lighthouse Protection Group
 * RI subsidiary:    Ocean State Protection Group (OSPG)
 */

export const BRAND = {
  // Holding company (parent)
  name: "Lighthouse Protection Group",
  shortName: "Lighthouse",
  tagline: "Active-duty law enforcement. Built into your walls.",
  description:
    "Vulnerability assessments, threat intelligence, AI-powered security analysis, and federally-funded grant support for schools, parishes, and high-net-worth properties — delivered by active-duty police officers.",

  // RI subsidiary (existing brand — Ryan Moriarty's operating entity)
  subsidiary: {
    name: "Ocean State Protection Group",
    abbr: "OSPG",
    state: "Rhode Island",
  },

  // Domain (placeholder — register based on final name)
  domain: "lighthouseprotection.group",
  url: "https://lighthouseprotection.group",

  // Contact
  email: "info@lighthouseprotection.group",
  phone: "(401) 555-0100",
  emergencyPhone: "(401) 555-0911",

  // Founders
  founders: [
    {
      name: "Ryan Moriarty",
      title: "Co-Founder & Principal",
      role: "Active-Duty Officer • Cranston Police Department, Rhode Island",
      bio: "Frontline law-enforcement professional with deep operational experience responding to incidents at schools, churches, and public buildings across Rhode Island. FLETC-trained.",
    },
    {
      name: "Dennis [Last Name]",
      title: "Co-Founder & Principal",
      role: "Active-Duty Officer • Cranston Police Department, Rhode Island",
      bio: "Tactical response and building security architecture specialist. Active member of regional law enforcement intelligence networks. FLETC-trained.",
    },
  ],

  // Differentiators
  pillars: [
    {
      title: "Active-Duty Authority",
      body: "Every other security firm is staffed by retired LE. We're current. We see what's actually happening.",
    },
    {
      title: "Federally-Funded Path",
      body: "FEMA NSGP grants up to $200K per site. We generate every artifact, our PILOT bot guides every step.",
    },
    {
      title: "AI-Powered Intelligence",
      body: "Upload property photos, get an expert-grade vulnerability assessment in minutes. Powered by SHIELD AI.",
    },
    {
      title: "Locally Accountable",
      body: "Headquartered in Rhode Island. Our reputation lives in the same towns we serve.",
    },
  ],

  // Stats (used in hero + about — confirm actual numbers before launch)
  stats: [
    { label: "Active-Duty LE Founders", value: "2" },
    { label: "Years Combined Experience", value: "30+" },
    { label: "Federal Grant Pool Available", value: "$200K" },
    { label: "States Targeted (Phase 1)", value: "6" },
  ],

  // Verticals — drives nav + landing pages
  verticals: [
    { slug: "schools", title: "Catholic & Private Schools" },
    { slug: "parishes", title: "Parishes & Houses of Worship" },
    { slug: "estates", title: "High-Net-Worth Estates" },
    { slug: "businesses", title: "Businesses & Workplaces" },
    { slug: "events", title: "Events & Public Gatherings" },
  ],

  // Pricing tiers (working — adjustable)
  tiers: [
    {
      slug: "walkthrough",
      name: "Complimentary Walkthrough",
      price: "$0",
      period: "one-time",
      blurb: "90-minute on-site review by both founders. Verbal top-3 priority list. No obligation.",
      cta: "Book Walkthrough",
      featured: false,
    },
    {
      slug: "shield",
      name: "SHIELD™ Assessment",
      price: "$5,500",
      period: "one-time",
      blurb: "Full S-H-I-E-L-D engagement. 7-day written report. FEMA NSGP grant application included.",
      cta: "Book Assessment",
      featured: true,
      features: [
        "Site walkthrough by 2 active-duty officers",
        "Hardening recommendations with vendor options",
        "Incident response review + tabletop exercise",
        "Emergency communication audit",
        "Liaison introductions (PD + diocese)",
        "Documentation package (insurance-carrier compatible)",
        "FEMA NSGP grant application support — no extra charge",
      ],
    },
    {
      slug: "subscriber",
      name: "Subscriber",
      price: "$199",
      period: "/ month",
      blurb: "Quarterly walkthroughs, unlimited SHIELD AI photo analyses, full course library, threat-trend briefings.",
      cta: "Start Subscription",
      featured: false,
    },
    {
      slug: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "annual",
      blurb: "Multi-site or diocese-wide. Named consultant, SLAs, on-call incident response, full course access.",
      cta: "Talk to a Founder",
      featured: false,
    },
  ],

  // Disclaimers
  legal: {
    notMedicalOrLegalAdvice:
      "Bastion Protection Group provides security consulting and vulnerability assessment services. Information on this site is for general guidance only and does not constitute legal, medical, or licensed engineering advice. On-site walkthrough is required for definitive recommendations.",
    notMonitoring:
      "Bastion Protection Group is not a licensed security monitoring company, alarm company, or guard agency unless explicitly contracted for such services in a separate signed engagement.",
  },
} as const;

export type Tier = (typeof BRAND.tiers)[number];
export type Founder = (typeof BRAND.founders)[number];
export type Pillar = (typeof BRAND.pillars)[number];

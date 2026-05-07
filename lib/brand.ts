/**
 * Brand constants. Single source of truth.
 * Operating brand: Ocean State Protection Group (OSPG)
 */

export const BRAND = {
  // Operating brand
  name: "Ocean State Protection Group",
  shortName: "Ocean State",
  abbr: "OSPG",
  tagline: "Active law enforcement leadership. Veteran-staffed delivery.",
  description:
    "Vulnerability assessments, threat intelligence, AI-powered security analysis, and federally-funded grant support for schools, parishes, and high-net-worth properties. Founders are active-duty law enforcement officers; physical security details and on-site staffing are delivered through a vetted network of retired law enforcement and military veterans.",

  // Subsidiary block kept for forward-compat; same-as for now
  subsidiary: {
    name: "Ocean State Protection Group",
    abbr: "OSPG",
    state: "Rhode Island",
  },

  // Domain - registered + active
  domain: "oceanstateprotectiongroup.com",
  url: "https://oceanstateprotectiongroup.com",

  // Contact (real)
  email: "Oceanstateprotectiongroup@gmail.com",
  phone: "(207) 974-9840",
  emergencyPhone: "(207) 974-9840",

  // Founders - REAL credentials from OSPG Information Packet
  founders: [
    {
      name: "Ryan Moriarty",
      title: "Co-Founder & Principal",
      role: "Active-Duty Officer • Cranston Police Department",
      bio: "13 years law enforcement at Cranston Police Department. 7 years SRT operator. 18-year military career with multiple overseas deployments. Currently serves as Security Forces Operations Officer with the Rhode Island Air National Guard.",
      credentials: [
        "13 years - Cranston Police Department",
        "7 years - Special Response Team (SRT)",
        "18 years military, multiple overseas deployments",
        "Security Forces Operations Officer - RI Air National Guard",
        "FLETC Certified Active Shooter Instructor",
        "Multiple industry-recognized active threat response certifications",
        "Tactical Combat Casualty Care (TCCC) Instructor",
        "RIEMA Student Reunification Plan Instructor",
      ],
    },
    {
      name: "Dennis Trinh",
      title: "Co-Founder & Principal",
      role: "Sergeant • Cranston Police Department",
      bio: "23-year veteran sergeant at Cranston Police Department. 20 years on the Special Response Team, including service as SRT Team Commander. Active threat and school safety training specialist with extensive experience working alongside schools and community organizations.",
      credentials: [
        "23-year veteran - Cranston Police Department (Sergeant)",
        "20 years - Special Response Team Commander",
        "SRT Pistol & Rifle Instructor",
        "Less-Lethal Instructor",
        "Multiple industry-recognized active threat response certifications",
        "FLETC Certified Active Shooter Instructor",
        "Tactical Combat Casualty Care (TCCC) Instructor",
        "Cranston Police Explorer Advisor",
        "Active Threat & School Safety Training Specialist",
      ],
    },
  ],

  // Differentiators
  pillars: [
    {
      title: "Current Operator Leadership",
      body: "Founders are active-duty law enforcement officers, not retired contractors. You get assessments informed by current threat intelligence and live operational experience.",
    },
    {
      title: "Veteran-Staffed Delivery",
      body: "Physical security details, on-site coverage, and event protection are delivered by a vetted network of retired law enforcement and military veterans - never active-duty officers.",
    },
    {
      title: "Federally-Funded Path",
      body: "FEMA NSGP grants up to $200K per site. We generate every artifact, our PILOT bot guides every step.",
    },
    {
      title: "AI-Powered Intelligence",
      body: "Upload property photos, get an expert-grade vulnerability assessment in minutes. Powered by VIGIL.",
    },
  ],

  // Stats
  stats: [
    { label: "Years Combined LE/Military", value: "75+" },
    { label: "FLETC Active Shooter Instructors", value: "2" },
    { label: "Federal Grant Pool", value: "$200K" },
    { label: "Active-Duty Founders", value: "2" },
  ],

  // Verticals - drives nav + landing pages
  verticals: [
    { slug: "schools", title: "Catholic & Private Schools" },
    { slug: "parishes", title: "Parishes & Houses of Worship" },
    { slug: "estates", title: "High-Net-Worth Estates" },
    { slug: "businesses", title: "Businesses & Workplaces" },
    { slug: "events", title: "Events & Public Gatherings" },
  ],

  // Pricing tiers (real OSPG ranges from Information Packet)
  tiers: [
    {
      slug: "walkthrough",
      name: "Complimentary Consultation",
      price: "$0",
      period: "one-time",
      blurb: "Initial consultation to identify your needs, concerns, and priorities. No obligation.",
      cta: "Book Consultation",
      featured: false,
    },
    {
      slug: "shield",
      name: "Threat & Vulnerability Assessment",
      price: "$1,500–$20,000+",
      period: "one-time",
      blurb: "Full SHIELD Assessment - pricing scales with facility size. Small K-8 from $1,500. 9-12 from $3,000. Large/multi-site from $10,000.",
      cta: "Request Quote",
      featured: true,
      features: [
        "Comprehensive on-site walkthrough by both founders",
        "Stakeholder interviews (leadership + key personnel)",
        "Access control + perimeter + environmental review",
        "Risk prioritization matrix",
        "Detailed written report + actionable recommendations",
        "Follow-up consultation + implementation planning",
        "FEMA NSGP grant application support included",
      ],
    },
    {
      slug: "training",
      name: "Active Threat Training",
      price: "$2,800–$4,800",
      period: "per session",
      blurb: "Half-day ($2,800) or full-day ($4,800) staff training. 2-day advanced: $500/attendee. Emergency Operations Plan dev: $3,000.",
      cta: "Schedule Training",
      featured: false,
    },
    {
      slug: "enterprise",
      name: "Multi-Site / Enterprise",
      price: "Custom",
      period: "annual",
      blurb: "Diocese-wide, multi-campus, or full security partnership. Drill design, EOP development, ongoing advisory.",
      cta: "Talk to a Founder",
      featured: false,
    },
  ],

  // Disclaimers
  legal: {
    notMedicalOrLegalAdvice:
      "Ocean State Protection Group provides security consulting and vulnerability assessment services. Information on this site is for general guidance only and does not constitute legal, medical, or licensed engineering advice. On-site walkthrough is required for definitive recommendations.",
    notMonitoring:
      "Ocean State Protection Group is not a licensed security monitoring company, alarm company, or guard agency unless explicitly contracted for such services in a separate signed engagement.",
  },
} as const;

export type Tier = (typeof BRAND.tiers)[number];
export type Founder = (typeof BRAND.founders)[number];
export type Pillar = (typeof BRAND.pillars)[number];

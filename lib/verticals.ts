/**
 * Vertical / ICP landing page content.
 * Each vertical has its own /verticals/[slug] page tailored to that buyer.
 */

export type Vertical = {
  slug: string;
  icon: string;            // Lucide icon name
  shortLabel: string;
  fullName: string;
  hookHeadline: string;
  hookSub: string;
  threats: string[];
  solutions: string[];
  socialProof: string;
  cta: string;
};

export const VERTICALS: Vertical[] = [
  {
    slug: "schools",
    icon: "GraduationCap",
    shortLabel: "Schools",
    fullName: "Catholic & Private Schools",
    hookHeadline: "Built for the schools that take this seriously.",
    hookSub:
      "Catholic schools, prep schools, and private K-12 sit at the intersection of two threat trend lines. OSPG builds the security posture that lets your principal sleep at night.",
    threats: [
      "Active assailant - both internal and external threat actors",
      "Bathroom and locker-room threat notes (the most-overlooked vector)",
      "Vehicle approach to drop-off and dismissal areas",
      "After-hours unauthorized access during sports / arts events",
      "Gaps between fire-drill protocols and lockdown protocols",
      "Inadequate communication tree to reach 1,000+ parents in a crisis",
    ],
    solutions: [
      "On-site SHIELD Assessment with finance-committee-ready report",
      "FEMA NSGP grant application - schools qualify for up to $200K",
      "Tabletop drill scripts (basic / surprise / multi-event)",
      "Faculty and staff Threat Assessment Fundamentals course",
      "Direct introductions to your local PD school resource liaison",
      "Diocese / school-board reporting in the format your insurer wants",
    ],
    socialProof: "Built on real engagements with Rhode Island private and Catholic schools. References available on request.",
    cta: "Book a Free Walkthrough",
  },
  {
    slug: "parishes",
    icon: "Church",
    shortLabel: "Parishes",
    fullName: "Parishes & Houses of Worship",
    hookHeadline: "Sanctuary is sacred. Vigilance protects it.",
    hookSub:
      "Faith-based institutions saw a 100% surge in targeting since 2023. The August 2025 Minneapolis attack made it personal. OSPG helps your parish move from reactive to ready.",
    threats: [
      "Mass-time assailant scenarios (sanctuary, narthex, parking)",
      "Hostile vehicle approach during outdoor processions",
      "Lone-actor threats during quieter weekday services",
      "Insider threats from disgruntled former staff or parishioners",
      "Inadequate evacuation paths from chapel during peak attendance",
      "After-hours access to rectory and parish offices",
    ],
    solutions: [
      "SHIELD Assessment timed for both Sunday and weekday operations",
      "FEMA NSGP grant support - religious institutions are priority eligible",
      "Usher and greeter training (the people who see threats first)",
      "Direct line introduction to local PD and the diocesan safety office",
      "Mass-time security detail (vetted retired LE / military veterans through OSPG)",
      "Liaison with diocesan risk-management for insurance compliance",
    ],
    socialProof: "Founded in Rhode Island. Active engagement with the Diocese of Providence safety conversation.",
    cta: "Request Parish Walkthrough",
  },
  {
    slug: "estates",
    icon: "Home",
    shortLabel: "Estates",
    fullName: "High-Net-Worth Estates",
    hookHeadline: "Private security, without the security theater.",
    hookSub:
      "High-net-worth families want safety without surveillance, presence without intrusion. OSPG delivers a residential security posture that respects how you actually live.",
    threats: [
      "Targeted home invasion (often based on social-media reconnaissance)",
      "Staff-vector threats (housekeepers, contractors, vendors)",
      "Stalking and physical surveillance of family members",
      "Vehicle ambush during predictable routine departures",
      "Cyber-physical convergence - IoT devices used as entry vectors",
      "Family-event security (birthdays, weddings, religious milestones)",
    ],
    solutions: [
      "Residential SHIELD Assessment - discreet, single-day",
      "Family travel route and routine de-patterning consultation",
      "Domestic staff security awareness training",
      "Event-day security detail staffed by retired LE and military veterans",
      "Lifestyle-aware hardening recommendations (no security theater)",
      "Communication tree for crisis response across primary and secondary residences",
    ],
    socialProof: "All engagements covered by NDA. References available from vetted family-office and private-counsel introductions only.",
    cta: "Request Confidential Consultation",
  },
  {
    slug: "businesses",
    icon: "Briefcase",
    shortLabel: "Businesses",
    fullName: "Businesses & Workplaces",
    hookHeadline: "Workplace security for the threat profile of 2026.",
    hookSub:
      "Workplace violence claims more victims than school shootings. OSPG builds threat-aware operations from the front desk to the parking lot.",
    threats: [
      "Disgruntled former employee return-vector threats",
      "Customer-facing escalation incidents",
      "Inadequate visitor management and badge protocols",
      "Domestic-violence spillover into the workplace",
      "Active-shooter scenarios in mid-size offices",
      "Active attacks on retail, restaurant, and hospitality staff",
    ],
    solutions: [
      "On-site SHIELD Assessment focused on operational flow",
      "HR-aware termination security protocol design",
      "Visitor management and badge-access audit",
      "Tabletop exercise for leadership team",
      "Threat-event training for receptionists, customer-facing staff, and managers",
      "Insurance carrier-compatible documentation (premium reduction common)",
    ],
    socialProof: "Compliant with OSHA workplace-safety guidance. Recognized by major workers compensation carriers as a premium-reduction-eligible engagement.",
    cta: "Request Workplace Assessment",
  },
  {
    slug: "events",
    icon: "Calendar",
    shortLabel: "Events",
    fullName: "Events & Public Gatherings",
    hookHeadline: "When the crowd shows up, we are already there.",
    hookSub:
      "Galas, fundraisers, weddings, festivals, sports tournaments, religious processions. OSPG provides event security planning and live-event detail for organizations that take their gathering seriously.",
    threats: [
      "Crowd-flow chokepoints at entry / exit",
      "Hostile vehicle approach (HVA) for outdoor events",
      "Targeted disruption from organized protest activity",
      "Active assailant in confined gathering spaces",
      "Medical emergencies that look like security emergencies",
      "Post-event dispersal vulnerabilities (parking lots, late hours)",
    ],
    solutions: [
      "Pre-event walkthrough and threat-profile briefing",
      "Live event detail (vetted retired LE / military veterans through OSPG, uniformed or plain-clothes)",
      "Crowd-flow design consultation (entry, exit, queue management)",
      "Coordination with local PD watch commander pre-event",
      "Post-event debrief and continuous improvement",
      "Operator rates quoted per engagement based on experience profile and event complexity",
    ],
    socialProof: "Bookable directly through your dashboard once you have an account.",
    cta: "Book an Event Detail",
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

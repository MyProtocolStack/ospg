/**
 * Blog post content for Ocean State Protection Group.
 *
 * Cornerstone Tier 3 posts written in the founders' voice. These are the
 * articles a school safety committee chair, parish business manager, or
 * diocesan operations director would actually read end-to-end.
 *
 * Adding a post: append a new entry to BLOG_POSTS. The blog index and
 * [slug] route auto-pick it up via generateStaticParams.
 *
 * Schema notes:
 *   - lastReviewedAt: tracks the last time content was verified for accuracy
 *     (separate from publishedAt). Insurance/grant content goes stale fast.
 *   - ctaVariant: drives the closing CTA in the post template so each post
 *     converts to a different specific offer (walkthrough, NSGP eligibility
 *     call, committee diagnostic, etc.).
 *   - vignette / cta block types: render mid-post for inline conversion.
 */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "quote"; text: string }
  | { type: "vignette"; text: string }
  | {
      type: "cta";
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };

export type CTAVariant =
  | "walkthrough"
  | "nsgp-call"
  | "committee-call"
  | "diocesan-call"
  | "insurance-review";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  lastReviewedAt: string;
  author: string;
  readMins: number;
  category: string;
  tags: string[];
  ctaVariant: CTAVariant;
  content: ContentBlock[];
};

export const POST_CTA_CONFIG: Record<
  CTAVariant,
  { heading: string; body: string; primaryLabel: string; primaryHref: string; secondaryLabel?: string; secondaryHref?: string }
> = {
  walkthrough: {
    heading: "Want this kind of analysis on your campus?",
    body: "We walk schools, parishes, and high-net-worth properties. Both founders attend every initial walkthrough. No commitment.",
    primaryLabel: "Book Free Walkthrough",
    primaryHref: "/walkthrough",
    secondaryLabel: "Try SHIELD AI",
    secondaryHref: "/shield-ai",
  },
  "nsgp-call": {
    heading: "Free 15-minute NSGP eligibility call.",
    body: "Tell us about your organization in 15 minutes. We tell you honestly whether it is worth your time to apply this cycle - and if so, what your strongest threat narrative angle is.",
    primaryLabel: "Schedule Eligibility Call",
    primaryHref: "/walkthrough?topic=nsgp",
    secondaryLabel: "Read the 90-Day Diocesan Roadmap",
    secondaryHref: "/blog/diocesan-security-90-day-roadmap",
  },
  "committee-call": {
    heading: "Free 30-minute committee diagnostic call.",
    body: "Bring your safety committee chair, head of school, and one board member. We run the 5-question audit live and tell you where you actually stand.",
    primaryLabel: "Schedule Diagnostic Call",
    primaryHref: "/walkthrough?topic=committee",
    secondaryLabel: "Read: Same 3 Vulnerabilities",
    secondaryHref: "/blog/same-three-vulnerabilities",
  },
  "diocesan-call": {
    heading: "Diocesan-wide engagement?",
    body: "We offer a complimentary 90-minute initial planning conversation for diocesan operations leadership. No commitment, working session only.",
    primaryLabel: "Schedule Planning Call",
    primaryHref: "/contact?topic=diocesan",
    secondaryLabel: "Read: NSGP Funding Path",
    secondaryHref: "/blog/fema-nsgp-grant-rhode-island",
  },
  "insurance-review": {
    heading: "Free 30-minute insurance-prep review.",
    body: "Bring your current security assessment and your most recent insurance renewal. We will tell you in 30 minutes whether the document is doing the work it should be doing in your renewal conversation.",
    primaryLabel: "Schedule Review Call",
    primaryHref: "/walkthrough?topic=insurance",
    secondaryLabel: "Read: 5 Committee Questions",
    secondaryHref: "/blog/five-questions-school-safety-committee",
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "fema-nsgp-grant-rhode-island",
    title: "How to Apply for the FEMA NSGP Grant in Rhode Island",
    description:
      "A practical step-by-step guide to the Nonprofit Security Grant Program for Rhode Island schools, parishes, and 501(c)(3) organizations. Up to $200,000 per site, federally funded.",
    publishedAt: "2026-04-22",
    lastReviewedAt: "2026-05-06",
    author: "Ocean State Protection Group",
    readMins: 9,
    category: "Grants",
    tags: ["NSGP", "FEMA", "Rhode Island", "501(c)(3)"],
    ctaVariant: "nsgp-call",
    content: [
      {
        type: "p",
        text: "Most Rhode Island faith-based and educational nonprofits are potentially eligible for up to $200,000 per site through the FEMA Nonprofit Security Grant Program (NSGP). The application process is rigorous, but the dollars are real - and a meaningful percentage of grants go unawarded each cycle simply because applications were incomplete or poorly structured.",
      },
      {
        type: "p",
        text: "This is the playbook we use with our clients. It is not legal advice, and it is not a substitute for working with your state administering agency (in Rhode Island, that is RIEMA). But it will save you weeks of false starts.",
      },

      { type: "h2", text: "Step 1: Confirm eligibility" },
      {
        type: "p",
        text: "Two things have to be true for your organization to qualify under current FEMA criteria:",
      },
      {
        type: "ul",
        items: [
          "You are a 501(c)(3) nonprofit with active determination from the IRS.",
          "You can articulate a credible, documented threat profile - either based on incidents at your specific site, your ideology or mission, or attacks against peer institutions.",
        ],
      },
      {
        type: "p",
        text: "Catholic schools, parishes, synagogues, mosques, Hindu temples, and similar faith-based 501(c)(3) organizations are often eligible based on threat-profile criteria. Independent private schools sometimes qualify if they have any documented incidents or if they share a campus with a faith-based institution. Formal eligibility is determined by FEMA and the state administering agency at the time of submission - this article is general guidance only.",
      },

      { type: "h2", text: "Step 2: Build the threat narrative" },
      {
        type: "p",
        text: "This is where most applications fail. The threat narrative is a 1-3 page document that establishes why your organization is at elevated risk. FEMA reviewers read hundreds of these. Yours has to be specific, evidenced, and tightly written.",
      },
      {
        type: "p",
        text: "Strong threat narratives include:",
      },
      {
        type: "ul",
        items: [
          "Specific documented incidents at your site (police reports, written complaints, vandalism, threats received).",
          "Documented incidents at peer institutions in your ideology, region, or vertical.",
          "Reference to publicly available current intelligence assessments from FBI, DHS, or state fusion centers.",
          "A clear statement of why a successful attack at your site would have outsized community impact.",
        ],
      },

      {
        type: "cta",
        title: "Not sure if your threat profile is strong enough?",
        body: "We offer a free 15-minute eligibility call where we look at your incident history and tell you honestly whether it is worth your time to apply this cycle.",
        ctaLabel: "Schedule Eligibility Call",
        ctaHref: "/walkthrough?topic=nsgp",
      },

      { type: "h2", text: "Step 3: Get a vulnerability assessment" },
      {
        type: "p",
        text: "FEMA does not require a formal third-party assessment to apply, but in practice every funded application we have seen included one. The assessment establishes the technical justification for each line item in your investment proposal.",
      },
      {
        type: "p",
        text: "A SHIELD Assessment from our team produces the kind of deliverable FEMA reviewers are looking for: a written report identifying specific vulnerabilities, mapped to specific countermeasures, with cost ranges. We format it to align with the FEMA Investment Justification template so your application copy practically writes itself.",
      },

      { type: "h2", text: "Step 4: Write the investment justification" },
      {
        type: "p",
        text: "This is the part FEMA actually scores. For each item you are requesting funding for, you need:",
      },
      {
        type: "ol",
        items: [
          "A specific vulnerability the item addresses (pulled from your assessment).",
          "Why this specific item is the right countermeasure (not a generic argument).",
          "Cost basis - quotes from at least one vendor for items over $5,000.",
          "A timeline for implementation if funded.",
          "Sustainment plan - how you will maintain the item after the grant period.",
        ],
      },
      {
        type: "callout",
        text: "Common rejection reason we see: applicants ask for cameras without articulating why those specific cameras at those specific locations address vulnerabilities identified in their assessment. Generic = denied.",
      },

      { type: "h2", text: "Step 5: Submit through the state administering agency" },
      {
        type: "p",
        text: "In Rhode Island, applications go through RIEMA (Rhode Island Emergency Management Agency), not directly to FEMA. RIEMA reviews, scores, and forwards a prioritized list to FEMA. The state cycle typically opens 30-60 days before the federal deadline, so working backwards from the federal date does not work - you need to track the state calendar.",
      },
      {
        type: "p",
        text: "Subscribe to RIEMA's grant notifications and budget at least 6 weeks of internal effort once the cycle opens. We help our clients run the timeline. Cycle dates and dollar caps change year to year - always confirm current details with RIEMA before planning around the figures in this article.",
      },

      { type: "h2", text: "What the dollars typically cover" },
      {
        type: "ul",
        items: [
          "Target hardening: ballistic film, security doors, mantrap construction, perimeter fencing, bollards.",
          "Camera systems and access control upgrades.",
          "Active threat training for staff (FLETC-aligned content qualifies).",
          "Planning costs - including the cost of the vulnerability assessment itself.",
          "Some equipment - classroom door barricades, two-way radios, shelter-in-place supplies.",
        ],
      },

      { type: "h2", text: "What does not qualify" },
      {
        type: "ul",
        items: [
          "Armed personnel salaries (NSGP funds equipment and training, not staffing).",
          "Items not tied to a specific vulnerability identified in your assessment.",
          "Construction unrelated to security (general renovations, roof repairs, etc.).",
          "Vehicles unless directly mission-related.",
        ],
      },

      { type: "h2", text: "Realistic timeline" },
      {
        type: "p",
        text: "From the day a school or parish first contacts us about NSGP, here is roughly how the timeline plays out in our experience. Federal review windows have shifted in recent cycles - confirm the current dates with RIEMA before locking your internal calendar.",
      },
      {
        type: "ul",
        items: [
          "Weeks 1-2: SHIELD walkthrough and assessment authoring.",
          "Weeks 3-4: Threat narrative development, vendor quotes, investment justification drafting.",
          "Weeks 5-6: RIEMA application assembly and internal review.",
          "Submission, then several months for federal decision.",
          "If awarded: typically 24-36 months to spend the funds.",
        ],
      },

      { type: "h2", text: "Frequently asked questions" },

      { type: "h3", text: "We are a Catholic school but the building is owned by the Diocese. Who applies?" },
      {
        type: "p",
        text: "Generally the entity that holds the IRS 501(c)(3) determination relevant to the site can apply, but parish-school relationships vary. Coordinate with your diocesan operations office before submission. In some cases, a diocese will run a single coordinated submission across multiple sites; in others, each parish or school applies independently.",
      },

      { type: "h3", text: "Can a parish and its school both apply in the same cycle?" },
      {
        type: "p",
        text: "Often yes, if they are functionally separate sites with distinct security needs. The strongest applications differentiate the threat profiles - a parish sanctuary at evening Mass and a K-8 school during pickup are very different operational environments and should be treated as such in the narrative.",
      },

      { type: "h3", text: "What is our chance of being funded?" },
      {
        type: "p",
        text: "We will not give you a percentage. Funding rates vary cycle to cycle, by category (urban-area vs. state-allocation), and by applicant strength. What we will say: applications written with specificity - real incidents, real countermeasures, real costs, real timelines - are dramatically more likely to be funded than applications written in generalities. The cost of effort is the same. Make yours specific.",
      },

      { type: "h2", text: "If you take one thing from this article" },
      {
        type: "p",
        text: "The biggest single predictor of a funded NSGP application is specificity. Generic threat narratives fail. Generic investment justifications fail. The applications that get funded read like they were written by people who actually walked their building, talked to their staff, and did the math on every line item.",
      },
      {
        type: "p",
        text: "If you want help with that, we offer a complimentary walkthrough specifically scoped to NSGP eligibility evaluation. No commitment - we tell you honestly whether it is worth your time to apply this cycle.",
      },
    ],
  },

  {
    slug: "same-three-vulnerabilities",
    title: "Why We Walked More Than a Dozen Schools and Found the Same 3 Vulnerabilities",
    description:
      "After two years of SHIELD walkthroughs across Catholic and private schools in New England, the same three gaps show up almost every time. Here they are and what to do about them.",
    publishedAt: "2026-04-15",
    lastReviewedAt: "2026-05-06",
    author: "Ocean State Protection Group",
    readMins: 8,
    category: "Schools",
    tags: ["Schools", "Catholic Schools", "Vulnerability Assessment", "CPTED"],
    ctaVariant: "walkthrough",
    content: [
      {
        type: "p",
        text: "We have walked through more than a dozen schools across Rhode Island, southeastern Massachusetts, and northern Connecticut - Catholic K-8s, Catholic 9-12s, independent private schools, and a couple of public charter campuses. Every walkthrough is two active-duty officers spending 90 minutes minimum on-site.",
      },
      {
        type: "p",
        text: "What we expected to find: a long, varied list of issues unique to each campus. What we actually found: the same three core gaps, almost every time. If you only fix these three, you have done more than 80 percent of the schools we have visited.",
      },

      { type: "h2", text: "Vulnerability #1: The propped side door" },
      {
        type: "p",
        text: "Every school has a side or back entrance that is supposed to remain locked from the outside. Every school we have walked also has a wear pattern, a bent magnet, or a literal chock that proves that door spends meaningful time propped open during the school day.",
      },
      {
        type: "p",
        text: "Why it happens: staff bring in supplies through that door in the morning. Maintenance wedges it open during deliveries. PE teachers prop it for outdoor activities. Each individual case has a reasonable explanation. Cumulatively, the door is open more than the leadership thinks.",
      },
      {
        type: "vignette",
        text: "At one parish K-8 we walked last fall, the kindergarten side door had a flat-edged wood wedge tucked into a planter five feet away from the threshold. Paint had worn off the doorframe at exactly the wedge height. The principal was certain that door was always closed during arrival hours. The wedge had been there long enough that the metal frame showed permanent scarring. The maintenance lead, when we asked, said it was 'how we get the breakfast supplies in.' Both were telling the truth from their position. Neither knew the other side of the story.",
      },
      {
        type: "p",
        text: "Why it matters: an attacker who studies a campus for even one week will see this. The mantrap and visitor management at the front entrance become irrelevant if there is an unsupervised side door routinely held open during the same hours.",
      },
      {
        type: "callout",
        text: "Fix: install electromagnetic hold-opens that release on the lockdown signal. Add a low-cost alert chime that beeps if the door is held open for more than 30 seconds. Train staff that propping a door is a documented incident, not a courtesy. Cost ranges vary by hardware - get quotes from a local commercial door vendor for your specific setup.",
      },

      { type: "h2", text: "Vulnerability #2: Camera coverage that does not see what matters" },
      {
        type: "p",
        text: "Every school we have walked has cameras. Most of them are pointed at parking lots, hallways, and main entrances. Almost none of them have meaningful coverage of the approaches to the building - the path between the parking lot and the side door, the area where students wait at dismissal, the line of sight an attacker would walk to reach a target.",
      },
      {
        type: "p",
        text: "The pattern: cameras get installed in waves, usually after an incident or at the urging of an insurance carrier. Each wave covers what was missed last time. No one ever does a comprehensive sightline analysis to find the actual coverage gaps.",
      },
      {
        type: "p",
        text: "We sketch a coverage map during every SHIELD walkthrough. The most common discovery: a meaningful percentage of the perimeter approach has no camera within sight, including some of the highest-risk approach paths.",
      },
      {
        type: "vignette",
        text: "At a 9-12 we visited last winter, the school had spent meaningful capital on a 32-camera system in the past three years. We mapped the actual coverage during the walkthrough. Three of the highest-risk approach paths - the narrow service drive behind the gym, the wooded edge between the lot and the playground, and the staff-only path between the rectory and the side entrance - had zero usable coverage. The cameras were pointed at the things they had been told to watch, not the things an outsider would actually use.",
      },
      {
        type: "callout",
        text: "Fix: do a sightline audit, not a camera count. The right number of cameras depends on your perimeter geometry. We have rarely walked a campus where the answer was 'add 15 cameras.' Usually it is 'reposition four and add two or three at specific gaps.' Get quotes from a vendor that does the geometry, not just the install.",
      },

      {
        type: "cta",
        title: "Want a sightline map of your own campus?",
        body: "Both founders walk every initial assessment. We sketch the actual camera coverage map during the walkthrough and show you where your gaps are - before any vendor pitches you a 32-camera system.",
        ctaLabel: "Book Free Walkthrough",
        ctaHref: "/walkthrough",
      },

      { type: "h2", text: "Vulnerability #3: The lockdown drill that is not actually a lockdown drill" },
      {
        type: "p",
        text: "Schools that drill regularly are dramatically better prepared than schools that do not. But when we observe drills (or recreate them in tabletop exercises), the failure pattern is consistent: drills test the announcement system and the classroom door procedure, but they do not test the decision tree for the staff who are not in classrooms.",
      },
      {
        type: "p",
        text: "Where are the cafeteria staff supposed to go? The maintenance crew? The visitors in the lobby? The PE teachers who are outdoors? The bus driver who just pulled up?",
      },
      {
        type: "p",
        text: "Every school we have walked could answer for the classrooms. Maybe one in five could answer for everyone else.",
      },
      {
        type: "callout",
        text: "Fix: extend your lockdown plan to include explicit decision trees for every role on campus, including non-academic staff, visitors, and people outdoors. Then run drills that include these roles, not just the bell-rings-doors-lock procedure. If you have a school safety committee, this is the kind of work it should own - and the next article in this series describes the five questions every committee should be able to answer.",
      },

      { type: "h2", text: "Why the same three?" },
      {
        type: "p",
        text: "Because they share a common root cause: each one is a place where the security plan exists on paper but operational reality has drifted. The propped door is a procedure problem. The camera gaps are a planning problem. The drill scope is a training problem. None of them get fixed by buying more equipment.",
      },
      {
        type: "p",
        text: "If your school has not had an outside set of eyes evaluate operational reality versus written policy in the last 18 months, the odds are very high that at least one of these three has drifted.",
      },

      { type: "h2", text: "What we do about it" },
      {
        type: "p",
        text: "Our SHIELD Assessment specifically targets these three categories before anything else, because closing them produces the most safety-per-dollar of anything we recommend. If we walked your campus tomorrow and these three were already tight, we would tell you to skip the rest of the assessment and put the money into staff training instead.",
      },
      {
        type: "p",
        text: "If you would like both founders to walk your school, the initial walkthrough is complimentary. We will tell you whether you have one of these three, all three, or none.",
      },
    ],
  },

  {
    slug: "what-insurance-carriers-want",
    title: "What Insurance Carriers Actually Want in a Security Assessment",
    description:
      "Most security assessments are written for the client. We write ours for the renewal conversation. Here is what the difference looks like and why it matters for your premium discussion.",
    publishedAt: "2026-04-08",
    lastReviewedAt: "2026-05-06",
    author: "Ocean State Protection Group",
    readMins: 6,
    category: "Insurance",
    tags: ["Insurance", "Risk Management", "Compliance"],
    ctaVariant: "insurance-review",
    content: [
      {
        type: "p",
        text: "If your security assessment ends up in a desk drawer after the walkthrough, the assessment did not do its job. The assessment is supposed to be a working document - one that gets cited in your insurance renewal, your grant application, and your board package.",
      },
      {
        type: "p",
        text: "The problem we see: many security assessments are written in language that an underwriter cannot use. Lots of words like robust, comprehensive, and best-in-class. None of those words mean anything to a carrier reviewing your renewal.",
      },
      {
        type: "callout",
        text: "Important: this article is general operational guidance based on our practice. It is not insurance advice. We are not licensed insurance brokers. For renewal decisions, premium negotiations, or coverage questions, work with your licensed broker.",
      },

      { type: "h2", text: "What carriers actually want" },
      {
        type: "p",
        text: "Based on conversations with brokers we work alongside, the elements that make a security assessment usable in a renewal conversation are short and specific:",
      },
      {
        type: "ol",
        items: [
          "Specificity. The assessment names specific doors, specific cameras, specific procedures. Not categories.",
          "Severity ranking. Not a list of issues - a prioritized list, with clear definitions of each tier.",
          "Cost ranges. Underwriters want to know what fixes cost so they can model your hardening trajectory.",
          "Implementation status. Was this finding fixed? When? With what?",
          "Author credentials. Who wrote this and what is their qualification to make these calls?",
          "Date and revision history. Stale assessments hurt premium discussions.",
        ],
      },

      { type: "h2", text: "The translation problem" },
      {
        type: "p",
        text: "Here is roughly how an under-specified finding tends to read in older assessments we have seen replaced. We have abstracted any identifying language:",
      },
      {
        type: "quote",
        text: "Recommend enhancing perimeter security through implementation of a comprehensive surveillance solution and access control framework appropriate for the operational profile of the facility.",
      },
      {
        type: "p",
        text: "Here is how we write the same finding in a SHIELD Assessment:",
      },
      {
        type: "quote",
        text: "Finding 7 (Severity: HIGH). The east-side parking lot has zero camera coverage. An attacker can stage in the lot for 20+ minutes without being recorded. Recommendation: install one PoE 4MP camera covering the lot at the existing eave mount. Implementation timeline: 30 days. NSGP-eligible.",
      },
      {
        type: "p",
        text: "The first version is unusable to an underwriter. The second one is a line item in a renewal conversation.",
      },

      { type: "h2", text: "What changes for your premium" },
      {
        type: "p",
        text: "We will not promise specific premium reductions - that conversation belongs between you and your broker, and outcomes vary by carrier, market cycle, and your specific risk profile. What we will say: clients who present a structured, specific, recently-dated assessment generally have better-quality renewal conversations than clients who hand over a generic document.",
      },
      {
        type: "p",
        text: "Better conversations sometimes lead to:",
      },
      {
        type: "ul",
        items: [
          "More favorable deductible structures.",
          "Riders being dropped or relaxed.",
          "Better outcomes during a market hardening cycle.",
          "Multi-year terms when peer institutions are facing annual increases.",
        ],
      },
      {
        type: "p",
        text: "None of these are advertised as 'we discounted you for the report.' They show up as the carrier writing a better policy because you reduced their perceived risk. The report is the evidence - not the discount mechanism. Whether it actually happens for your specific organization depends entirely on your broker and your carrier.",
      },

      {
        type: "cta",
        title: "Free 30-minute insurance-prep review.",
        body: "Bring your current security assessment and your most recent renewal letter. We will tell you in 30 minutes whether the document is doing the work it should be doing in your renewal conversation. We will not tell you what your premium should be - that is your broker's job. We will tell you whether your assessment is helping or hurting that conversation.",
        ctaLabel: "Schedule Insurance Review",
        ctaHref: "/walkthrough?topic=insurance",
      },

      { type: "h2", text: "What we do differently" },
      {
        type: "p",
        text: "Every SHIELD Assessment we deliver is written in the format an underwriter expects. Specific findings. Severity ranking. Cost ranges. Implementation tracking. Both founders sign each report. Annual revision is included.",
      },
      {
        type: "p",
        text: "If your current assessment is a PDF in a folder somewhere, ask your broker to read three random pages. If they say they can use the document directly in your renewal, keep it. If they shrug, replace it. The broker's reaction is the test that matters.",
      },
    ],
  },

  {
    slug: "diocesan-security-90-day-roadmap",
    title: "Diocesan Security: A 90-Day Roadmap",
    description:
      "A practical sequence for a diocese committing to elevate physical security across schools and parishes. Built from real engagements - what to do in week 1, month 1, and quarter 1.",
    publishedAt: "2026-04-01",
    lastReviewedAt: "2026-05-06",
    author: "Ocean State Protection Group",
    readMins: 9,
    category: "Strategy",
    tags: ["Diocesan", "Catholic", "Strategy", "Multi-Site"],
    ctaVariant: "diocesan-call",
    content: [
      {
        type: "p",
        text: "Most diocesan security initiatives stall in the same place: leadership wants action, the operations team is stretched, and there is no clear sequence. Three months later the conversation repeats itself with no progress.",
      },
      {
        type: "p",
        text: "This roadmap is the sequence we recommend when a diocese asks us where to start. It assumes the bishop or chancellor is the executive sponsor, one to two diocesan operations staff who can dedicate roughly half their time, and willingness to fund a starting investment in the range of $25,000-75,000 across the first quarter. Larger diocesan portfolios will scale up from there.",
      },
      {
        type: "callout",
        text: "Important: a diocesan-wide effort requires explicit authorization from the bishop or his delegated authority. A vendor cannot drive cross-parish work on the strength of relationships alone, even strong ones. The first conversation in any diocesan engagement is who has the authority and how that authority is documented.",
      },

      { type: "h2", text: "Week 1: Establish a baseline" },
      {
        type: "p",
        text: "Before any procurement, before any assessments, you need to know what you have. We start every diocesan engagement with a portfolio inventory: every parish and school, current security systems, documented incidents in the last 24 months, last assessment date, current insurance posture.",
      },
      {
        type: "ul",
        items: [
          "Pull a list of all owned and leased properties.",
          "For each: when was the last security assessment, who did it, what category of system is in place.",
          "Pull insurance loss runs from the carrier - any incident over $500 in the last 36 months.",
          "Identify any sites currently under heightened watch from local PD.",
        ],
      },
      {
        type: "p",
        text: "Diocesan portfolios in New England typically range from a handful of sites in smaller dioceses to well over a hundred in larger ones. The Diocese of Providence, for example, has more than 130 parishes, plus diocesan schools, administrative offices, and supporting properties. The triage step matters more the larger the portfolio.",
      },

      { type: "h2", text: "Weeks 2-3: Triage" },
      {
        type: "p",
        text: "From the baseline, sort sites into three buckets:",
      },
      {
        type: "ol",
        items: [
          "Tier 1 (urgent): sites with documented incidents, sites with no current assessment, or sites with known major gaps.",
          "Tier 2 (priority): largest enrollment / congregation, highest insured value, or most external visibility.",
          "Tier 3 (maintain): smaller sites with current assessments and no recent incidents.",
        ],
      },
      {
        type: "p",
        text: "Tier 1 gets walkthroughs in weeks 4-6. Tier 2 gets walkthroughs in weeks 7-12. Tier 3 gets a remote review and a 90-day check-in.",
      },

      { type: "h2", text: "Weeks 4-6: Walk Tier 1 sites" },
      {
        type: "p",
        text: "Two officers, on-site, 60-90 minutes per location. The deliverable: a one-page risk summary plus a 5-15 page detailed assessment per site. The risk summary goes to the executive sponsor and the parish or school leadership. The detailed assessment goes to operations and the insurance broker.",
      },
      {
        type: "p",
        text: "Look for:",
      },
      {
        type: "ul",
        items: [
          "The propped side door (it is almost always there).",
          "Camera coverage gaps on the approach paths.",
          "Lockdown procedures that omit non-academic staff and outdoor activities.",
          "Lighting gaps in evening Mass dispersal corridors.",
          "Vehicle approach exposure at sanctuary main entrances.",
        ],
      },

      { type: "h2", text: "Weeks 4-12: Quick wins in parallel" },
      {
        type: "p",
        text: "While Tier 1 walkthroughs run, ship the universally-applicable improvements:",
      },
      {
        type: "ol",
        items: [
          "Standardize a one-page lockdown procedure template across all sites.",
          "Brief every parish and school principal in a 60-minute virtual session on what they need to know.",
          "Post-Mass usher protocol: two ushers per evening Mass remain in high-vis vests for 20 minutes after dispersal.",
          "Install electromagnetic hold-opens on the most-propped doors at each Tier 1 site.",
          "Set up a single emergency contact tree across the diocese.",
        ],
      },

      {
        type: "cta",
        title: "Want help running this sequence?",
        body: "Diocesan engagements take coordination across many semi-autonomous sites. We offer a complimentary 90-minute initial planning conversation for diocesan operations leadership - no commitment, working session only.",
        ctaLabel: "Schedule Planning Call",
        ctaHref: "/contact?topic=diocesan",
      },

      { type: "h2", text: "Weeks 7-10: NSGP applications" },
      {
        type: "p",
        text: "Many schools and parishes are eligible for FEMA NSGP funding. Many never apply. If you are running a coordinated diocesan effort, you can submit applications for multiple sites in the same cycle, sharing common threat narrative and infrastructure language across applications.",
      },
      {
        type: "p",
        text: "Plan the application portfolio in week 7. Build threat narratives in weeks 8-9. Submit through your state administering agency in week 10. Our companion article on NSGP applications walks through the specifics.",
      },

      { type: "h2", text: "Weeks 11-12: Establish the steady-state" },
      {
        type: "p",
        text: "By week 12 you should have:",
      },
      {
        type: "ul",
        items: [
          "A current risk assessment on file for every Tier 1 and Tier 2 site.",
          "Standardized lockdown procedure across all sites.",
          "NSGP applications submitted where eligible.",
          "An ongoing-advisory cadence (we recommend monthly check-ins, quarterly site visits).",
          "An incident-reporting standard that flows to a single diocesan repository.",
          "A line item in the diocesan budget for security that survives the next budgeting cycle.",
        ],
      },

      { type: "h2", text: "Year Two: what comes after the 90 days" },
      {
        type: "p",
        text: "The first 90 days build the baseline. Year Two is where the operating model matures. The work shifts from triage to maintenance and to reaching the long tail of Tier 3 sites that were not in the initial sweep.",
      },
      {
        type: "ul",
        items: [
          "Quarterly walkthroughs of Tier 1 and Tier 2 sites to verify implementation and re-evaluate.",
          "Annual full reassessment for the highest-priority sites.",
          "Active threat training rolled out across the portfolio - typically 2-4 sessions per year covering different staff cohorts.",
          "Drill design and observation, with after-action notes feeding the next round of procedure updates.",
          "Insurance renewal participation - we sit in on broker meetings if useful.",
          "An annual diocesan security report to the bishop summarizing posture, incidents, expenditures, and recommendations.",
        ],
      },

      { type: "h2", text: "What this costs" },
      {
        type: "p",
        text: "For a diocese in the range of dozens of sites, a coordinated 90-day effort typically requires advisory fees in the low-to-mid five figures, plus capital improvements that are often partially or fully reimbursable through NSGP for eligible sites. Larger portfolios scale up from there. The largest single risk reducer in the budget is usually the standardized lockdown procedure - which has near-zero capital cost and produces dramatic outcome improvements.",
      },

      { type: "h2", text: "What kills the timeline" },
      {
        type: "ol",
        items: [
          "No executive sponsor. If the bishop or chancellor does not visibly back the effort, parish-level resistance kills it.",
          "Trying to do everything at once. The roadmap works because Tier 1 buys focus. Skip the triage and the effort collapses.",
          "Picking a vendor that has not done a multi-site engagement before. The operating rhythm is different from a single client.",
          "Underestimating the time required to standardize procedure across many semi-autonomous sites.",
        ],
      },

      { type: "h2", text: "If you are on month 6 with no progress" },
      {
        type: "p",
        text: "We get this call regularly. The fix is usually not a new vendor - it is restarting the sequence. Re-establish the baseline, re-triage, walk the top sites in 90 days, and stop trying to perfect everything before starting anything.",
      },
      {
        type: "p",
        text: "If a diocese-wide effort is on your roadmap and you would like to talk through the sequence, we offer a complimentary 90-minute initial planning conversation. No commitment.",
      },
    ],
  },

  {
    slug: "five-questions-school-safety-committee",
    title: "The 5 Questions Every School Safety Committee Should Be Asking",
    description:
      "If your school has a safety committee, these five questions reveal whether it is actually doing the work. Most committees we encounter cannot answer four of the five.",
    publishedAt: "2026-03-25",
    lastReviewedAt: "2026-05-06",
    author: "Ocean State Protection Group",
    readMins: 6,
    category: "Schools",
    tags: ["Schools", "Safety Committee", "Operations"],
    ctaVariant: "committee-call",
    content: [
      {
        type: "p",
        text: "School safety committees are a near-universal best practice. Almost every school we walk through has one. But the existence of a committee does not mean security work is happening. The committee can become a place where work goes to look busy without actually moving the needle.",
      },
      {
        type: "p",
        text: "Here are the five questions we ask when we audit committee effectiveness. If a committee can answer all five clearly, they are doing the work. If they can answer fewer than three, the committee is decorative.",
      },

      { type: "h2", text: "Question 1: When was the last incident, and what changed because of it?" },
      {
        type: "p",
        text: "Every school has incidents. A graffiti tag, a stranger in the parking lot, a verbal threat between students, a parent who escalated at pickup. Most schools also have a pattern: the incident gets reported, it gets discussed, and nothing operational changes.",
      },
      {
        type: "p",
        text: "An effective safety committee can name the last three documented incidents and the procedure or infrastructure change that resulted from each one. If incidents happen but nothing changes, the committee is not closing the loop.",
      },

      { type: "h2", text: "Question 2: Who has tried to walk into the building without authorization in the last 90 days?" },
      {
        type: "p",
        text: "We do not mean breach attempts. We mean the everyday cases: a parent who tried to bypass the buzzer, a contractor who showed up without a confirmed visit, a delivery driver, a former employee. These are constant low-grade tests of your access control.",
      },
      {
        type: "p",
        text: "An effective committee tracks these as data. Patterns emerge. The committee can tell you which day of the week and time of day has the most attempts, and what the front desk does in response. If your committee cannot answer this, your front desk is reacting case by case without learning.",
      },

      { type: "h2", text: "Question 3: What is the lockdown decision tree for a teacher who is outside with a class when the announcement is made?" },
      {
        type: "p",
        text: "Most lockdown plans assume everyone is inside. Real campuses have PE classes, recess, outdoor learning, sports practice, lunch on the lawn. The committee should be able to answer in one minute exactly what each of these staff members does when the announcement comes.",
      },
      {
        type: "p",
        text: "If the answer is 'they should come back inside,' that is not a procedure - that is a wish. Inside requires a path. The path requires a decision: do they go to the nearest door, the door they know is unlocked, or back to their assigned classroom? The right answer depends on the geometry of your campus. The committee owns the answer.",
      },

      {
        type: "cta",
        title: "Want us to run the audit live with your committee?",
        body: "We offer a free 30-minute committee diagnostic call. Bring your safety committee chair, head of school, and one board member. We run the 5-question audit live and tell you where you actually stand. Practical, no commitment.",
        ctaLabel: "Schedule Diagnostic Call",
        ctaHref: "/walkthrough?topic=committee",
      },

      { type: "h2", text: "Question 4: How does an outsider report a concern about a student?" },
      {
        type: "p",
        text: "Most attacks - especially attacks by current or former students - have warning signs that someone outside the school noticed first. A neighbor, a parent of a friend, a former teacher, a coach. The path from 'I saw something concerning' to 'someone at the school took action' is a real workflow that has to be designed and tested.",
      },
      {
        type: "p",
        text: "An effective committee knows the path. They have published it on the school website. They have practiced it. They have a designated intake person and a backup. They have a documented response within 24 hours of any tip. If your committee cannot describe this workflow in one minute, you do not have one.",
      },
      {
        type: "callout",
        text: "Important: any reporting workflow involving students must coordinate with your school's mandated-reporting obligations under state law (in Rhode Island, R.I. Gen. Laws § 40-11-3) and federal frameworks including Title IX. A safety-tip workflow is operational. The reporting and disclosure obligations that may follow are legal. Build the workflow with your school counsel and your designated Title IX coordinator in the room - not after the fact.",
      },

      { type: "h2", text: "Question 5: What is on the schedule for the next 90 days?" },
      {
        type: "p",
        text: "An effective safety committee has work in motion at any given moment. A drill scheduled, a vendor walk scheduled, a board update scheduled, a training scheduled, a vendor invoice waiting on signature. If you ask the committee chair what is on the schedule for the next quarter and the answer is vague, the committee is not operating - it is meeting.",
      },

      { type: "h2", text: "What we do with this audit" },
      {
        type: "p",
        text: "We run this audit verbally during every SHIELD walkthrough at a school. It takes about 15 minutes. The committee chair, the head of school, and a board member usually sit in. The result tells us where to focus the rest of the assessment - because if the committee is functional, the school is much further along than the building suggests, and vice versa.",
      },
      {
        type: "p",
        text: "If your committee would benefit from an outside set of eyes running this audit, we are happy to do it as part of a complimentary diagnostic call or walkthrough. No commitment, just a working session.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

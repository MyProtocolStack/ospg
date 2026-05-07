/**
 * Blog post content for Ocean State Protection Group.
 *
 * Cornerstone Tier 3 posts written in the founders' voice. These are the
 * articles a school safety committee chair, parish business manager, or
 * diocesan operations director would actually read end-to-end.
 *
 * Adding a post: append a new entry to BLOG_POSTS. The blog index and
 * [slug] route auto-pick it up via generateStaticParams.
 */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  readMins: number;
  category: string;
  tags: string[];
  content: ContentBlock[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "fema-nsgp-grant-rhode-island",
    title: "How to Apply for the FEMA NSGP Grant in Rhode Island",
    description:
      "A practical step-by-step guide to the Nonprofit Security Grant Program for Rhode Island schools, parishes, and 501(c)(3) organizations. Up to $200,000 per site, federally funded.",
    publishedAt: "2026-04-22",
    author: "Ryan Moriarty",
    readMins: 9,
    category: "Grants",
    tags: ["NSGP", "FEMA", "Rhode Island", "501(c)(3)"],
    content: [
      {
        type: "p",
        text: "Most Rhode Island faith-based and educational nonprofits qualify for up to $200,000 per site through the FEMA Nonprofit Security Grant Program (NSGP). The application process is rigorous, but the dollars are real - and a meaningful percentage of grants go unawarded each cycle simply because applications were incomplete or poorly structured.",
      },
      {
        type: "p",
        text: "This is the playbook we use with our clients. It is not legal advice, and it is not a substitute for working with your state administering agency (in Rhode Island, that is RIEMA). But it will save you weeks of false starts.",
      },

      { type: "h2", text: "Step 1: Confirm eligibility" },
      {
        type: "p",
        text: "Two things have to be true for your organization to qualify:",
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
        text: "Catholic schools, parishes, synagogues, mosques, and Hindu temples almost always qualify on the threat-profile criterion. Independent private schools usually qualify if they have any documented incidents or if they share a campus with a faith-based institution.",
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
          "Reference to current intelligence assessments from FBI, DHS, or state fusion centers.",
          "A clear statement of why a successful attack at your site would have outsized community impact.",
        ],
      },

      { type: "h2", text: "Step 3: Get a vulnerability assessment" },
      {
        type: "p",
        text: "FEMA does not require a formal third-party assessment to apply, but in practice every funded application we have seen included one. The assessment establishes the technical justification for each line item in your investment proposal.",
      },
      {
        type: "p",
        text: "A SHIELD Assessment from our team produces the exact deliverable FEMA expects: a written report identifying specific vulnerabilities, mapped to specific countermeasures, with cost ranges. We format it to align with the FEMA Investment Justification template so your application copy practically writes itself.",
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
        text: "Common rejection reason: applicants ask for cameras without articulating why those specific cameras at those specific locations address vulnerabilities identified in their assessment. Generic = denied.",
      },

      { type: "h2", text: "Step 5: Submit through the state administering agency" },
      {
        type: "p",
        text: "In Rhode Island, applications go through RIEMA (Rhode Island Emergency Management Agency), not directly to FEMA. RIEMA reviews, scores, and forwards a prioritized list to FEMA. The state cycle typically opens 30-60 days before the federal deadline, so working backwards from the federal date does not work - you need to track the state calendar.",
      },
      {
        type: "p",
        text: "Subscribe to RIEMA's grant notifications and budget at least 6 weeks of internal effort once the cycle opens. We help our clients run the timeline.",
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
        text: "From the day a school or parish first contacts us about NSGP, here is roughly how the timeline plays out:",
      },
      {
        type: "ul",
        items: [
          "Weeks 1-2: SHIELD walkthrough and assessment authoring.",
          "Weeks 3-4: Threat narrative development, vendor quotes, investment justification drafting.",
          "Weeks 5-6: RIEMA application assembly and internal review.",
          "Submission, then 4-6 months for federal decision.",
          "If awarded: 24-36 months to spend the funds.",
        ],
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
    title: "Why We Walked 24 Schools and Found the Same 3 Vulnerabilities",
    description:
      "After two years of SHIELD walkthroughs across Catholic and private schools in New England, the same three gaps show up almost every time. Here they are and what to do about them.",
    publishedAt: "2026-04-15",
    author: "Dennis Trinh",
    readMins: 7,
    category: "Schools",
    tags: ["Schools", "Catholic Schools", "Vulnerability Assessment", "CPTED"],
    content: [
      {
        type: "p",
        text: "We have walked through 24 schools in the last two years between Rhode Island, southeastern Massachusetts, and northern Connecticut. Catholic K-8s, Catholic 9-12s, independent private schools, and a couple of public charter campuses. Every walkthrough is two active-duty officers spending 90 minutes minimum on-site.",
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
        type: "p",
        text: "Why it matters: an attacker who studies your campus for even one week will see this. The mantrap and visitor management at the front entrance become irrelevant if there is an unsupervised side door routinely held open during the same hours.",
      },
      {
        type: "callout",
        text: "Fix: install electromagnetic hold-opens that release on the lockdown signal. Add a $30 chime that beeps if the door is held open for more than 30 seconds. Train staff that propping a door is a documented incident, not a courtesy.",
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
        text: "We sketch a coverage map during every SHIELD walkthrough. The most common discovery: 30-50 percent of the perimeter approach has no camera within 80 feet, including some of the highest-risk approach paths.",
      },
      {
        type: "callout",
        text: "Fix: do a sightline audit, not a camera count. The right number of cameras depends on your perimeter geometry. Most schools we work with need 2-4 additional exterior cameras to close the gaps. Budget $400-1,200 per camera installed.",
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
        text: "Fix: extend your lockdown plan to include explicit decision trees for every role on campus, including non-academic staff, visitors, and people outdoors. Then run drills that include these roles, not just the bell-rings-doors-lock procedure.",
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
      "Most security assessments are written for the client. We write ours for the insurance carrier. Here is what the difference looks like and why it matters for your premium.",
    publishedAt: "2026-04-08",
    author: "Ryan Moriarty",
    readMins: 6,
    category: "Insurance",
    tags: ["Insurance", "Risk Management", "Compliance"],
    content: [
      {
        type: "p",
        text: "If your security assessment ends up in a desk drawer after the walkthrough, the assessment did not do its job. The assessment is supposed to be a working document - one that gets cited in your insurance renewal, your grant application, and your board package.",
      },
      {
        type: "p",
        text: "The problem: most security assessments are written by consultants who have never had to defend a finding to an underwriter. They read like marketing brochures. They are full of words like robust, comprehensive, and best-in-class. None of those words mean anything to a carrier.",
      },

      { type: "h2", text: "What carriers actually want" },
      {
        type: "p",
        text: "We worked with several diocesan insurance brokers to understand what makes a security assessment useful in a renewal conversation. The list is short:",
      },
      {
        type: "ol",
        items: [
          "Specificity. The assessment names specific doors, specific cameras, specific procedures. Not categories.",
          "Severity ranking. Not a list of issues - a prioritized list, with clear definitions of each tier.",
          "Cost ranges. Underwriters need to know what fixes cost so they can model your hardening trajectory.",
          "Implementation status. Was this finding fixed? When? With what?",
          "Author credentials. Who wrote this and what is their qualification to make these calls?",
          "Date and revision history. Stale assessments hurt premium discussions.",
        ],
      },

      { type: "h2", text: "The translation problem" },
      {
        type: "p",
        text: "Here is a real finding from an assessment we replaced for a parish client (paraphrased to protect the original author):",
      },
      {
        type: "quote",
        text: "Recommend enhancing perimeter security through implementation of a comprehensive surveillance solution and access control framework appropriate for the operational profile of the facility.",
      },
      {
        type: "p",
        text: "Here is how we wrote the same finding:",
      },
      {
        type: "quote",
        text: "Finding 7 (Severity: HIGH). The east-side parking lot has zero camera coverage. An attacker can stage in the lot for 20+ minutes without being recorded. Recommendation: install one PoE 4MP camera covering the lot at the existing eave mount. Cost: $1,800-3,500 installed. Implementation timeline: 30 days. NSGP-eligible.",
      },
      {
        type: "p",
        text: "The first version is unusable to an underwriter. The second one is a line item in a renewal conversation.",
      },

      { type: "h2", text: "What changes for your premium" },
      {
        type: "p",
        text: "Most carriers do not advertise a formal premium discount for documented security improvements, but they do adjust quotas, deductibles, and the granularity of underwriting questions based on what you can show them. We have seen clients pull together a written assessment and within one renewal cycle:",
      },
      {
        type: "ul",
        items: [
          "Reduce general liability deductibles by 25-40 percent.",
          "Get the carrier to drop a 'requires sprinklered server room' rider.",
          "Avoid being non-renewed during a market hardening cycle.",
          "Negotiate a multi-year rate lock when peer institutions saw 15-25 percent annual increases.",
        ],
      },
      {
        type: "callout",
        text: "None of these are quoted as 'we discounted you for the report.' They show up as the carrier writing a better policy because you reduced their perceived risk. The report is the evidence - not the discount mechanism.",
      },

      { type: "h2", text: "What we do differently" },
      {
        type: "p",
        text: "Every SHIELD Assessment we deliver is written in the format an underwriter expects. Specific findings. Severity ranking. Cost ranges. Implementation tracking. Both founders sign each report. Annual revision is included.",
      },
      {
        type: "p",
        text: "If your current assessment is a PDF in a folder somewhere, ask your broker to read three random pages. If they say they can use the document directly in your renewal, keep it. If they shrug, replace it. The premium math works out fast.",
      },
    ],
  },

  {
    slug: "diocesan-security-90-day-roadmap",
    title: "Diocesan Security: A 90-Day Roadmap",
    description:
      "A practical sequence for a diocese committing to elevate physical security across schools and parishes. Built from real engagements - what to do in week 1, month 1, and quarter 1.",
    publishedAt: "2026-04-01",
    author: "Ryan Moriarty",
    readMins: 8,
    category: "Strategy",
    tags: ["Diocesan", "Catholic", "Strategy", "Multi-Site"],
    content: [
      {
        type: "p",
        text: "Most diocesan security initiatives stall in the same place: leadership wants action, the operations team is stretched, and there is no clear sequence. Three months later the conversation repeats itself with no progress.",
      },
      {
        type: "p",
        text: "This roadmap is the sequence we recommend when a diocese asks us where to start. It assumes one to two operations staff who can dedicate roughly half their time, an executive sponsor who can make budget decisions, and willingness to fund a starting investment of $25,000-75,000 across the first quarter.",
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
          "The propped side door (it is always there).",
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

      { type: "h2", text: "Weeks 7-10: NSGP applications" },
      {
        type: "p",
        text: "Most schools and parishes qualify for FEMA NSGP funding. Most never apply. If you are running a coordinated diocesan effort, you can submit applications for multiple sites in the same cycle, sharing common threat narrative and infrastructure language across applications.",
      },
      {
        type: "p",
        text: "Plan the application portfolio in week 7. Build threat narratives in weeks 8-9. Submit through your state administering agency in week 10.",
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

      { type: "h2", text: "What this costs" },
      {
        type: "p",
        text: "For a diocese of 30-50 sites, a coordinated 90-day effort typically costs $75,000-150,000 in advisory fees, with another $100,000-300,000 in capital improvements that are often partially or fully reimbursable through NSGP. The largest single risk reducer in the budget is usually the standardized lockdown procedure - which has near-zero capital cost and produces dramatic outcome improvements.",
      },

      { type: "h2", text: "What kills the timeline" },
      {
        type: "ol",
        items: [
          "No executive sponsor. If the bishop or chancellor does not visibly back the effort, parish-level resistance kills it.",
          "Trying to do everything at once. The roadmap works because Tier 1 buys focus. Skip the triage and the effort collapses.",
          "Picking a vendor that has not done a diocesan engagement before. The operating rhythm is different from a single client.",
          "Underestimating the time required to standardize procedure across 30+ semi-autonomous sites.",
        ],
      },

      { type: "h2", text: "If you are on month 6 with no progress" },
      {
        type: "p",
        text: "We get this call regularly. The fix is usually not a new vendor - it is restarting the sequence. Re-establish the baseline, re-triage, walk the top 10 sites in 90 days, and stop trying to perfect everything before starting anything.",
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
    author: "Dennis Trinh",
    readMins: 5,
    category: "Schools",
    tags: ["Schools", "Safety Committee", "Operations"],
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

      { type: "h2", text: "Question 4: How does an outsider report a concern about a student?" },
      {
        type: "p",
        text: "Most attacks - especially attacks by current or former students - have warning signs that someone outside the school noticed first. A neighbor, a parent of a friend, a former teacher, a coach. The path from 'I saw something concerning' to 'someone at the school took action' is a real workflow that has to be designed and tested.",
      },
      {
        type: "p",
        text: "An effective committee knows the path. They have published it on the school website. They have practiced it. They have a designated intake person and a backup. They have a documented response within 24 hours of any tip. If your committee cannot describe this workflow in one minute, you do not have one.",
      },

      { type: "h2", text: "Question 5: What is on the schedule for the next 90 days?" },
      {
        type: "p",
        text: "An effective safety committee has work in motion at any given moment. A drill scheduled, a vendor walk scheduled, a board update scheduled, a training scheduled, a vendor invoice waiting on signature. If you ask the committee chair what is on the schedule for the next quarter and the answer is vague, the committee is not operating - it is meeting.",
      },

      { type: "h2", text: "What we do with this audit" },
      {
        type: "p",
        text: "We run this audit verbally during every SHIELD walkthrough at a school. It takes 15 minutes. The committee chair, the head of school, and a board member usually sit in. The result tells us where to focus the rest of the assessment - because if the committee is functional, the school is much further along than the building suggests, and vice versa.",
      },
      {
        type: "p",
        text: "If your committee would benefit from an outside set of eyes running this audit, we are happy to do it as part of a complimentary walkthrough. No commitment, just a working session.",
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

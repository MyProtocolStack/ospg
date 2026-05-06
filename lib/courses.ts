/**
 * Course catalog — seed data.
 * Hand-edited until we wire courses CMS into Supabase.
 * Lessons are placeholder shells; video URLs and full markdown go in later.
 */

export type Lesson = {
  slug: string;
  title: string;
  kind: "video" | "written" | "scenario" | "live";
  duration_minutes: number;
  preview?: boolean;
  summary: string;
  body_md?: string;       // full content for written lessons
  video_url?: string;     // populate when video uploaded
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover_emoji: string;
  duration_minutes: number;
  difficulty: "foundational" | "intermediate" | "advanced";
  free: boolean;          // included in subscriber tier
  price_cents?: number;   // one-time purchase price
  audience: string[];     // ICP labels
  lessons: Lesson[];
};

export const COURSES: Course[] = [
  {
    slug: "threat-assessment-fundamentals",
    title: "Threat Assessment Fundamentals",
    subtitle: "How to evaluate a property the way a law-enforcement officer does.",
    description:
      "A practical course on conducting your own preliminary threat assessment. Built for staff, volunteers, and safety committees who want to think clearly about risk before something happens. Active-duty law enforcement instructors. Real-world scenarios. Insurance-defensible documentation patterns.",
    cover_emoji: "🛡️",
    duration_minutes: 165,
    difficulty: "foundational",
    free: true,
    price_cents: 24900,
    audience: ["Catholic schools", "Parishes", "Daycares", "Small businesses", "Houses of worship"],
    lessons: [
      {
        slug: "what-is-a-threat-assessment",
        title: "What a threat assessment actually is (and isn't)",
        kind: "video",
        duration_minutes: 12,
        preview: true,
        summary:
          "The difference between a vulnerability assessment, a threat assessment, and a risk assessment. Why most schools confuse all three.",
      },
      {
        slug: "the-three-phases",
        title: "The three phases: identify, evaluate, respond",
        kind: "video",
        duration_minutes: 18,
        summary:
          "How professional assessors work. The 'identify-evaluate-respond' framework that drives every credible assessment in the industry.",
      },
      {
        slug: "documenting-what-you-see",
        title: "How to document what you see",
        kind: "written",
        duration_minutes: 25,
        summary:
          "The actual paperwork that makes an assessment defensible. Templates, photo conventions, language patterns to use and avoid.",
      },
      {
        slug: "perimeter-and-approach",
        title: "Perimeter and approach analysis",
        kind: "video",
        duration_minutes: 22,
        summary:
          "Walk an exterior with the eyes of a hostile actor. Then walk it again with the eyes of a defender. The mental model shift that changes everything.",
      },
      {
        slug: "interior-flow",
        title: "Interior flow: corridors, gathering points, lockdown zones",
        kind: "video",
        duration_minutes: 20,
        summary:
          "How attackers move through buildings. How to map your sightlines, blind spots, and lockdown geometry without architectural training.",
      },
      {
        slug: "scenario-school-side-entrance",
        title: "Scenario: Catholic school side entrance",
        kind: "scenario",
        duration_minutes: 15,
        summary:
          "A walk-through scenario based on a real Rhode Island campus. Identify the gaps. Document the findings. Recommend the fixes.",
      },
      {
        slug: "scenario-parish-after-mass",
        title: "Scenario: Parish parking lot after evening mass",
        kind: "scenario",
        duration_minutes: 15,
        summary:
          "Different threat profile than school day. Lighting, dispersal patterns, where assailants wait. How to harden against the actual risk.",
      },
      {
        slug: "writing-the-summary",
        title: "Writing the executive summary",
        kind: "written",
        duration_minutes: 18,
        summary:
          "The page leadership actually reads. How to write a 1-page summary that drives action without inducing panic.",
      },
      {
        slug: "next-steps",
        title: "Next steps: when to call a professional",
        kind: "video",
        duration_minutes: 10,
        summary:
          "Knowing your limits. The thresholds at which you should bring in active-duty law enforcement, a licensed engineer, or your insurance carrier's loss-control team.",
      },
      {
        slug: "completion-quiz",
        title: "Completion: knowledge check + certificate",
        kind: "scenario",
        duration_minutes: 10,
        summary:
          "10-question scenario-based knowledge check. Pass to receive your Lighthouse Threat Assessment Fundamentals certificate.",
      },
    ],
  },
  {
    slug: "shelter-in-place-protocols",
    title: "Shelter in Place: Protocols & Drills",
    subtitle: "Modern lockdown and shelter response for schools, parishes, and workplaces.",
    description:
      "What 'lockdown' actually means in 2026 — and why old playbooks fail. Updated for current threat patterns including active assailant, hostile vehicle, civil unrest, and weather-related shelter events. Includes ready-to-run drill scripts, parent-communication templates, and post-incident debrief frameworks.",
    cover_emoji: "🚨",
    duration_minutes: 155,
    difficulty: "foundational",
    free: true,
    price_cents: 24900,
    audience: ["Catholic schools", "Parishes", "Workplaces", "Daycares", "Religious institutions"],
    lessons: [
      {
        slug: "lockdown-vs-shelter",
        title: "Lockdown vs. shelter-in-place vs. evacuate",
        kind: "video",
        duration_minutes: 14,
        preview: true,
        summary:
          "The three responses, when each applies, and the most common error: defaulting to one when another is correct.",
      },
      {
        slug: "trigger-decisions",
        title: "Who decides — and how fast",
        kind: "video",
        duration_minutes: 18,
        summary:
          "Decision authority in a crisis. The 'first 90 seconds' problem and how to design protocols that don't require a committee meeting to act.",
      },
      {
        slug: "communication-tree",
        title: "The communication tree",
        kind: "written",
        duration_minutes: 22,
        summary:
          "How to reach 700 students, 120 staff, 1,400 parents, the diocese, and the police — simultaneously, without the system collapsing.",
      },
      {
        slug: "classroom-procedures",
        title: "Classroom-level procedures",
        kind: "video",
        duration_minutes: 20,
        summary:
          "What teachers actually do, said in 8 words or fewer. Door procedures, position, voice, distraction tactics, kid-management.",
      },
      {
        slug: "non-classroom-spaces",
        title: "Non-classroom spaces — chapel, gym, cafeteria, hallways",
        kind: "video",
        duration_minutes: 18,
        summary:
          "Half your population is somewhere other than a classroom most of the day. The protocol gaps everyone overlooks.",
      },
      {
        slug: "drill-scripts",
        title: "Drill scripts (3 ready-to-run)",
        kind: "written",
        duration_minutes: 22,
        summary:
          "Three full drill scripts: a basic-level practice drill, a surprise-element drill, and a multi-event scenario drill. Includes facilitator notes.",
      },
      {
        slug: "scenario-active-assailant",
        title: "Scenario: active assailant in the gym",
        kind: "scenario",
        duration_minutes: 15,
        summary:
          "Scenario walkthrough. You decide every move. The system grades each decision against current best practices.",
      },
      {
        slug: "scenario-credible-threat-call",
        title: "Scenario: credible bomb-threat call",
        kind: "scenario",
        duration_minutes: 12,
        summary:
          "What to do when the call comes in. Evacuate or shelter? When to engage PD. Documentation requirements.",
      },
      {
        slug: "post-incident",
        title: "Post-incident: debrief, mental-health, documentation",
        kind: "written",
        duration_minutes: 14,
        summary:
          "The hours after the all-clear. Debrief framework. Mental-health resources for staff and students. Documentation requirements.",
      },
      {
        slug: "completion-quiz-shelter",
        title: "Completion: knowledge check + certificate",
        kind: "scenario",
        duration_minutes: 10,
        summary:
          "10-question knowledge check. Pass to receive your Lighthouse Shelter-in-Place certificate.",
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string): Lesson | undefined {
  return getCourse(courseSlug)?.lessons.find((l) => l.slug === lessonSlug);
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Play,
  FileText,
  Target,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

const COURSE_ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  AlertTriangle,
  BookOpen,
};
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getCourse } from "@/lib/courses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCourse(slug);
  return {
    title: c?.title ?? "Course",
    description: c?.description,
  };
}

const KIND_ICON = {
  video: Play,
  written: FileText,
  scenario: Target,
  live: Users,
};
const KIND_LABEL = {
  video: "Video",
  written: "Written",
  scenario: "Scenario",
  live: "Live cohort",
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const totalMin = course.lessons.reduce((s, l) => s + l.duration_minutes, 0);
  const CourseIcon = COURSE_ICON_MAP[course.icon] ?? BookOpen;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-8 transition-colors"
            >
              ← All courses
            </Link>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-6">
              <CourseIcon className="h-8 w-8 text-[var(--color-gold-400)]" strokeWidth={1.3} />
            </div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--color-gold-400)] px-3 py-1 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                {course.difficulty}
              </span>
              {course.free && (
                <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--color-cream)] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Subscriber-included
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] leading-tight tracking-tight mb-4 max-w-3xl">
              {course.title}
            </h1>
            <p className="text-xl text-[var(--color-silver-100)] mb-6 max-w-2xl">
              {course.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-[14px] text-[var(--color-silver-200)] mb-8">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--color-gold-400)]" strokeWidth={1.5} />
                {Math.round(totalMin / 5) * 5} minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4 text-[var(--color-gold-400)]" strokeWidth={1.5} />
                {course.lessons.length} lessons
              </span>
              <span className="inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-[var(--color-gold-400)]" strokeWidth={1.5} />
                Certificate on completion
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/courses/${course.slug}/${course.lessons[0].slug}`}
                className="btn-primary group"
              >
                Start Free Preview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/#pricing" className="btn-secondary">
                View Subscriber Plan
              </Link>
            </div>
          </div>
        </section>

        {/* Description + lessons */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lessons list */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3">
                What you&apos;ll learn
              </h2>
              <p className="text-[var(--color-silver-200)] leading-relaxed mb-10">
                {course.description}
              </p>

              <h3 className="font-display text-xl text-[var(--color-cream)] mb-5">
                Course outline
              </h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => {
                  const Icon = KIND_ICON[lesson.kind];
                  return (
                    <div
                      key={lesson.slug}
                      className="surface-card p-5 flex items-start gap-4 group"
                    >
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center text-[12px] font-bold text-[var(--color-gold-400)]">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Icon
                            className="h-3.5 w-3.5 text-[var(--color-silver-300)]"
                            strokeWidth={1.5}
                          />
                          <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-silver-300)]">
                            {KIND_LABEL[lesson.kind]}
                          </span>
                          <span className="text-[10px] text-[var(--color-silver-400)]">·</span>
                          <span className="text-[12px] text-[var(--color-silver-300)]">
                            {lesson.duration_minutes} min
                          </span>
                          {lesson.preview && (
                            <span className="ml-1 text-[9px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-1.5 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                              Free preview
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-[16px] text-[var(--color-cream)] mb-1.5 leading-tight">
                          {lesson.title}
                        </h4>
                        <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed">
                          {lesson.summary}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {lesson.preview ? (
                          <CheckCircle2
                            className="h-5 w-5 text-[var(--color-gold-400)]"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Lock
                            className="h-4 w-4 text-[var(--color-silver-400)]"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky sidebar — pricing/audience */}
            <aside className="lg:sticky lg:top-32 self-start space-y-5">
              <div className="surface-card-elevated p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2">
                  Investment
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  {course.price_cents ? (
                    <>
                      <span className="font-display text-3xl text-gradient-gold">
                        ${(course.price_cents / 100).toFixed(0)}
                      </span>
                      <span className="text-[13px] text-[var(--color-silver-300)]">one-time</span>
                    </>
                  ) : (
                    <span className="font-display text-3xl text-gradient-gold">Free</span>
                  )}
                </div>
                <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed mb-5">
                  Or get this course plus the entire Lighthouse training library, SHIELD AI, and
                  PILOT for{" "}
                  <strong className="text-[var(--color-gold-400)]">$199/month</strong> with the
                  Subscriber plan.
                </p>
                <Link href="/pricing" className="btn-primary w-full justify-center text-sm">
                  View Plans
                </Link>
              </div>

              <div className="surface-card p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-3">
                  Built for
                </p>
                <ul className="space-y-2">
                  {course.audience.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 text-[13px] text-[var(--color-silver-100)]"
                    >
                      <div className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

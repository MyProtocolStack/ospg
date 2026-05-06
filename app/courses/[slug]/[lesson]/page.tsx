import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Play, FileText, Target, Users, CheckCircle2, Lock } from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { getCourse, getLesson } from "@/lib/courses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson } = await params;
  const c = getCourse(slug);
  const l = getLesson(slug, lesson);
  return {
    title: l ? `${l.title} — ${c?.title}` : "Lesson",
    description: l?.summary,
  };
}

const KIND_ICON = {
  video: Play,
  written: FileText,
  scenario: Target,
  live: Users,
};

const KIND_LABEL = {
  video: "Video Lesson",
  written: "Written Module",
  scenario: "Scenario Walkthrough",
  live: "Live Cohort",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson: lessonSlug } = await params;
  const course = getCourse(slug);
  const lesson = getLesson(slug, lessonSlug);
  if (!course || !lesson) notFound();

  const idx = course.lessons.findIndex((l) => l.slug === lessonSlug);
  const prev = idx > 0 ? course.lessons[idx - 1] : null;
  const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null;

  const Icon = KIND_ICON[lesson.kind];
  const locked = !lesson.preview;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          {/* Top breadcrumb */}
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {course.title}
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Icon
                className="h-4 w-4 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium">
                {KIND_LABEL[lesson.kind]}
              </span>
              <span className="text-[11px] text-[var(--color-silver-400)]">·</span>
              <span className="text-[12px] text-[var(--color-silver-300)]">
                {lesson.duration_minutes} min
              </span>
              <span className="text-[11px] text-[var(--color-silver-400)]">·</span>
              <span className="text-[12px] text-[var(--color-silver-300)]">
                Lesson {idx + 1} of {course.lessons.length}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-[var(--color-cream)] leading-tight tracking-tight mb-4">
              {lesson.title}
            </h1>
            <p className="text-lg text-[var(--color-silver-200)] leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          {/* Content */}
          {locked ? (
            <LockedPreview courseSlug={course.slug} />
          ) : (
            <LessonContent lesson={lesson} />
          )}

          {/* Nav */}
          <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/courses/${course.slug}/${prev.slug}`}
                className="surface-card p-5 hover:surface-card-elevated transition-all group"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-1.5">
                  ← Previous
                </p>
                <p className="text-[14px] text-[var(--color-cream)] font-medium leading-tight">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/courses/${course.slug}/${next.slug}`}
                className="surface-card p-5 hover:surface-card-elevated transition-all text-right group"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-1.5">
                  Next →
                </p>
                <p className="text-[14px] text-[var(--color-cream)] font-medium leading-tight">
                  {next.title}
                </p>
              </Link>
            ) : (
              <div className="surface-card-elevated p-5 text-right">
                <CheckCircle2
                  className="h-5 w-5 text-[var(--color-gold-400)] mb-2 ml-auto"
                  strokeWidth={1.5}
                />
                <p className="text-[14px] text-[var(--color-cream)] font-medium">
                  Course complete
                </p>
                <p className="text-[12px] text-[var(--color-silver-300)]">
                  Certificate ready
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function LessonContent({
  lesson,
}: {
  lesson: { kind: string; video_url?: string; body_md?: string; title: string };
}) {
  if (lesson.kind === "video") {
    return (
      <div>
        <div className="aspect-video rounded-xl overflow-hidden surface-card-elevated p-1 mb-8">
          {lesson.video_url ? (
            <iframe
              src={lesson.video_url}
              title={lesson.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-navy-800)] rounded-lg flex flex-col items-center justify-center text-center p-8">
              <Play
                className="h-16 w-16 text-[var(--color-gold-400)]/40 mb-4"
                strokeWidth={1}
              />
              <p className="text-[var(--color-silver-300)] mb-2">
                Video uploading soon.
              </p>
              <p className="text-[12px] text-[var(--color-silver-400)] max-w-md">
                This lesson is being recorded. Subscribers will be notified by
                email when it goes live.
              </p>
            </div>
          )}
        </div>
        <div className="surface-card p-6">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2">
            Lesson notes
          </p>
          <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
            Detailed lesson notes, transcripts, and downloadable resources will
            appear here once the video is finalized.
          </p>
        </div>
      </div>
    );
  }

  if (lesson.kind === "written") {
    return (
      <article className="surface-card p-8 md:p-10">
        {lesson.body_md ? (
          <div className="text-[15px] text-[var(--color-silver-100)] leading-[1.8] whitespace-pre-line">
            {lesson.body_md}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText
              className="h-12 w-12 text-[var(--color-gold-400)]/40 mx-auto mb-4"
              strokeWidth={1.5}
            />
            <p className="text-[var(--color-silver-300)] mb-2">
              Written content publishing soon.
            </p>
            <p className="text-[12px] text-[var(--color-silver-400)] max-w-md mx-auto">
              This module is being authored by our active-duty instructors.
              Subscribers will be notified when published.
            </p>
          </div>
        )}
      </article>
    );
  }

  if (lesson.kind === "scenario") {
    return (
      <div className="surface-card-elevated p-8 md:p-10 text-center">
        <Target
          className="h-12 w-12 text-[var(--color-gold-400)] mx-auto mb-5"
          strokeWidth={1.5}
        />
        <h3 className="font-display text-2xl text-[var(--color-cream)] mb-3">
          Interactive scenario
        </h3>
        <p className="text-[var(--color-silver-100)] leading-relaxed max-w-xl mx-auto mb-6">
          A walkthrough scenario where every decision shapes the outcome. The
          system evaluates your choices against current best practices.
        </p>
        <p className="text-[12px] text-[var(--color-silver-400)]">
          Scenario player launching soon.
        </p>
      </div>
    );
  }

  return null;
}

function LockedPreview({ courseSlug }: { courseSlug: string }) {
  return (
    <div className="surface-card-elevated p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-5">
        <Lock
          className="h-7 w-7 text-[var(--color-gold-400)]"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="font-display text-2xl text-[var(--color-cream)] mb-3">
        This lesson is for subscribers.
      </h3>
      <p className="text-[var(--color-silver-200)] mb-6 max-w-md mx-auto leading-relaxed">
        Get unlimited access to every Lighthouse course, SHIELD AI, PILOT, and
        quarterly walkthroughs for $199/month.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/pricing" className="btn-primary">
          View Subscriber Plan
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href={`/courses/${courseSlug}`} className="btn-secondary">
          Back to Course
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Clock, Layers3, ArrowRight, Shield, AlertTriangle, BookOpen } from "lucide-react";
import { COURSES } from "@/lib/courses";

const COURSE_ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  AlertTriangle,
  BookOpen,
};

export const metadata = { title: "My Courses" };

export default function DashboardCoursesPage() {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Training
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            My Courses
          </h1>
          <p className="text-[var(--color-silver-200)]">
            Active-duty-officer-led training. Threat assessment, shelter in place,
            scenario library. Certificates on completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COURSES.map((c) => {
            const CourseIcon = COURSE_ICON_MAP[c.icon] ?? BookOpen;
            return (
            <Link
              key={c.slug}
              href={`/dashboard/courses/${c.slug}`}
              className="surface-card p-6 hover:surface-card-elevated transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-4">
                <CourseIcon className="h-6 w-6 text-[var(--color-gold-400)]" strokeWidth={1.3} />
              </div>
              <h2 className="font-display text-xl text-[var(--color-cream)] mb-2 group-hover:text-gradient-gold transition-all">
                {c.title}
              </h2>
              <p className="text-[14px] text-[var(--color-silver-200)] mb-4 leading-relaxed">
                {c.subtitle}
              </p>
              <div className="flex items-center gap-4 text-[12px] text-[var(--color-silver-300)] pt-4 border-t border-white/5">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {Math.round(c.duration_minutes / 5) * 5}m
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {c.lessons.length} lessons
                </span>
                <span className="ml-auto text-[var(--color-gold-400)] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

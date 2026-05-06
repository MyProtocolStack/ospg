import Link from "next/link";
import { ArrowRight, Clock, Layers3, Sparkles, Shield, AlertTriangle, BookOpen } from "lucide-react";

const COURSE_ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  AlertTriangle,
  BookOpen,
};
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { COURSES } from "@/lib/courses";

export const metadata = {
  title: "Training Courses",
  description:
    "Threat assessment, shelter in place, and lockdown training — taught by active-duty law enforcement.",
};

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 lg:px-10 text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              Training Library
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Built by{" "}
              <span className="italic text-gradient-gold">active-duty officers.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Practical training for the people inside your building when something
              happens. Video lessons, written modules, scenario walkthroughs, and
              live-cohort options. Certificates on completion.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COURSES.map((c) => {
                const CourseIcon = COURSE_ICON_MAP[c.icon] ?? BookOpen;
                return (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="surface-card-elevated p-8 group hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-5">
                    <CourseIcon className="h-7 w-7 text-[var(--color-gold-400)]" strokeWidth={1.3} />
                  </div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                      {c.difficulty}
                    </span>
                    {c.free && (
                      <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[var(--color-cream)] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        Subscriber-included
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-2 group-hover:text-gradient-gold transition-all">
                    {c.title}
                  </h2>
                  <p className="text-[15px] text-[var(--color-silver-200)] mb-5 leading-relaxed">
                    {c.subtitle}
                  </p>
                  <div className="flex items-center gap-5 text-[13px] text-[var(--color-silver-300)] mb-5">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {Math.round(c.duration_minutes / 5) * 5} min
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {c.lessons.length} lessons
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <span className="text-[13px] text-[var(--color-silver-200)]">
                      {c.price_cents
                        ? `$${(c.price_cents / 100).toFixed(0)} one-time`
                        : "Free"}
                    </span>
                    <span className="text-[13px] text-[var(--color-gold-400)] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      View Course
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
              })}
            </div>

            {/* CTA — coming soon */}
            <div className="mt-16 surface-card p-10 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles
                  className="h-4 w-4 text-[var(--color-gold-400)]"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium">
                  More coming
                </span>
              </div>
              <h3 className="font-display text-2xl text-[var(--color-cream)] mb-3">
                Need a custom course for your team?
              </h3>
              <p className="text-[var(--color-silver-200)] max-w-xl mx-auto mb-6">
                We build vertical-specific curriculum (Catholic schools, parishes,
                gyms, businesses) for groups of 10+. In-person or virtual.
              </p>
              <Link href="/contact" className="btn-primary">
                Request Custom Training
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

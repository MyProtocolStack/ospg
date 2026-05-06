import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  AlertTriangle,
  GraduationCap,
  Church,
  Home,
  Briefcase,
  Calendar,
  Building2,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getVertical, VERTICALS } from "@/lib/verticals";

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  Church,
  Home,
  Briefcase,
  Calendar,
  Building2,
};

export async function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVertical(slug);
  return {
    title: v?.fullName ?? "Vertical",
    description: v?.hookSub,
  };
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const Icon = ICON_MAP[v.icon] ?? Building2;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-6">
              <Icon
                className="h-10 w-10 text-[var(--color-gold-400)]"
                strokeWidth={1.3}
              />
            </div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              {v.fullName}
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              {v.hookHeadline}
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              {v.hookSub}
            </p>
          </div>
        </section>

        {/* Threats + Solutions */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-crimson-500)] mb-3">
                The Threats
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-6 leading-tight">
                What we see in this vertical.
              </h2>
              <ul className="space-y-3">
                {v.threats.map((t, i) => (
                  <li
                    key={i}
                    className="flex gap-3 p-4 rounded-lg bg-[var(--color-crimson-500)]/5 border border-[var(--color-crimson-500)]/15"
                  >
                    <AlertTriangle
                      className="h-5 w-5 text-[var(--color-crimson-500)] shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <span className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                The Lighthouse Approach
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-6 leading-tight">
                What we deliver.
              </h2>
              <ul className="space-y-3">
                {v.solutions.map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-3 p-4 rounded-lg bg-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/20"
                  >
                    <Check
                      className="h-5 w-5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <span className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Social proof / CTA */}
        <section className="py-20 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <p className="text-[15px] text-[var(--color-silver-200)] italic mb-10 leading-relaxed">
              &ldquo;{v.socialProof}&rdquo;
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-6">
              Start where it&apos;s free.
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/walkthrough" className="btn-primary group">
                {v.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to a Founder
              </Link>
            </div>
          </div>
        </section>

        {/* Other verticals */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 text-center">
              Other Verticals
            </p>
            <h3 className="font-display text-2xl text-[var(--color-cream)] mb-8 text-center">
              We also work with
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {VERTICALS.filter((other) => other.slug !== v.slug).map((other) => {
                const OtherIcon = ICON_MAP[other.icon] ?? Building2;
                return (
                  <Link
                    key={other.slug}
                    href={`/verticals/${other.slug}`}
                    className="surface-card p-4 text-center hover:surface-card-elevated transition-all duration-300 group"
                  >
                    <OtherIcon
                      className="h-6 w-6 text-[var(--color-gold-400)] mx-auto mb-2"
                      strokeWidth={1.3}
                    />
                    <p className="text-[13px] text-[var(--color-cream)] group-hover:text-gradient-gold transition-all">
                      {other.shortLabel}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

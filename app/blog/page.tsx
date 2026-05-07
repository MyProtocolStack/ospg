import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BLOG_POSTS } from "@/lib/blog-posts";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";

export const metadata = {
  title: "Threat Intelligence - Ocean State Protection Group",
  description:
    "Practical writing on physical security, FEMA NSGP grants, school safety, and diocesan operations from active-duty Cranston PD officers Ryan Moriarty and Dennis Trinh.",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  // Sort by date descending
  const sorted = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <FileText className="h-3.5 w-3.5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Threat Intelligence
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Practical writing.{" "}
              <span className="italic text-gradient-gold">No fluff.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              FEMA grants, school safety, parish dispersal, insurance carriers,
              and what we have learned walking 24+ campuses across New England.
              Written by the same officers who do the walkthroughs.
            </p>
          </div>
        </section>

        {/* Featured post */}
        {featured && (
          <section className="py-12">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <Link
                href={`/blog/${featured.slug}`}
                className="surface-card-elevated p-8 lg:p-10 block group hover:border-[var(--color-gold-400)]/30 transition-colors"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
                  Featured / Latest
                </p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-cream)] mb-4 leading-tight group-hover:text-gradient-gold transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[16px] text-[var(--color-silver-100)] leading-relaxed mb-6 max-w-3xl">
                  {featured.description}
                </p>
                <div className="flex items-center gap-5 text-[12px] text-[var(--color-silver-300)] mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readMins} min read
                  </span>
                  <span>By {featured.author}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-[14px] text-[var(--color-gold-400)] font-medium group-hover:gap-3 transition-all">
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* Rest of posts */}
        {rest.length > 0 && (
          <section className="py-12">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-6">
                More Articles
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="surface-card p-7 block group hover:border-[var(--color-gold-400)]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                        {p.category}
                      </span>
                      <span className="text-[11px] text-[var(--color-silver-300)]">
                        {p.readMins} min read
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-[var(--color-cream)] mb-3 leading-tight group-hover:text-gradient-gold transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed mb-4 line-clamp-3">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between text-[12px] text-[var(--color-silver-300)]">
                      <span>{formatDate(p.publishedAt)}</span>
                      <span className="flex items-center gap-1 text-[var(--color-gold-400)]">
                        Read
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 mt-12 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4">
              Want this kind of analysis on your campus?
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              The articles describe what we find. The walkthrough is where you
              find out what is actually happening at your specific site.
            </p>
            <Link href="/walkthrough" className="btn-primary">
              Book Free Walkthrough
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

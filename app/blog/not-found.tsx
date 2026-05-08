/**
 * Custom 404 inside the /blog route group.
 *
 * Catches blog/[slug] notFound() calls (when a post slug doesn't
 * exist) plus typo navigations within /blog/*. Surfaces the latest
 * posts as recovery options instead of dropping the user on the
 * generic global 404.
 */
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { ArrowLeft, ArrowRight, FileQuestion } from "lucide-react";

export const metadata = { title: "Article Not Found" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogNotFound() {
  // Sort by date and surface the three most recent for recovery.
  const recent = [...BLOG_POSTS]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <FileQuestion
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Article Not Found
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              That article{" "}
              <span className="italic text-gradient-gold">does not exist.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-xl mx-auto leading-relaxed">
              The link you followed may be broken, or the post may have been
              removed. Below are the three most recent Field Notes - one of
              them probably covers what you were looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Link href="/blog" className="btn-primary">
                <ArrowLeft className="h-4 w-4" />
                Browse all Field Notes
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Recent posts */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-6 text-center">
              Most recent
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recent.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="surface-card p-6 block group hover:border-[var(--color-gold-400)]/30 transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] mb-3 inline-block">
                    {p.category}
                  </span>
                  <h3 className="font-display text-lg text-[var(--color-cream)] mb-2 leading-tight group-hover:text-gradient-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed mb-3 line-clamp-3">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-silver-300)]">
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
      </main>
      <Footer />
    </>
  );
}

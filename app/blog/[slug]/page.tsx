import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  BLOG_POSTS,
  getPost,
  getAllPostSlugs,
  POST_CTA_CONFIG,
  type ContentBlock,
} from "@/lib/blog-posts";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

/**
 * Walk the content blocks and pull out any h3 -> p pairs where the h3
 * looks like a question (ends in "?"). Used to derive FAQPage schema
 * automatically without duplicating data. Posts that intentionally
 * have an FAQ section get rich-result eligibility for free.
 */
function extractFaqPairs(
  content: ContentBlock[]
): Array<{ question: string; answer: string }> {
  const pairs: Array<{ question: string; answer: string }> = [];
  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (block.type !== "h3") continue;
    const q = block.text.trim();
    if (!q.endsWith("?")) continue;
    // Find the next paragraph block as the answer.
    for (let j = i + 1; j < content.length; j++) {
      const next = content[j];
      if (next.type === "p" && next.text.trim()) {
        pairs.push({ question: q, answer: next.text.trim() });
        break;
      }
      // Stop scanning if we hit another h2/h3 first
      if (next.type === "h2" || next.type === "h3") break;
    }
  }
  return pairs;
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} - Ocean State Protection Group`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.lastReviewedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p
                key={i}
                className="text-[16px] text-[var(--color-silver-100)] leading-[1.75] mb-5"
              >
                {b.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mt-12 mb-5 leading-tight"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="font-display text-xl text-[var(--color-cream)] mt-8 mb-3 leading-tight"
              >
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2.5 mb-6 ml-1">
                {b.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-[16px] text-[var(--color-silver-100)] leading-[1.7]"
                  >
                    <span className="shrink-0 mt-2.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2.5 mb-6 ml-1">
                {b.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-[16px] text-[var(--color-silver-100)] leading-[1.7]"
                  >
                    <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 text-[12px] font-medium text-[var(--color-gold-400)]">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <div
                key={i}
                className="my-7 p-5 rounded-xl bg-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/25 flex items-start gap-3"
              >
                <AlertCircle
                  className="h-5 w-5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                  strokeWidth={1.7}
                />
                <p className="text-[15px] text-[var(--color-silver-100)] leading-[1.7]">
                  {b.text}
                </p>
              </div>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-7 pl-5 border-l-2 border-[var(--color-gold-400)]/40 italic text-[17px] text-[var(--color-silver-100)] leading-[1.7]"
              >
                {b.text}
              </blockquote>
            );
          case "vignette":
            return (
              <div
                key={i}
                className="my-7 p-6 rounded-xl bg-[var(--color-navy-800)]/60 border border-white/5 relative"
              >
                <p className="absolute -top-2.5 left-5 px-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] bg-[var(--color-navy-700)]">
                  From the field
                </p>
                <p className="text-[15px] text-[var(--color-silver-100)] leading-[1.75] italic">
                  {b.text}
                </p>
              </div>
            );
          case "cta":
            return (
              <div
                key={i}
                className="my-9 p-7 rounded-2xl bg-gradient-to-br from-[var(--color-gold-400)]/10 to-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/30"
              >
                <h4 className="font-display text-xl text-[var(--color-cream)] mb-2 leading-tight">
                  {b.title}
                </h4>
                <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-4">
                  {b.body}
                </p>
                <Link
                  href={b.ctaHref}
                  className="btn-primary !py-2.5 !px-5 !text-sm group"
                >
                  {b.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const ctaConfig = POST_CTA_CONFIG[post.ctaVariant];

  // JSON-LD structured data for SEO. Author is the firm itself, not an
  // individual - articles reflect institutional voice and practice
  // observations, not personal byline.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.lastReviewedAt,
    author: {
      "@type": "Organization",
      name: "Ocean State Protection Group",
      url: "https://oceanstateprotectiongroup.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ocean State Protection Group",
      url: "https://oceanstateprotectiongroup.com",
    },
    keywords: post.tags.join(", "),
  };

  // Find related posts (same category, exclude current)
  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 2);

  // If no same-category related, fall back to most recent other posts
  const moreReading =
    related.length > 0
      ? related
      : BLOG_POSTS.filter((p) => p.slug !== post.slug)
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
          .slice(0, 2);

  const reviewedRecently =
    post.lastReviewedAt && post.lastReviewedAt !== post.publishedAt;

  // Breadcrumb structured data: Home -> Field Notes -> This post.
  // Helps Google render breadcrumbs in SERP and improves entity context.
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: BRAND.url },
    { name: "Field Notes", url: `${BRAND.url}/blog` },
    { name: post.title, url: `${BRAND.url}/blog/${post.slug}` },
  ]);

  // FAQPage structured data: auto-derive from any h3-question + p-answer
  // pairs in the post body. Posts with explicit FAQ sections (e.g. the
  // NSGP grant guide) become eligible for FAQ rich results in SERP.
  const faqPairs = extractFaqPairs(post.content);
  const faqLd =
    faqPairs.length > 0 ? faqPageJsonLd(faqPairs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <Navbar />
      <main>
        {/* Back link */}
        <div className="pt-32 pb-4">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Articles
            </Link>
          </div>
        </div>

        {/* Header */}
        <article>
          <header className="pb-10">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-silver-300)]">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-silver-300)]">
                  <Clock className="h-3 w-3" />
                  {post.readMins} min read
                </span>
                {reviewedRecently && (
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-silver-300)]">
                    <RefreshCw className="h-3 w-3" />
                    Reviewed {formatDate(post.lastReviewedAt)}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] mb-6 leading-[1.08] tracking-tight">
                {post.title}
              </h1>

              <p className="text-[18px] text-[var(--color-silver-100)] leading-relaxed mb-8 border-l-2 border-[var(--color-gold-400)]/40 pl-5 italic">
                {post.description}
              </p>

              <div className="flex items-center gap-3 pb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold-400)]/20 to-[var(--color-gold-600)]/20 border border-[var(--color-gold-400)]/30 flex items-center justify-center">
                  <ShieldCheck
                    className="h-5 w-5 text-[var(--color-gold-400)]"
                    strokeWidth={1.7}
                  />
                </div>
                <div>
                  <p className="text-[13px] text-[var(--color-cream)] font-medium leading-tight">
                    Ocean State Protection Group
                  </p>
                  <p className="text-[11px] text-[var(--color-silver-300)] leading-tight">
                    Security Consulting Practice
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
              <ContentRenderer blocks={post.content} />
            </div>
          </div>

          {/* Universal author/credentials credit + disclaimer footer */}
          <div className="pb-10">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
              <div className="surface-card p-6 mb-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck
                    className="h-5 w-5 text-[var(--color-gold-400)]"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2 font-medium">
                    About Ocean State Protection Group
                  </p>
                  <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed">
                    Ocean State Protection Group is a Rhode Island private
                    security consultancy founded by active-duty law enforcement
                    officers. The firm draws on over 75 years of combined law
                    enforcement and military experience across the founding
                    team, including SRT operations, FLETC Active-Shooter
                    Instructor certifications, and Tactical Combat Casualty
                    Care instruction. Both founders attend every initial
                    walkthrough.
                  </p>
                </div>
              </div>

              <div className="surface-card p-6 border-l-2 border-[var(--color-gold-400)]/40">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-3 font-medium">
                  Important Notice
                </p>
                <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed mb-3">
                  Articles on this site reflect operational observations from
                  active-duty law enforcement officers in private security
                  consulting practice. They are general guidance for
                  educational purposes. They are not legal, engineering,
                  insurance, financial, or licensed professional advice.
                  On-site assessment by qualified professionals is required for
                  site-specific recommendations.
                </p>
                <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed mb-3">
                  Cost ranges, vendor names, regulatory references, and grant
                  cycle details are provided as practical context and may
                  change without notice. Always verify current details with the
                  relevant authority (FEMA, RIEMA, your insurance broker, your
                  legal counsel) before relying on any specific number or
                  procedure for your organization.
                </p>
                <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed">
                  Ocean State Protection Group is not a licensed alarm or
                  monitoring company, a guard agency, a licensed engineering
                  firm, or a licensed insurance brokerage unless explicitly
                  contracted in a separate signed engagement.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Tags */}
        <section className="pb-12">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-silver-300)] mr-1">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-[var(--color-silver-200)] px-2.5 py-1 rounded-full border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        {moreReading.length > 0 && (
          <section className="py-12 bg-[var(--color-navy-800)]/40">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-6">
                More from the practice
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {moreReading.map((p) => (
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
                    <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed mb-3 line-clamp-2">
                      {p.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-gold-400)] font-medium">
                      Read article
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA - variant-specific */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
              {ctaConfig.heading}
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10 max-w-2xl mx-auto leading-relaxed">
              {ctaConfig.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ctaConfig.primaryHref} className="btn-primary">
                {ctaConfig.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {ctaConfig.secondaryLabel && ctaConfig.secondaryHref && (
                <Link
                  href={ctaConfig.secondaryHref}
                  className="btn-secondary"
                >
                  {ctaConfig.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

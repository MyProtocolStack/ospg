import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  BLOG_POSTS,
  getPost,
  getAllPostSlugs,
  type ContentBlock,
} from "@/lib/blog-posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

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
              <ol key={i} className="space-y-2.5 mb-6 ml-1 counter-reset">
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

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <div className="flex items-center gap-3 mb-5">
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
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-cream)] mb-6 leading-[1.08] tracking-tight">
                {post.title}
              </h1>

              <p className="text-[18px] text-[var(--color-silver-100)] leading-relaxed mb-8 border-l-2 border-[var(--color-gold-400)]/40 pl-5 italic">
                {post.description}
              </p>

              <div className="flex items-center gap-3 pb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold-400)]/20 to-[var(--color-gold-600)]/20 border border-[var(--color-gold-400)]/30 flex items-center justify-center">
                  <span className="font-display text-sm text-[var(--color-gold-400)]">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] text-[var(--color-cream)] font-medium leading-tight">
                    {post.author}
                  </p>
                  <p className="text-[11px] text-[var(--color-silver-300)] leading-tight">
                    Ocean State Protection Group, Co-Founder
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="pb-20">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
              <ContentRenderer blocks={post.content} />
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
        {related.length > 0 && (
          <section className="py-12 bg-[var(--color-navy-800)]/40">
            <div className="mx-auto max-w-5xl px-6 lg:px-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-6">
                More from {post.category}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="surface-card p-6 block group hover:border-[var(--color-gold-400)]/30 transition-colors"
                  >
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

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4">
              Want this kind of analysis on your campus?
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              We walk schools, parishes, and high-net-worth properties. Both
              founders attend every initial walkthrough. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/walkthrough" className="btn-primary">
                Book Free Walkthrough
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shield-ai" className="btn-secondary">
                Try SHIELD AI
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { COURSES } from "@/lib/courses";
import { VERTICALS } from "@/lib/verticals";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/founders",
    "/contact",
    "/walkthrough",
    "/services",
    "/services/security-detail",
    "/pricing",
    "/upgrade",
    "/courses",
    "/praesidium",
    "/blog",
    "/press",
    "/login",
    "/signup",
    "/legal/privacy",
    "/legal/terms",
    "/legal/disclaimer",
    "/legal/scope-of-services",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const blog = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    // Prefer lastReviewedAt over publishedAt - that is the freshness
    // signal Google actually uses to decide whether to re-crawl.
    lastModified: new Date(p.lastReviewedAt || p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const verticals = VERTICALS.map((v) => ({
    url: `${base}/verticals/${v.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const courses = COURSES.flatMap((c) => [
    {
      url: `${base}/courses/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...c.lessons.map((l) => ({
      url: `${base}/courses/${c.slug}/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]);

  return [...staticRoutes, ...verticals, ...courses, ...blog];
}

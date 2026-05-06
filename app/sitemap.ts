import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { COURSES } from "@/lib/courses";
import { VERTICALS } from "@/lib/verticals";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BRAND.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/founders",
    "/contact",
    "/walkthrough",
    "/courses",
    "/shield-ai",
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

  return [...staticRoutes, ...verticals, ...courses];
}

/**
 * Schema.org JSON-LD generators.
 *
 * Used by the root layout (Organization + LocalBusiness) and
 * page-specific components (Article on blog posts, FAQPage on
 * posts with FAQ sections, BreadcrumbList, etc.).
 *
 * Schema.org markup is the canonical way to tell Google the site
 * represents a real entity. Helps with Knowledge Graph eligibility,
 * rich results, and AI-search citation. Free, low-risk, compounds
 * over time.
 */
import { BRAND } from "@/lib/brand";

/**
 * Organization + LocalBusiness combined schema for OSPG.
 * Render once in the root layout so every page has it.
 *
 * Combines Organization (entity identity) with LocalBusiness
 * (geo-targeted, shows up in local-pack and "near me" queries).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${BRAND.url}/#organization`,
    name: BRAND.name,
    alternateName: BRAND.abbr,
    url: BRAND.url,
    logo: `${BRAND.url}/brand/icon-512.png`,
    image: `${BRAND.url}/og-image.png`,
    description: BRAND.description,
    email: BRAND.email,
    telephone: BRAND.phone,
    address: {
      "@type": "PostalAddress",
      addressRegion: "RI",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "State", name: "Rhode Island" },
      { "@type": "State", name: "Massachusetts" },
      { "@type": "State", name: "Connecticut" },
      { "@type": "State", name: "New Hampshire" },
      { "@type": "State", name: "Vermont" },
      { "@type": "State", name: "Maine" },
    ],
    knowsAbout: [
      "Physical security assessment",
      "FEMA Nonprofit Security Grant Program",
      "School safety",
      "Active threat response training",
      "CPTED (Crime Prevention Through Environmental Design)",
      "Vulnerability assessment",
      "Catholic school security",
      "Parish security",
      "Houses of worship security",
    ],
    founder: BRAND.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.title,
      worksFor: {
        "@id": `${BRAND.url}/#organization`,
      },
    })),
    sameAs: [
      // Add LinkedIn / X / press URLs here as they come online.
    ],
    priceRange: "$$$",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BRAND.phone,
      email: BRAND.email,
      contactType: "Sales",
      availableLanguage: "en",
      areaServed: "US",
    },
  };
}

/**
 * Generate FAQPage schema from a list of question/answer pairs.
 * Use for blog posts that have explicit FAQ sections - Google often
 * shows these as expandable rich results in SERP.
 */
export function faqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList for blog posts and other nested pages.
 * `items` is ordered from root -> current page.
 */
export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * WebSite schema with SearchAction. Helps Google show a sitelinks
 * search box on the brand-name SERP. Render in root layout.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BRAND.url}/#website`,
    url: BRAND.url,
    name: BRAND.name,
    description: BRAND.description,
    publisher: {
      "@id": `${BRAND.url}/#organization`,
    },
    inLanguage: "en-US",
  };
}

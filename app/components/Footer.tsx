import Link from "next/link";
import { Shield } from "lucide-react";
import { BRAND } from "@/lib/brand";

const FOOTER_GROUPS = [
  {
    label: "Services",
    links: [
      { href: "/services", label: "All Services" },
      { href: "/walkthrough", label: "SHIELD™ Assessment" },
      { href: "/services/security-detail", label: "Security Detail" },
      { href: "/shield-ai", label: "SHIELD AI Photo Analysis" },
      { href: "/grants", label: "FEMA NSGP Grant Help" },
      { href: "/courses", label: "Training Courses" },
    ],
  },
  {
    label: "Verticals",
    links: BRAND.verticals.map((v) => ({
      href: `/verticals/${v.slug}`,
      label: v.title,
    })),
  },
  {
    label: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/founders", label: "Founders" },
      { href: "/pricing", label: "Pricing" },
      { href: "/blog", label: "Threat Intelligence" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
      { href: "/legal/scope-of-services", label: "Scope of Services" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[var(--color-navy-800)]">
      {/* Top decorative gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand block */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <Shield
                className="h-7 w-7 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base text-[var(--color-cream)]">
                  {BRAND.shortName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
                  Protection Group
                </span>
              </div>
            </Link>
            <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed mb-6 max-w-sm">
              {BRAND.tagline}
            </p>
            <p className="text-[13px] text-[var(--color-silver-300)] leading-relaxed max-w-sm">
              Headquartered in Rhode Island. Serving New England and growing.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.label}>
              <h4 className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4 font-medium">
                {group.label}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--color-silver-200)] hover:text-[var(--color-cream)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer block */}
        <div className="surface-card p-6 mb-10 max-w-4xl">
          <h5 className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            Important Notice
          </h5>
          <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed mb-3">
            {BRAND.legal.notMedicalOrLegalAdvice}
          </p>
          <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed">
            {BRAND.legal.notMonitoring}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-[12px] text-[var(--color-silver-300)]">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[12px] text-[var(--color-silver-300)]">
              {BRAND.subsidiary.name} ({BRAND.subsidiary.abbr}) is the {BRAND.subsidiary.state} operating subsidiary.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

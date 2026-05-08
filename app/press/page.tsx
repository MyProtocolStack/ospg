import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import {
  Mic,
  Newspaper,
  Mail,
  Download,
  ShieldCheck,
  Quote,
  ArrowRight,
} from "lucide-react";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Press & Media - Ocean State Protection Group",
  description:
    "Press resources, founder bios, downloadable assets, and inquiry contact for journalists covering school safety, faith-based security, FEMA NSGP, or Catholic-school threat preparedness in New England.",
};

const PRESS_TOPICS = [
  {
    icon: ShieldCheck,
    title: "School + parish security in New England",
    body: "OSPG founders walk Catholic schools, parishes, and private K-12 campuses across Rhode Island, southeastern Massachusetts, and northern Connecticut. Available for commentary on regional patterns, school-specific vulnerability classes, and FEMA grant cycles.",
  },
  {
    icon: Newspaper,
    title: "FEMA Nonprofit Security Grant Program (NSGP)",
    body: "Up to $200K per site is available federally for qualifying 501(c)(3) faith-based and educational nonprofits. We can speak to application strategy, scoring criteria, and the gap between awarded and unfunded applications in RI / NE.",
  },
  {
    icon: Mic,
    title: "Active-duty perspective on private security",
    body: "OSPG is co-founded by two active-duty Cranston Police Department officers. We hold a clear view on the boundary between consulting work (allowed) and private security details (staffed exclusively by retired LE / military veterans through our network).",
  },
];

const FOUNDER_TOPIC_AREAS = [
  "Catholic school + parish vulnerability assessments",
  "FEMA NSGP grant strategy and threat-narrative drafting",
  "Active threat / active shooter response training (FLETC-aligned)",
  "Tactical Combat Casualty Care (TCCC) for school staff",
  "Student reunification planning (RIEMA-certified)",
  "CPTED principles applied to faith-based institutions",
  "Diocesan-wide multi-site security strategy",
  "The retired-LE / military-veteran detail-staffing model",
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Newspaper
                className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Press &amp; Media
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              For journalists, podcasters,{" "}
              <span className="italic text-gradient-gold">and producers.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              Ocean State Protection Group is available for commentary,
              interviews, and on-the-record analysis on physical security,
              school safety, faith-based institutional risk, FEMA NSGP grant
              policy, and the active-duty / retired LE staffing boundary in
              private security work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <a
                href={`mailto:${BRAND.email}?subject=Press%20Inquiry`}
                className="btn-primary"
              >
                <Mail className="h-4 w-4" />
                Press Inquiry
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/founders" className="btn-secondary">
                Founder Bios
              </Link>
            </div>
          </div>
        </section>

        {/* Press topics we cover */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                On-The-Record Topics
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                Where we can credibly comment.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRESS_TOPICS.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.title} className="surface-card p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-4">
                      <Icon
                        className="h-5 w-5 text-[var(--color-gold-400)]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-display text-lg text-[var(--color-cream)] mb-2 leading-tight">
                      {t.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Founder availability */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Founders Available
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                Direct interviews with the operators.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {BRAND.founders.map((f) => (
                <div key={f.name} className="surface-card-elevated p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-2 font-medium">
                    {f.role}
                  </p>
                  <h3 className="font-display text-2xl text-[var(--color-cream)] mb-2 leading-tight">
                    {f.name}
                  </h3>
                  <p className="text-[12px] text-[var(--color-silver-300)] mb-4 italic">
                    {f.title}
                  </p>
                  <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed mb-4">
                    {f.bio}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2">
                    Selected credentials
                  </p>
                  <ul className="space-y-1.5">
                    {f.credentials.slice(0, 4).map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[12px] text-[var(--color-silver-200)] leading-relaxed"
                      >
                        <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="surface-card p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-3 font-medium">
                Topic Areas For Interviews
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                {FOUNDER_TOPIC_AREAS.map((t) => (
                  <div
                    key={t}
                    className="flex items-start gap-2 text-[13px] text-[var(--color-silver-100)] leading-relaxed"
                  >
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[var(--color-gold-400)]" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Boilerplate */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="text-center mb-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Standard Boilerplate
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                For your byline or end of article.
              </h2>
            </div>
            <div className="surface-card p-7 relative">
              <Quote
                className="absolute top-5 left-5 h-5 w-5 text-[var(--color-gold-400)]/40"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed pl-7 italic">
                {BRAND.description}
              </p>
              <p className="text-[12px] text-[var(--color-silver-300)] mt-4 pl-7">
                Founded by Ryan Moriarty and Sergeant Dennis Trinh, both
                active-duty Cranston Police Department officers with combined
                75+ years of law enforcement and military experience.
                Headquartered in Rhode Island.
              </p>
            </div>
          </div>
        </section>

        {/* Brand assets */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="text-center mb-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Brand Assets
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                Logos, marks, and imagery.
              </h2>
              <p className="text-[14px] text-[var(--color-silver-200)] mt-4 max-w-xl mx-auto leading-relaxed">
                Use the assets below in editorial coverage. For founder
                headshots or custom imagery, email{" "}
                <span className="text-[var(--color-gold-400)]">
                  {BRAND.email}
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="surface-card p-6">
                <div className="aspect-[3/2] rounded-lg bg-[var(--color-navy-800)] border border-white/5 flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/icon-512.png"
                    alt="OSPG primary mark"
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <h3 className="font-display text-base text-[var(--color-cream)] mb-1">
                  Primary mark (PNG, 512x512)
                </h3>
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed mb-3">
                  For dark backgrounds. Gold + navy.
                </p>
                <a
                  href="/brand/icon-512.png"
                  download
                  className="inline-flex items-center gap-2 text-[12px] text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PNG
                </a>
              </div>

              <div className="surface-card p-6">
                <div className="aspect-[3/2] rounded-lg bg-[var(--color-navy-800)] border border-white/5 flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/og-image.png"
                    alt="OSPG share card"
                    className="max-h-32 object-contain"
                  />
                </div>
                <h3 className="font-display text-base text-[var(--color-cream)] mb-1">
                  Share card (PNG, 1200x630)
                </h3>
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed mb-3">
                  Default OG image. Use as cover art for podcast or video
                  embeds where applicable.
                </p>
                <a
                  href="/og-image.png"
                  download
                  className="inline-flex items-center gap-2 text-[12px] text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PNG
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
              Press inquiries
            </h2>
            <p className="text-[var(--color-silver-200)] mb-8 leading-relaxed">
              Email us with deadline, outlet, story angle, and the format
              (written, on-camera, audio). We respond inside 24 hours for
              same-week deadlines, sooner if breaking.
            </p>
            <div className="surface-card p-6 mb-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)] mb-2">
                Direct line for press
              </p>
              <p className="text-[16px] text-[var(--color-cream)] mb-1">
                <a
                  href={`mailto:${BRAND.email}?subject=Press%20Inquiry`}
                  className="text-[var(--color-gold-400)] hover:text-[var(--color-gold-300)]"
                >
                  {BRAND.email}
                </a>
              </p>
              <p className="text-[14px] text-[var(--color-silver-200)]">
                {BRAND.phone}
              </p>
            </div>
            <p className="text-[11px] text-[var(--color-silver-400)] leading-relaxed max-w-md mx-auto">
              OSPG is a private-sector consulting practice. Founders speak in
              their consulting capacity and are not commenting on behalf of
              any law-enforcement agency.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

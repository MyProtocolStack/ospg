import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PraesidiumDemoClient } from "./demo-client";
import {
  Camera,
  Layers3,
  FileText,
  Sparkles,
  AlertTriangle,
  Shield,
  Zap,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "PRAESIDIUM - Photo-Based Vulnerability Analysis",
  description:
    "Upload a photo of any campus location. Get an expert-grade security vulnerability assessment in 90 seconds. Built on 75+ years of combined law enforcement and military experience.",
};

export default function PraesidiumPublicPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient grain pt-36 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 surface-card border-glow-gold mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold-400)]" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-100)] font-medium">
                Run PRAESIDIUM Now
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Try{" "}
              <span className="italic text-gradient-gold">PRAESIDIUM</span>{" "}
              right now.
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed mb-8">
              Three real example analyses below. Tap any photo to see the
              full vulnerability report PRAESIDIUM produced - same output your
              insurer and grant administrator receive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="#examples" className="btn-primary group">
                See Live Examples
                <Zap className="h-4 w-4" />
              </Link>
              <Link href="/signup" className="btn-secondary">
                Try With Your Photo
                <Camera className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Hero showcase: sample analysis output. Uses the same bbox-on-
            gradient style as the live demo below, but rendered as a static
            marketing visual with a finding callout card. Breaks up the
            text-heavy hero region and shows the actual product output
            shape before the visitor reaches the interactive demo. */}
        <section className="py-12 -mt-8 relative">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              {/* Left column: simulated annotated photo */}
              <div className="lg:col-span-3">
                <div className="relative">
                  {/* Decorative gold halo */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-gold-400)]/15 via-transparent to-[var(--color-navy-300)]/10 blur-2xl pointer-events-none" />

                  <div className="surface-card-elevated p-3 relative">
                    <div
                      className="aspect-[4/3] rounded-lg relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #1a3a5c 0%, #0f2742 50%, #060e1b 100%)",
                      }}
                    >
                      {/* Subtle texture */}
                      <div className="absolute inset-0 opacity-30 grain pointer-events-none" />

                      {/* Sample bbox annotations */}
                      {[
                        { x: 0.08, y: 0.12, w: 0.32, h: 0.55, n: 1, sev: "medium" },
                        { x: 0.62, y: 0.22, w: 0.28, h: 0.38, n: 2, sev: "high" },
                        { x: 0.36, y: 0.55, w: 0.2, h: 0.3, n: 3, sev: "medium" },
                      ].map((b) => {
                        const colors = {
                          medium: "#C9A961",
                          high: "#E59A3A",
                        } as const;
                        const c = colors[b.sev as keyof typeof colors];
                        return (
                          <div
                            key={b.n}
                            className="absolute border-2 rounded-md"
                            style={{
                              left: `${b.x * 100}%`,
                              top: `${b.y * 100}%`,
                              width: `${b.w * 100}%`,
                              height: `${b.h * 100}%`,
                              borderColor: c,
                              boxShadow: `0 0 0 1px ${c}40, 0 0 30px -5px ${c}`,
                            }}
                          >
                            <span
                              className="absolute -top-3 -left-3 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                              style={{
                                color: c,
                                backgroundColor: "var(--color-navy-700)",
                                borderColor: c,
                              }}
                            >
                              {b.n}
                            </span>
                          </div>
                        );
                      })}

                      {/* Photo metadata bottom strip */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-silver-300)]">
                        <MapPin className="h-3 w-3" />
                        <span>sample_side_entrance.jpg</span>
                      </div>

                      {/* Severity badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                          style={{
                            color: "#E59A3A",
                            backgroundColor: "rgba(229, 154, 58, 0.12)",
                            border: "1px solid rgba(229, 154, 58, 0.4)",
                          }}
                        >
                          Overall: HIGH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-400)]">
                    Sample analysis output - bounding boxes auto-placed by AI
                  </p>
                </div>
              </div>

              {/* Right column: finding callouts */}
              <div className="lg:col-span-2 space-y-3">
                <div className="surface-card p-5 relative">
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                      style={{
                        color: "#E59A3A",
                        backgroundColor: "rgba(229, 154, 58, 0.12)",
                        borderColor: "#E59A3A",
                      }}
                    >
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold inline-block mb-1"
                        style={{ color: "#E59A3A" }}
                      >
                        HIGH
                      </span>
                      <h4 className="font-display text-[14px] text-[var(--color-cream)] leading-tight mb-1">
                        No camera coverage on this approach
                      </h4>
                      <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed">
                        Path from parking lot to side door has no surveillance.
                        After-hours unauthorized-entry vector.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="surface-card p-5 relative">
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                      style={{
                        color: "#C9A961",
                        backgroundColor: "rgba(201, 169, 97, 0.12)",
                        borderColor: "#C9A961",
                      }}
                    >
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold inline-block mb-1"
                        style={{ color: "#C9A961" }}
                      >
                        MEDIUM
                      </span>
                      <h4 className="font-display text-[14px] text-[var(--color-cream)] leading-tight mb-1">
                        Glass door without shatter-resistant film
                      </h4>
                      <p className="text-[12px] text-[var(--color-silver-200)] leading-relaxed">
                        Single-pane glass within reach of interior lock.
                        Breach time under 8 seconds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1 pt-1 text-[12px] text-[var(--color-silver-300)]">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-[var(--color-gold-400)]"
                    strokeWidth={2}
                  />
                  <span>+1 more finding (LOW) | Cost ranges | NSGP eligibility</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Camera,
                  step: "1",
                  title: "Upload",
                  body: "Snap a photo with your phone. Side entrance, classroom door, fenceline, parking lot - anything.",
                },
                {
                  icon: Layers3,
                  step: "2",
                  title: "Analyze",
                  body: "PRAESIDIUM evaluates 40+ security markers: lockdown capability, sightlines, hardening, lighting, access control.",
                },
                {
                  icon: FileText,
                  step: "3",
                  title: "Receive",
                  body: "Detailed text assessment, annotated photo with severity-tagged findings, downloadable PDF report.",
                },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="surface-card p-7 relative">
                    <span className="absolute top-4 right-5 font-display text-5xl text-[var(--color-gold-400)]/20 leading-none">
                      {s.step}
                    </span>
                    <Icon className="h-7 w-7 text-[var(--color-gold-400)] mb-4 relative" strokeWidth={1.3} />
                    <h3 className="font-display text-xl text-[var(--color-cream)] mb-2 relative">{s.title}</h3>
                    <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed relative">{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live demo with cached examples */}
        <section id="examples" className="py-20 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                Real Output, No Signup
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--color-cream)] leading-tight">
                See exactly what{" "}
                <span className="italic text-gradient-gold">your team</span>{" "}
                will receive.
              </h2>
            </div>

            <PraesidiumDemoClient />
          </div>
        </section>

        {/* What gets evaluated */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
                40+ Markers Per Photo
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] leading-tight">
                What PRAESIDIUM looks for.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Entry hardening", "Door type, locks, hinges, vestibules, mantrap potential"],
                ["Glazing", "Shatter-resistant film, ballistic glass, window proximity to locks"],
                ["Camera coverage", "Visible/hidden gaps, sightlines, angle blind spots"],
                ["Lighting", "Glare zones, dark corners, dawn/dusk visibility"],
                ["Access control", "Key cards, intercoms, visitor management, after-hours protocols"],
                ["Lockdown capability", "Door barricades, classroom locks, panic hardware"],
                ["Sightlines", "Concealment opportunities for an attacker, surveillance opportunity for staff"],
                ["Landscaping (CPTED)", "Crime prevention through environmental design"],
                ["Approach corridors", "Chokepoints, vehicle barriers, pedestrian flow"],
                ["Crowd-flow / event-day", "Different threat profile during peak attendance"],
                ["Communication infrastructure", "Signal coverage, intercom reach"],
                ["Emergency egress", "Path geometry, capacity, signage, lighting"],
              ].map(([label, body], i) => (
                <div key={i} className="surface-card p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-1" strokeWidth={1.5} />
                    <div>
                      <h4 className="text-[14px] text-[var(--color-cream)] font-medium mb-1">{label}</h4>
                      <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Limitations / honesty */}
        <section className="py-16 bg-[var(--color-navy-800)]/40">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="surface-card p-8">
              <AlertTriangle className="h-6 w-6 text-[var(--color-gold-400)] mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-[var(--color-cream)] mb-3">
                The honest version
              </h3>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-3">
                PRAESIDIUM is a preliminary analysis tool. It catches what is
                visible in a photo. It cannot replace an on-site walkthrough
                where two officers physically test doors, observe operational
                flow, and interview staff.
              </p>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                Treat PRAESIDIUM output as the starting list. The full SHIELD
                Assessment validates findings, surfaces what photos miss
                (procedure gaps, communication trees, drill cadence), and
                produces the document insurers and FEMA actually require.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
              Ready to try it on your campus?
            </h2>
            <p className="text-[var(--color-silver-200)] mb-10">
              Free account includes your first PRAESIDIUM analysis. No credit
              card. No commitment. 90 seconds from signup to first finding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary">
                Create Free Account
                <Sparkles className="h-4 w-4" />
              </Link>
              <Link href="/walkthrough" className="btn-secondary">
                Or Book a Free Walkthrough
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

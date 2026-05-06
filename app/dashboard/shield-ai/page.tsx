import Link from "next/link";
import { Camera, ArrowRight, Sparkles, Shield } from "lucide-react";

export const metadata = { title: "SHIELD AI" };

export default function ShieldAIIndex() {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
              SHIELD AI
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
              Photo-based{" "}
              <span className="italic text-gradient-gold">vulnerability analysis</span>
            </h1>
            <p className="text-[var(--color-silver-200)] max-w-2xl">
              Upload a photo of any property location. Get an expert-grade
              security assessment with prioritized findings, annotated overlay,
              and a downloadable PDF report.
            </p>
          </div>
          <Link href="/dashboard/shield-ai/new" className="btn-primary shrink-0">
            <Camera className="h-4 w-4" />
            New Analysis
          </Link>
        </div>

        {/* Empty state */}
        <div className="surface-card-elevated p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-400)]/8 blur-[100px] pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-6">
              <Shield
                className="h-8 w-8 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-4">
              No assessments yet.
            </h2>
            <p className="text-[var(--color-silver-200)] mb-8 max-w-md mx-auto">
              Run your first analysis. Pick a location on your campus that
              concerns you. Side entrance, sanctuary door, parking lot — anywhere
              your gut says &quot;maybe.&quot;
            </p>
            <Link href="/dashboard/shield-ai/new" className="btn-primary">
              Start First Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-[var(--color-silver-300)]">
              <Sparkles className="h-3 w-3" />
              <span>First analysis is free with every account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

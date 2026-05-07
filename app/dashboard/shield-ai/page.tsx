import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Shield,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FREE_ANALYSIS_LIMIT } from "@/lib/shield-ai-quota";

export const metadata = { title: "SHIELD AI" };
export const dynamic = "force-dynamic";

type Severity = "low" | "medium" | "high" | "critical";

const SEVERITY_STYLES: Record<
  Severity,
  { color: string; bg: string; border: string; label: string }
> = {
  low: {
    color: "#A0C7E5",
    bg: "rgba(160, 199, 229, 0.1)",
    border: "rgba(160, 199, 229, 0.4)",
    label: "LOW",
  },
  medium: {
    color: "#C9A961",
    bg: "rgba(201, 169, 97, 0.12)",
    border: "rgba(201, 169, 97, 0.4)",
    label: "MEDIUM",
  },
  high: {
    color: "#E59A3A",
    bg: "rgba(229, 154, 58, 0.12)",
    border: "rgba(229, 154, 58, 0.4)",
    label: "HIGH",
  },
  critical: {
    color: "#B33A3A",
    bg: "rgba(179, 58, 58, 0.12)",
    border: "rgba(179, 58, 58, 0.4)",
    label: "CRITICAL",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ShieldAIIndex() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/shield-ai");

  // Pull all assessments visible to this user (RLS scopes by org membership).
  const { data: assessments } = await supabase
    .from("assessments")
    .select(
      "id, title, area_label, summary, overall_severity, status, created_at, completed_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const list = assessments ?? [];
  const completedCount = list.filter((a) => a.status === "complete").length;
  const remainingFree = Math.max(FREE_ANALYSIS_LIMIT - completedCount, 0);
  const quotaExhausted = completedCount >= FREE_ANALYSIS_LIMIT;

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)]">
                SHIELD AI
              </p>
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                  quotaExhausted
                    ? "text-[var(--color-silver-300)] bg-white/5 border-white/10"
                    : "text-[var(--color-gold-400)] bg-[var(--color-gold-400)]/10 border-[var(--color-gold-400)]/30"
                }`}
              >
                {quotaExhausted
                  ? `Free quota used (${completedCount}/${FREE_ANALYSIS_LIMIT})`
                  : `${remainingFree} of ${FREE_ANALYSIS_LIMIT} free analyses remaining`}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
              Photo-based{" "}
              <span className="italic text-gradient-gold">
                vulnerability analysis
              </span>
            </h1>
            <p className="text-[var(--color-silver-200)] max-w-2xl">
              Upload a photo of any property location. Get an expert-grade
              security assessment with prioritized findings, annotated overlay,
              and a downloadable PDF report.
            </p>
          </div>
          {quotaExhausted ? (
            <Link
              href="/walkthrough"
              className="btn-primary shrink-0"
            >
              <Calendar className="h-4 w-4" />
              Book Walkthrough
            </Link>
          ) : (
            <Link
              href="/dashboard/shield-ai/new"
              className="btn-primary shrink-0"
            >
              <Camera className="h-4 w-4" />
              New Analysis
            </Link>
          )}
        </div>

        {/* Quota-exhausted banner */}
        {quotaExhausted && (
          <div className="surface-card-elevated p-6 lg:p-7 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--color-gold-400)]/8 blur-[80px] pointer-events-none" />
            <div className="relative grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Sparkles
                    className="h-4 w-4 text-[var(--color-gold-400)]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium">
                    Ready for the next step
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl text-[var(--color-cream)] mb-2 leading-tight">
                  You&apos;ve seen what SHIELD AI can do.
                </h2>
                <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                  The next step is a real walkthrough by both founders -
                  free for first-time clients, written report within 7 days,
                  insurance- and grant-ready format.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Link href="/walkthrough" className="btn-primary">
                  Book Free Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {list.length === 0 ? (
          /* Empty state */
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
                concerns you. Side entrance, sanctuary door, parking lot -
                anywhere your gut says &quot;maybe.&quot;
              </p>
              <Link
                href="/dashboard/shield-ai/new"
                className="btn-primary"
              >
                Start First Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-[var(--color-silver-300)]">
                <Sparkles className="h-3 w-3" />
                <span>First analysis is free with every account</span>
              </div>
            </div>
          </div>
        ) : (
          /* Assessment list */
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-300)]">
                {list.length} assessment{list.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="space-y-3">
              {list.map((a) => {
                const sev = (a.overall_severity ?? "low") as Severity;
                const style = SEVERITY_STYLES[sev];
                return (
                  <Link
                    key={a.id}
                    href={`/dashboard/shield-ai/${a.id}`}
                    className="surface-card p-6 block hover:border-[var(--color-gold-400)]/30 transition-colors group"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: style.bg,
                          border: `1px solid ${style.border}`,
                        }}
                      >
                        <Shield
                          className="h-5 w-5"
                          style={{ color: style.color }}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-display text-lg text-[var(--color-cream)] leading-tight group-hover:text-gradient-gold transition-colors">
                            {a.title || a.area_label || "Untitled assessment"}
                          </h3>
                          <span
                            className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                            style={{
                              color: style.color,
                              backgroundColor: style.bg,
                              border: `1px solid ${style.border}`,
                            }}
                          >
                            {style.label}
                          </span>
                          {a.status && a.status !== "complete" && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--color-silver-300)] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {a.status}
                            </span>
                          )}
                        </div>
                        {a.summary && (
                          <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed line-clamp-2 mb-2">
                            {a.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-[11px] text-[var(--color-silver-300)]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(a.completed_at ?? a.created_at)}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className="h-5 w-5 text-[var(--color-silver-400)] shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

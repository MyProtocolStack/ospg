import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Calendar,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Assessment Detail" };
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

function formatDateLong(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/dashboard/vigil/${id}`);

  // RLS will scope the row to assessments in the user's orgs.
  const { data: assessment } = await supabase
    .from("assessments")
    .select(
      "id, org_id, title, area_label, summary, overall_severity, status, model, created_at, completed_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (!assessment) notFound();

  // Photo (one per assessment in current schema)
  const { data: photo } = await supabase
    .from("assessment_photos")
    .select("id, storage_path, filename")
    .eq("assessment_id", id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Generate a fresh signed URL each load - signed URLs expire and we want
  // a recent one for the detail view.
  let signedUrl: string | null = null;
  if (photo?.storage_path) {
    const { data: signed } = await supabase.storage
      .from("assessment-photos")
      .createSignedUrl(photo.storage_path, 60 * 60); // 1 hour
    signedUrl = signed?.signedUrl ?? null;
  }

  // Findings
  const { data: findings } = await supabase
    .from("assessment_findings")
    .select(
      "id, finding_number, severity, title, description, recommendation, bbox_x, bbox_y, bbox_w, bbox_h, est_cost_low, est_cost_high"
    )
    .eq("assessment_id", id)
    .order("finding_number", { ascending: true });

  const findingsList = findings ?? [];
  const overallSev = (assessment.overall_severity ?? "low") as Severity;
  const overallStyle = SEVERITY_STYLES[overallSev];

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard/vigil"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Assessments
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] font-medium">
              {assessment.area_label || "Assessment"}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
              style={{
                color: overallStyle.color,
                backgroundColor: overallStyle.bg,
                border: `1px solid ${overallStyle.border}`,
              }}
            >
              Overall: {overallStyle.label}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-3 leading-tight">
            {assessment.title || "Untitled assessment"}
          </h1>
          <div className="flex items-center gap-4 text-[12px] text-[var(--color-silver-300)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDateLong(
                assessment.completed_at ?? assessment.created_at
              )}
            </span>
            {assessment.model && (
              <span className="text-[var(--color-silver-400)]">
                Model: {assessment.model}
              </span>
            )}
          </div>
        </div>

        {/* Summary card */}
        {assessment.summary && (
          <div className="surface-card-elevated p-6 lg:p-8 mb-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-3 font-medium">
              Executive Summary
            </p>
            <p className="text-[15px] text-[var(--color-silver-100)] leading-relaxed">
              {assessment.summary}
            </p>
          </div>
        )}

        {/* Photo with annotations */}
        <div className="surface-card p-2 mb-6 relative">
          <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-[var(--color-navy-800)]">
            {signedUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedUrl}
                  alt={assessment.area_label || "Assessment photo"}
                  className="w-full h-full object-cover"
                />
                {findingsList.map((f) => {
                  if (
                    f.bbox_x === null ||
                    f.bbox_y === null ||
                    f.bbox_w === null ||
                    f.bbox_h === null
                  ) {
                    return null;
                  }
                  const sev = (f.severity ?? "low") as Severity;
                  const style = SEVERITY_STYLES[sev];
                  return (
                    <div
                      key={f.id}
                      className="absolute"
                      style={{
                        left: `${Number(f.bbox_x) * 100}%`,
                        top: `${Number(f.bbox_y) * 100}%`,
                        width: `${Number(f.bbox_w) * 100}%`,
                        height: `${Number(f.bbox_h) * 100}%`,
                        border: `2px solid ${style.color}`,
                        boxShadow: `0 0 0 1px ${style.border}, 0 0 30px -5px ${style.color}`,
                      }}
                    >
                      <span
                        className="absolute -top-3 -left-3 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                        style={{
                          color: style.color,
                          backgroundColor: "var(--color-navy-700)",
                          borderColor: style.color,
                        }}
                      >
                        {f.finding_number}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-silver-400)]">
                <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                <p className="text-[13px]">
                  Photo not available (may have expired or failed to upload)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Findings list */}
        <h2 className="font-display text-2xl text-[var(--color-cream)] mb-4">
          Findings ({findingsList.length})
        </h2>
        {findingsList.length === 0 ? (
          <div className="surface-card p-6 flex items-start gap-3">
            <AlertCircle
              className="h-5 w-5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <p className="text-[14px] text-[var(--color-silver-100)]">
              No findings recorded for this assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {findingsList.map((f) => {
              const sev = (f.severity ?? "low") as Severity;
              const style = SEVERITY_STYLES[sev];
              const cost =
                f.est_cost_low !== null || f.est_cost_high !== null
                  ? f.est_cost_low === f.est_cost_high
                    ? `$${(f.est_cost_low ?? 0).toLocaleString()}`
                    : `$${(f.est_cost_low ?? 0).toLocaleString()} – $${(
                        f.est_cost_high ?? 0
                      ).toLocaleString()}`
                  : null;
              return (
                <div key={f.id} className="surface-card p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className="shrink-0 w-9 h-9 rounded-full font-bold text-[14px] flex items-center justify-center border-2"
                      style={{
                        color: style.color,
                        backgroundColor: style.bg,
                        borderColor: style.color,
                      }}
                    >
                      {f.finding_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold inline-block mb-1"
                        style={{ color: style.color }}
                      >
                        {style.label}
                      </span>
                      <h3 className="font-display text-lg text-[var(--color-cream)] leading-tight">
                        {f.title}
                      </h3>
                    </div>
                  </div>

                  {f.description && (
                    <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-3">
                      {f.description}
                    </p>
                  )}

                  {f.recommendation && (
                    <div className="border-t border-white/5 pt-3 mt-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-gold-400)] mb-2 font-medium">
                        Recommended Action
                      </p>
                      <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                        {f.recommendation}
                      </p>
                      {cost && (
                        <p className="text-[12px] text-[var(--color-silver-300)] mt-2">
                          Estimated cost:{" "}
                          <span className="text-[var(--color-cream)] font-medium">
                            {cost}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-12">
          <Link
            href="/dashboard/vigil/new"
            className="btn-secondary justify-center"
          >
            <Camera className="h-4 w-4" />
            New Analysis
          </Link>
          <Link
            href="/dashboard/pilot"
            className="btn-primary justify-center"
          >
            Use This for FEMA Grant
          </Link>
        </div>

        <p className="text-[11px] text-[var(--color-silver-400)] leading-relaxed max-w-2xl">
          VIGIL provides preliminary observations based on visual evidence
          only. A full SHIELD Assessment by active-duty officers is required
          for definitive recommendations and FEMA NSGP grant submissions. This
          report is not a substitute for licensed engineering, legal, or
          insurance review.
        </p>
      </div>
    </div>
  );
}

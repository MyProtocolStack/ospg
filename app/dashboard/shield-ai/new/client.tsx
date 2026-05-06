"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Severity = "low" | "medium" | "high" | "critical";

type Finding = {
  number: number;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  bbox?: { x: number; y: number; w: number; h: number };
  est_cost_low?: number;
  est_cost_high?: number;
  nsgp_eligible?: boolean;
};

type AnalysisResult = {
  summary: string;
  findings: Finding[];
  overall_severity: Severity;
  area_label: string;
};

const SEVERITY_STYLES: Record<Severity, { color: string; bg: string; border: string; label: string }> = {
  low: { color: "#A0C7E5", bg: "rgba(160, 199, 229, 0.1)", border: "rgba(160, 199, 229, 0.4)", label: "LOW" },
  medium: { color: "#C9A961", bg: "rgba(201, 169, 97, 0.1)", border: "rgba(201, 169, 97, 0.4)", label: "MEDIUM" },
  high: { color: "#E59A3A", bg: "rgba(229, 154, 58, 0.1)", border: "rgba(229, 154, 58, 0.4)", label: "HIGH" },
  critical: { color: "#B33A3A", bg: "rgba(179, 58, 58, 0.1)", border: "rgba(179, 58, 58, 0.4)", label: "CRITICAL" },
};

export function ShieldAINewClient() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [areaLabel, setAreaLabel] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be under 20MB");
      return;
    }
    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function onAnalyze() {
    if (!photoFile) return;
    setAnalyzing(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      fd.append("area_label", areaLabel || "Unspecified location");
      fd.append("context", contextNote);

      const res = await fetch("/api/shield-ai/analyze", { method: "POST", body: fd });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Analysis failed (${res.status})`);
      }
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setAreaLabel("");
    setContextNote("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <Link
          href="/dashboard/shield-ai"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to SHIELD AI
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
            New Analysis
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-2">
            Upload &amp; analyze
          </h1>
          <p className="text-[var(--color-silver-200)]">
            Photos work best taken in daylight, with the entire entry/area in
            frame. SHIELD AI evaluates 40+ markers per image.
          </p>
        </div>

        {/* === RESULT VIEW === */}
        {result ? (
          <ResultView
            result={result}
            photoPreview={photoPreview}
            onReset={reset}
          />
        ) : (
          /* === UPLOAD VIEW === */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload zone */}
            <div>
              <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-3">
                Photo
              </label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handlePhoto(f);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`relative aspect-[4/3] rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                  photoPreview
                    ? "border-[var(--color-gold-400)]/40 bg-[var(--color-navy-700)]"
                    : "border-white/15 hover:border-[var(--color-gold-400)]/40 bg-[var(--color-navy-700)]/30"
                }`}
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Uploaded preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-silver-300)] hover:text-[var(--color-cream)] p-8 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Upload
                        className="h-7 w-7 text-[var(--color-gold-400)]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="font-display text-lg text-[var(--color-cream)] mb-1">
                      Drop a photo here
                    </p>
                    <p className="text-[13px] text-[var(--color-silver-300)] mb-2">
                      or click to browse
                    </p>
                    <p className="text-[11px] text-[var(--color-silver-400)]">
                      JPG, PNG, HEIC • up to 20 MB
                    </p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handlePhoto(e.target.files[0])
                  }
                />
                {photoPreview && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[var(--color-navy-800)]/80 border border-white/10 text-[12px] text-[var(--color-silver-100)] hover:bg-[var(--color-navy-700)] backdrop-blur"
                  >
                    Replace
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
                  Location label
                </label>
                <input
                  value={areaLabel}
                  onChange={(e) => setAreaLabel(e.target.value)}
                  placeholder="Side entrance — east side of chapel"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
                  Context (optional)
                </label>
                <textarea
                  value={contextNote}
                  onChange={(e) => setContextNote(e.target.value)}
                  placeholder="Anything you'd want me to know — recent incidents, sensitive concerns, recurring issues."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px] resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
                  <AlertCircle className="h-4 w-4 text-[var(--color-crimson-500)] mt-0.5 shrink-0" strokeWidth={2} />
                  <p className="text-[13px] text-[var(--color-crimson-500)]">{error}</p>
                </div>
              )}

              <button
                onClick={onAnalyze}
                disabled={!photoFile || analyzing}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing — usually 30-60 seconds
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze with SHIELD AI
                  </>
                )}
              </button>

              <p className="text-[11px] text-[var(--color-silver-400)] leading-relaxed">
                SHIELD AI provides preliminary observations only. A licensed
                security professional should validate findings before
                implementation. On-site walkthrough always recommended for
                comprehensive assessment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultView({
  result,
  photoPreview,
  onReset,
}: {
  result: AnalysisResult;
  photoPreview: string | null;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2
          className="h-5 w-5 text-[var(--color-gold-400)]"
          strokeWidth={1.5}
        />
        <span className="text-[13px] text-[var(--color-gold-400)] font-medium">
          Analysis complete
        </span>
      </div>

      <div className="surface-card-elevated p-6 lg:p-8 mb-6">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-2">
              {result.area_label}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)]">
              Executive Summary
            </h2>
          </div>
          <span
            className="text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full"
            style={{
              color: SEVERITY_STYLES[result.overall_severity].color,
              backgroundColor: SEVERITY_STYLES[result.overall_severity].bg,
              border: `1px solid ${SEVERITY_STYLES[result.overall_severity].border}`,
            }}
          >
            Overall: {SEVERITY_STYLES[result.overall_severity].label}
          </span>
        </div>
        <p className="text-[var(--color-silver-100)] leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Photo with annotations */}
      {photoPreview && (
        <div className="surface-card p-2 mb-6 relative">
          <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt={result.area_label}
              className="w-full h-full object-cover"
            />
            {result.findings.map((f) =>
              f.bbox ? (
                <div
                  key={f.number}
                  className="absolute"
                  style={{
                    left: `${f.bbox.x * 100}%`,
                    top: `${f.bbox.y * 100}%`,
                    width: `${f.bbox.w * 100}%`,
                    height: `${f.bbox.h * 100}%`,
                    border: `2px solid ${SEVERITY_STYLES[f.severity].color}`,
                    boxShadow: `0 0 0 1px ${SEVERITY_STYLES[f.severity].border}, 0 0 30px -5px ${SEVERITY_STYLES[f.severity].color}`,
                  }}
                >
                  <span
                    className="absolute -top-3 -left-3 w-7 h-7 rounded-full font-bold text-[12px] flex items-center justify-center border-2"
                    style={{
                      color: SEVERITY_STYLES[f.severity].color,
                      backgroundColor: "var(--color-navy-700)",
                      borderColor: SEVERITY_STYLES[f.severity].color,
                    }}
                  >
                    {f.number}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Findings list */}
      <h3 className="font-display text-2xl text-[var(--color-cream)] mb-4">
        Findings ({result.findings.length})
      </h3>
      <div className="space-y-4 mb-8">
        {result.findings.map((f) => (
          <div key={f.number} className="surface-card p-6">
            <div className="flex items-start gap-4 mb-3">
              <div
                className="shrink-0 w-9 h-9 rounded-full font-bold text-[14px] flex items-center justify-center border-2"
                style={{
                  color: SEVERITY_STYLES[f.severity].color,
                  backgroundColor: SEVERITY_STYLES[f.severity].bg,
                  borderColor: SEVERITY_STYLES[f.severity].color,
                }}
              >
                {f.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: SEVERITY_STYLES[f.severity].color }}
                  >
                    {SEVERITY_STYLES[f.severity].label}
                  </span>
                  {f.nsgp_eligible && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--color-gold-400)] px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
                      NSGP-Eligible
                    </span>
                  )}
                </div>
                <h4 className="font-display text-lg text-[var(--color-cream)]">{f.title}</h4>
              </div>
            </div>

            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-3">
              {f.description}
            </p>

            <div className="border-t border-white/5 pt-3 mt-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-gold-400)] mb-2 font-medium">
                Recommended Action
              </p>
              <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                {f.recommendation}
              </p>
              {(f.est_cost_low || f.est_cost_high) && (
                <p className="text-[12px] text-[var(--color-silver-300)] mt-2">
                  Estimated cost:{" "}
                  <span className="text-[var(--color-cream)] font-medium">
                    {f.est_cost_low === f.est_cost_high
                      ? `$${f.est_cost_low?.toLocaleString()}`
                      : `$${f.est_cost_low?.toLocaleString()} – $${f.est_cost_high?.toLocaleString()}`}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onReset} className="btn-secondary">
          <ImageIcon className="h-4 w-4" />
          New Analysis
        </button>
        <button className="btn-primary">
          <Download className="h-4 w-4" />
          Download PDF Report
        </button>
        <Link href="/dashboard/pilot" className="btn-secondary">
          <Camera className="h-4 w-4" />
          Use This for FEMA Grant
        </Link>
      </div>

      <p className="mt-8 text-[11px] text-[var(--color-silver-400)] leading-relaxed max-w-2xl">
        SHIELD AI provides preliminary observations based on visual evidence
        only. A full SHIELD™ Assessment by active-duty officers is required for
        definitive recommendations and FEMA NSGP grant submissions. This report
        is not a substitute for licensed engineering, legal, or insurance review.
      </p>
    </div>
  );
}

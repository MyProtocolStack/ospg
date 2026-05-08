"use client";

/**
 * Readiness Diagnostic - interactive client wizard.
 *
 * 10 questions across 3 stages. Each question shows the "evaluator
 * note" (what an OSPG founder would actually look for on a walkthrough)
 * to make this feel like a preview of the real assessment, not a
 * marketing gimmick.
 *
 * On completion, generates a personalized report with risk tier, top
 * gap categories, NSGP eligibility verdict, and a recommended
 * engagement. The whole flow is client-side - no submission required
 * to see results - which keeps friction low and respects the user's
 * time. We capture the email at the END of the report (optional)
 * to send a PDF copy.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Sparkles,
  RefreshCcw,
  Mail,
  Calendar,
  Eye,
  Loader2,
} from "lucide-react";
import {
  QUESTIONS,
  generateReport,
  type ReadinessAnswer,
  type ReadinessReport,
  type RiskTier,
} from "@/lib/readiness";

const TIER_STYLES: Record<
  RiskTier,
  { label: string; color: string; bg: string; border: string }
> = {
  low: {
    label: "Low risk",
    color: "#A0C7E5",
    bg: "rgba(160, 199, 229, 0.12)",
    border: "rgba(160, 199, 229, 0.4)",
  },
  moderate: {
    label: "Moderate",
    color: "#C9A961",
    bg: "rgba(201, 169, 97, 0.12)",
    border: "rgba(201, 169, 97, 0.4)",
  },
  elevated: {
    label: "Elevated",
    color: "#E59A3A",
    bg: "rgba(229, 154, 58, 0.12)",
    border: "rgba(229, 154, 58, 0.4)",
  },
  critical: {
    label: "Critical",
    color: "#B33A3A",
    bg: "rgba(179, 58, 58, 0.12)",
    border: "rgba(179, 58, 58, 0.4)",
  },
};

const SEV_COLOR: Record<"low" | "medium" | "high" | "critical", string> = {
  low: "#A0C7E5",
  medium: "#C9A961",
  high: "#E59A3A",
  critical: "#B33A3A",
};

type Stage = "intro" | "identify" | "posture" | "threat" | "report";

export function ReadinessDiagnostic() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);

  // Email capture state (optional, post-report)
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Determine which questions belong to the active stage
  const stageQuestions = useMemo(() => {
    if (stage === "intro" || stage === "report") return [];
    return QUESTIONS.filter((q) => q.stage === stage);
  }, [stage]);

  const currentQuestion = stageQuestions[questionIndex];

  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const overallProgress = Math.min(
    100,
    Math.round((answeredCount / totalQuestions) * 100)
  );

  function selectAnswer(qId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  }

  function goNext() {
    // Within the current stage
    if (questionIndex < stageQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }
    // Move to the next stage
    if (stage === "identify") {
      setStage("posture");
      setQuestionIndex(0);
      return;
    }
    if (stage === "posture") {
      setStage("threat");
      setQuestionIndex(0);
      return;
    }
    if (stage === "threat") {
      setStage("report");
      return;
    }
  }

  function goBack() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return;
    }
    // Roll back to previous stage
    if (stage === "posture") {
      setStage("identify");
      const identifyCount = QUESTIONS.filter((q) => q.stage === "identify").length;
      setQuestionIndex(identifyCount - 1);
      return;
    }
    if (stage === "threat") {
      setStage("posture");
      const postureCount = QUESTIONS.filter((q) => q.stage === "posture").length;
      setQuestionIndex(postureCount - 1);
      return;
    }
    if (stage === "identify") {
      setStage("intro");
      setQuestionIndex(0);
      return;
    }
  }

  function reset() {
    setStage("intro");
    setQuestionIndex(0);
    setAnswers({});
    setEmail("");
    setEmailDone(false);
    setEmailError(null);
  }

  // ----- INTRO -----
  if (stage === "intro") {
    return (
      <div className="surface-card-elevated p-8 md:p-10 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-6">
          <ShieldCheck
            className="h-7 w-7 text-[var(--color-gold-400)]"
            strokeWidth={1.5}
          />
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
          OSPG Readiness Diagnostic
        </p>
        <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-4 leading-tight">
          10 questions. Personalized assessment. No signup.
        </h2>
        <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-6">
          The same set of questions OSPG founders run through during a SHIELD
          walkthrough. You will get an honest read on your current posture,
          the categories most likely to surface findings, your FEMA NSGP grant
          eligibility, and a recommended next step calibrated to your tier -
          not a generic upsell.
        </p>
        <ul className="space-y-2.5 mb-7">
          {[
            "Takes about 4 minutes - no signup required to see your full report",
            "Shows what an OSPG walkthrough actually evaluates at every step",
            "Outputs a risk tier (Low / Moderate / Elevated / Critical) and a calibrated next step",
            "Optional email at the end to receive a PDF copy of your results",
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-3 text-[13px] text-[var(--color-silver-100)] leading-relaxed"
            >
              <CheckCircle2
                className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setStage("identify");
            setQuestionIndex(0);
          }}
          className="btn-primary w-full justify-center"
        >
          Start Diagnostic
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-[11px] text-[var(--color-silver-400)] text-center leading-relaxed">
          Answers stay in your browser. Nothing is submitted unless you
          choose to email yourself a copy at the end.
        </p>
      </div>
    );
  }

  // ----- REPORT -----
  if (stage === "report") {
    const answerArray: ReadinessAnswer[] = Object.entries(answers).map(
      ([q, a]) => ({ q, a })
    );
    const report: ReadinessReport = generateReport(answerArray);
    const tierStyle = TIER_STYLES[report.tier];

    async function submitEmail(e: React.FormEvent) {
      e.preventDefault();
      setEmailError(null);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("Please enter a valid email.");
        return;
      }
      setEmailSubmitting(true);
      try {
        const res = await fetch("/api/lead-magnet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "readiness_diagnostic",
            lead_magnet: "Readiness Diagnostic Report",
            notes: `Tier: ${report.tier} | Score: ${report.score} | Org: ${report.context.orgKind ?? "unknown"} | NSGP: ${report.nsgpEligibility.verdict}`,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Submit failed");
        }
        setEmailDone(true);
      } catch (e) {
        setEmailError(e instanceof Error ? e.message : "Submit failed");
      } finally {
        setEmailSubmitting(false);
      }
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Tier banner */}
        <div
          className="surface-card-elevated p-7 md:p-9 mb-6 relative overflow-hidden"
          style={{
            borderColor: tierStyle.border,
            borderWidth: 1,
          }}
        >
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: tierStyle.bg }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] font-medium">
                Your Result
              </p>
              <span
                className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
                style={{
                  color: tierStyle.color,
                  backgroundColor: tierStyle.bg,
                  border: `1px solid ${tierStyle.border}`,
                }}
              >
                {tierStyle.label}
              </span>
              <span className="text-[12px] text-[var(--color-silver-300)]">
                Score: {report.score}/100
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3 leading-tight">
              Readiness Diagnostic Report
            </h2>
            <p className="text-[15px] text-[var(--color-silver-100)] leading-relaxed max-w-3xl">
              {report.summary}
            </p>
          </div>
        </div>

        {/* Top gaps */}
        {report.topGaps.length > 0 && (
          <div className="surface-card p-6 md:p-7 mb-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4 font-medium">
              Categories most likely to surface findings
            </p>
            <ul className="space-y-4">
              {report.topGaps.map((gap, i) => (
                <li key={gap.category} className="flex gap-4">
                  <div
                    className="shrink-0 w-9 h-9 rounded-full font-bold text-[14px] flex items-center justify-center border-2"
                    style={{
                      color: SEV_COLOR[gap.severity],
                      backgroundColor: `${SEV_COLOR[gap.severity]}1F`,
                      borderColor: SEV_COLOR[gap.severity],
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-display text-[16px] text-[var(--color-cream)] leading-tight">
                        {gap.label}
                      </h4>
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: SEV_COLOR[gap.severity] }}
                      >
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed">
                      {gap.finding}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* NSGP eligibility */}
        <div className="surface-card p-6 md:p-7 mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
            FEMA NSGP grant eligibility
          </p>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="font-display text-[18px] text-[var(--color-cream)]">
              {report.nsgpEligibility.verdict === "likely-eligible"
                ? "Likely eligible"
                : report.nsgpEligibility.verdict === "possibly-eligible"
                  ? "Possibly eligible"
                  : report.nsgpEligibility.verdict === "needs-review"
                    ? "Needs further review"
                    : "Not eligible for NSGP"}
            </h3>
          </div>
          <p className="text-[13px] text-[var(--color-silver-100)] leading-relaxed">
            {report.nsgpEligibility.reasoning}
          </p>
        </div>

        {/* Recommended engagement */}
        <div className="surface-card-elevated p-7 md:p-9 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[var(--color-gold-400)]/8 blur-[80px] pointer-events-none" />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
              Recommended next step
            </p>
            <h3 className="font-display text-xl md:text-2xl text-[var(--color-cream)] mb-3 leading-tight">
              {report.recommendedEngagement.label}
            </h3>
            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-4">
              {report.recommendedEngagement.description}
            </p>
            <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-6">
              Estimated cost: {report.recommendedEngagement.estCostRange}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/walkthrough" className="btn-primary justify-center">
                <Calendar className="h-4 w-4" />
                {report.recommendedEngagement.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/praesidium" className="btn-secondary justify-center">
                Try PRAESIDIUM Free
              </Link>
            </div>
          </div>
        </div>

        {/* Email capture (optional) */}
        <div className="surface-card p-6 md:p-7 mb-6">
          {emailDone ? (
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="h-5 w-5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <p className="text-[14px] text-[var(--color-cream)] mb-1 font-medium">
                  Report on its way to {email}.
                </p>
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
                  We will follow up within 24 hours to discuss your specific
                  situation. If you do not see the email, check your spam
                  folder or reply directly to{" "}
                  <span className="text-[var(--color-gold-400)]">
                    Oceanstateprotectiongroup@gmail.com
                  </span>
                  .
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-2 font-medium">
                Email this report to yourself
              </p>
              <p className="text-[13px] text-[var(--color-silver-200)] leading-relaxed mb-4">
                Optional. We will send a PDF version you can forward to your
                board / business manager / safety committee, plus a brief
                follow-up if appropriate.
              </p>
              <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]"
                    strokeWidth={1.5}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.org"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="btn-primary justify-center disabled:opacity-60"
                >
                  {emailSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send Me the Report
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              {emailError && (
                <div className="mt-3 flex items-start gap-2 text-[12px] text-[var(--color-crimson-500)]">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Reset / share footer */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] transition-colors px-4 py-2"
          >
            <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.7} />
            Run diagnostic again
          </button>
          <p className="text-[11px] text-[var(--color-silver-400)] text-center sm:text-right">
            This diagnostic is preliminary. Definitive recommendations require
            an on-site walkthrough.
          </p>
        </div>
      </div>
    );
  }

  // ----- QUESTION SCREEN -----
  if (!currentQuestion) return null;

  const selected = answers[currentQuestion.id];
  const canAdvance = !!selected;

  const stageLabel =
    stage === "identify"
      ? "Identify"
      : stage === "posture"
        ? "Current posture"
        : "Threat profile";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
          <span>{stageLabel}</span>
          <span>{overallProgress}% complete</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-gold-400)] to-[var(--color-gold-300)] transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="surface-card-elevated p-7 md:p-9 mb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
          Question {answeredCount + (selected ? 0 : 1)} of {totalQuestions}
        </p>
        <h2 className="font-display text-xl md:text-2xl text-[var(--color-cream)] mb-3 leading-tight">
          {currentQuestion.prompt}
        </h2>
        {currentQuestion.helper && (
          <p className="text-[13px] text-[var(--color-silver-300)] mb-5 leading-relaxed">
            {currentQuestion.helper}
          </p>
        )}

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          {currentQuestion.options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectAnswer(currentQuestion.id, opt.id)}
                className={`w-full text-left px-5 py-3.5 rounded-lg border transition-all flex items-center gap-3 ${
                  isSelected
                    ? "border-[var(--color-gold-400)]/60 bg-[var(--color-gold-400)]/10"
                    : "border-white/10 bg-[var(--color-navy-700)]/40 hover:border-white/20"
                }`}
              >
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[var(--color-gold-400)] bg-[var(--color-gold-400)]"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2
                      className="h-3 w-3 text-[var(--color-navy-800)]"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <span
                  className={`text-[14px] leading-snug ${
                    isSelected
                      ? "text-[var(--color-cream)]"
                      : "text-[var(--color-silver-100)]"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Evaluator note */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-gold-400)]/5 border border-[var(--color-gold-400)]/20">
          <Eye
            className="h-3.5 w-3.5 text-[var(--color-gold-400)] shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-[11px] text-[var(--color-silver-200)] leading-relaxed italic">
            <span className="text-[var(--color-gold-400)] not-italic font-medium uppercase tracking-wider text-[10px] mr-1.5">
              What we look for:
            </span>
            {currentQuestion.evaluatorNote}
          </p>
        </div>
      </div>

      {/* Nav controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] transition-colors px-4 py-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.7} />
          Back
        </button>
        <div className="flex items-center gap-2 text-[11px] text-[var(--color-silver-400)]">
          <Lock className="h-3 w-3" strokeWidth={1.7} />
          Answers stay in your browser
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          className="btn-primary !py-2.5 !px-5 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {stage === "threat" && questionIndex === stageQuestions.length - 1 ? (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              See My Report
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

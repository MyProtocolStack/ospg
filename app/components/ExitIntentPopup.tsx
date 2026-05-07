"use client";

/**
 * Exit-intent email-capture popup.
 *
 * Triggers on:
 *   - Desktop: cursor leaves viewport via the top edge (mouseleave with
 *     clientY <= 0). This is the canonical exit-intent pattern.
 *   - Mobile: 45-second time-on-page fallback (no cursor exit signal).
 *
 * Suppression rules:
 *   - Does not show on /dashboard, /onboarding, /login, /signup, /auth.
 *   - Does not show if user already dismissed (localStorage 30-day cooldown).
 *   - Does not show if user already submitted (localStorage permanent flag).
 *   - Does not show within the first 8 seconds of page load (avoids
 *     accidental triggers when the cursor flicks toward a tab/bookmark).
 *
 * Lead magnet offer: FEMA NSGP Application Checklist - high-intent,
 * directly tied to the most-funded vertical (faith-based 501(c)(3)s).
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  AlertCircle,
} from "lucide-react";

const STORAGE_DISMISSED = "ospg_lm_dismissed_at";
const STORAGE_SUBMITTED = "ospg_lm_submitted";
const COOLDOWN_DAYS = 30;
const ARM_DELAY_MS = 8000; // Don't arm trigger for first 8 seconds
const MOBILE_FALLBACK_MS = 45000; // 45s on-page fallback for mobile

const SUPPRESSED_PATH_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/login",
  "/signup",
  "/auth",
];

export function ExitIntentPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const armed = useRef(false);
  const triggered = useRef(false);

  // Determine if the popup should ever run on this route.
  const isSuppressedPath = SUPPRESSED_PATH_PREFIXES.some(
    (p) => pathname?.startsWith(p)
  );

  useEffect(() => {
    if (isSuppressedPath) return;
    if (typeof window === "undefined") return;

    // Suppression: already submitted (permanent)
    if (window.localStorage.getItem(STORAGE_SUBMITTED) === "1") return;

    // Suppression: dismissed within cooldown window
    const dismissedAt = window.localStorage.getItem(STORAGE_DISMISSED);
    if (dismissedAt) {
      const ageMs = Date.now() - parseInt(dismissedAt, 10);
      if (Number.isFinite(ageMs) && ageMs < COOLDOWN_DAYS * 86400000) return;
    }

    let armTimer: ReturnType<typeof setTimeout> | null = null;
    let mobileFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    armTimer = setTimeout(() => {
      armed.current = true;
    }, ARM_DELAY_MS);

    function fireOnce() {
      if (triggered.current || !armed.current) return;
      triggered.current = true;
      setOpen(true);
    }

    function handleMouseLeave(e: MouseEvent) {
      // Only count an exit when the cursor actually crosses the top edge
      if (e.clientY <= 0) fireOnce();
    }

    // Mobile fallback: time-based
    const isMobileLike =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isMobileLike) {
      mobileFallbackTimer = setTimeout(() => {
        fireOnce();
      }, MOBILE_FALLBACK_MS);
    } else {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (armTimer) clearTimeout(armTimer);
      if (mobileFallbackTimer) clearTimeout(mobileFallbackTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isSuppressedPath, pathname]);

  function handleClose() {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "exit_intent_popup",
          lead_magnet: "FEMA NSGP Application Checklist",
          notes: `Path: ${pathname || "/"}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Submit failed (${res.status})`);
      }
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_SUBMITTED, "1");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (isSuppressedPath || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-navy-800)]/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg surface-card-elevated p-7 md:p-9 rounded-2xl">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-[var(--color-silver-300)] hover:text-[var(--color-cream)] transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={1.7} />
        </button>

        {submitted ? (
          /* Success state */
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2
                className="h-7 w-7 text-[var(--color-gold-400)]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="font-display text-2xl text-[var(--color-cream)] mb-3 leading-tight">
              You&apos;re on the list.
            </h2>
            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-2">
              The FEMA NSGP Application Checklist is being prepared and will
              hit your inbox shortly.
            </p>
            <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
              If you don&apos;t see it within 24 hours, check your spam folder
              or email us directly at{" "}
              <span className="text-[var(--color-gold-400)]">
                Oceanstateprotectiongroup@gmail.com
              </span>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
                <ShieldCheck
                  className="h-6 w-6 text-[var(--color-gold-400)]"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-1 font-medium">
                  Before you go
                </p>
                <h2
                  id="exit-intent-title"
                  className="font-display text-2xl text-[var(--color-cream)] leading-tight"
                >
                  Get the FEMA NSGP Application Checklist.
                </h2>
              </div>
            </div>

            {/* Pitch */}
            <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-5">
              The same checklist we walk our parish, school, and synagogue
              clients through to qualify for up to <strong className="text-[var(--color-cream)]">$200,000 per site</strong>{" "}
              in federal security funding. Threat-narrative prompts, investment-justification
              format, and the deadline calendar - all in one PDF.
            </p>

            {/* Bullets */}
            <ul className="space-y-2 mb-6">
              {[
                "Eligibility self-check (saves the application time if you don't qualify)",
                "Threat-narrative writing prompts that score well with FEMA reviewers",
                "Cost-justification template aligned to FEMA's expected format",
                "RIEMA / state-cycle deadline calendar",
              ].map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] text-[var(--color-silver-100)] leading-relaxed"
                >
                  <CheckCircle2
                    className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]"
                  strokeWidth={1.5}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.org"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
                  <AlertCircle
                    className="h-4 w-4 text-[var(--color-crimson-500)] mt-0.5 shrink-0"
                    strokeWidth={2}
                  />
                  <p className="text-[12px] text-[var(--color-crimson-500)]">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Me the Checklist
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-[var(--color-silver-400)] text-center mt-4 leading-relaxed">
              We email the checklist once and add you to occasional security
              briefings. No spam, unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

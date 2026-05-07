"use client";

/**
 * Root-level error boundary. Catches any error thrown above the dashboard
 * route group's own error boundary - including errors from the dashboard
 * LAYOUT itself (which the dashboard/error.tsx cannot catch by design).
 *
 * Surfaces the actual error message + digest so we can diagnose specific
 * failures instead of staring at a generic Next.js page.
 */
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-hero-gradient grain">
      <div className="max-w-lg w-full">
        <div className="surface-card-elevated p-8 md:p-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-6">
            <AlertTriangle
              className="h-7 w-7 text-[var(--color-gold-400)]"
              strokeWidth={1.5}
            />
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
            Application Error
          </p>

          <h1 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3 leading-tight">
            Something went wrong.
          </h1>

          <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-6">
            An unexpected error happened on this page. The team has been
            notified. You can try reloading - if it keeps failing, head back
            home and try a different path.
          </p>

          <div className="mb-7 p-4 rounded-lg bg-[var(--color-navy-800)]/60 border border-white/10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-2 font-medium">
              Diagnostic
            </p>
            <p className="text-[12px] text-[var(--color-cream)] font-mono break-words mb-1">
              {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p className="text-[10px] text-[var(--color-silver-400)] font-mono">
                digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="btn-primary justify-center"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link href="/" className="btn-secondary justify-center">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

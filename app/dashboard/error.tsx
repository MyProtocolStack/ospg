"use client";

/**
 * Dashboard error boundary. Catches any runtime error from the dashboard
 * route group (layout, page, or any nested route) and surfaces a usable
 * recovery UI instead of the generic Next.js "This page couldn't load"
 * white-screen.
 *
 * The error.message is shown only to logged-in dashboard users. We do not
 * leak it on public pages.
 */
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
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
            Dashboard Error
          </p>

          <h1 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3 leading-tight">
            Something went wrong loading the dashboard.
          </h1>

          <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed mb-6">
            This usually means a database query, auth state, or third-party
            integration hit an unexpected condition. The error has been logged
            and the team will see it. You can try reloading - if it keeps
            failing, jump back to the public site and try again later.
          </p>

          {/* Show the actual error message + digest so we can debug fast */}
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

import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { PraesidiumNewClient } from "./client";
import { getQuotaForCurrentUser, FREE_ANALYSIS_LIMIT } from "@/lib/praesidium-quota";

export const metadata = { title: "New PRAESIDIUM Analysis" };
export const dynamic = "force-dynamic";

export default async function NewPraesidiumPage() {
  const quota = await getQuotaForCurrentUser();

  // If we have no quota info (user not authenticated yet, or no
  // membership), let the client render its own auth flow. The API will
  // also bounce them to /onboarding if they try to actually run an
  // analysis without a membership.
  if (!quota) {
    return <PraesidiumNewClient />;
  }

  // Quota exhausted - show the book-a-walkthrough gate instead of the
  // upload form. This is the conversion point: PRAESIDIUM was the demo,
  // SHIELD Assessment (the in-person walkthrough) is the consulting
  // product we are actually selling.
  if (quota.exhausted) {
    return (
      <div className="min-h-screen p-6 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard/praesidium"
            className="inline-flex items-center gap-2 text-[13px] text-[var(--color-silver-300)] hover:text-[var(--color-cream)] mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to PRAESIDIUM
          </Link>

          <div className="surface-card-elevated p-8 lg:p-10 relative overflow-hidden">
            {/* Decorative gold halo */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-gold-400)]/8 blur-[100px] pointer-events-none" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center mb-6">
                <ShieldCheck
                  className="h-7 w-7 text-[var(--color-gold-400)]"
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3 font-medium">
                Free analyses used: {quota.used} of {quota.limit}
              </p>

              <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
                You&apos;ve seen what PRAESIDIUM can do.{" "}
                <span className="italic text-gradient-gold">
                  Now let&apos;s walk your campus.
                </span>
              </h1>

              <p className="text-[15px] text-[var(--color-silver-100)] leading-relaxed mb-6">
                You used both of your free PRAESIDIUM analyses. The next step is
                a real SHIELD Assessment - both founders walk your property
                in person, identify what photos miss (procedure gaps,
                operational drift, insider risk), and produce the document
                your insurance carrier and FEMA NSGP application actually
                require.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Both active-duty co-founders attend every initial walkthrough",
                  "60-90 minute on-site visit, written report within 7 days",
                  "Compatible with FEMA NSGP grant submission format",
                  "Free for first-time clients - no commitment required",
                ].map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)]" />
                    <p className="text-[14px] text-[var(--color-silver-100)] leading-relaxed">
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/walkthrough" className="btn-primary justify-center">
                  <Calendar className="h-4 w-4" />
                  Book Free Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/praesidium"
                  className="btn-secondary justify-center"
                >
                  Review Past Analyses
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3">
                <AlertCircle
                  className="h-4 w-4 text-[var(--color-silver-400)] shrink-0 mt-0.5"
                  strokeWidth={1.7}
                />
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
                  Need additional photo analyses before booking? Email{" "}
                  <span className="text-[var(--color-gold-400)]">
                    Oceanstateprotectiongroup@gmail.com
                  </span>{" "}
                  with your use case - we will extend your access on a
                  case-by-case basis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has quota remaining - render the upload form. Pass the remaining
  // count so the client can show "1 of 2 free analyses remaining" inline.
  return <PraesidiumNewClient remainingFree={quota.remaining} totalFree={quota.limit} />;
}

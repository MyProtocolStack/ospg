import { Suspense } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { SignupForm } from "./signup-form";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 py-12 grain">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-12 group">
          <div className="relative">
            <Shield className="h-8 w-8 text-[var(--color-gold-400)]" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-[var(--color-gold-400)] blur-xl opacity-30" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg text-[var(--color-cream)] tracking-tight">
              {BRAND.shortName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-300)]">
              Protection Group
            </span>
          </div>
        </Link>

        <div className="surface-card-elevated p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
              Create Account
            </p>
            <h1 className="font-display text-3xl text-[var(--color-cream)] mb-2">
              Start protecting{" "}
              <span className="italic text-gradient-gold">today.</span>
            </h1>
            <p className="text-sm text-[var(--color-silver-200)]">
              Free PRAESIDIUM access with every account.
            </p>
          </div>

          <Suspense>
            <SignupForm />
          </Suspense>

          <p className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-[var(--color-silver-200)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-gold-400)] link-underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--color-silver-400)] max-w-sm mx-auto leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/legal/terms" className="link-underline text-[var(--color-silver-200)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="link-underline text-[var(--color-silver-200)]">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

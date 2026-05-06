import { Suspense } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { LoginForm } from "./login-form";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 py-12 grain">
      {/* Decorative orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-12 group">
          <div className="relative">
            <Shield
              className="h-8 w-8 text-[var(--color-gold-400)]"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-[var(--color-gold-400)] blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
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
              Member Access
            </p>
            <h1 className="font-display text-3xl text-[var(--color-cream)] mb-2">
              Welcome back.
            </h1>
            <p className="text-sm text-[var(--color-silver-200)]">
              Sign in to your dashboard.
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-[var(--color-silver-200)]">
            New to Lighthouse?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-gold-400)] link-underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-[12px] text-[var(--color-silver-300)]">
          Or{" "}
          <Link href="/" className="link-underline text-[var(--color-silver-100)]">
            return to home
          </Link>
        </p>
      </div>
    </main>
  );
}

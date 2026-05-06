import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import { OnboardingForm } from "./form";

export const metadata = { title: "Create Your Org" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding");

  // If user already has a membership, skip onboarding
  const { data: existing } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (existing?.org_id) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center px-6 py-12 grain">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-xl">
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
              One More Step
            </p>
            <h1 className="font-display text-3xl text-[var(--color-cream)] mb-2">
              Tell us about your{" "}
              <span className="italic text-gradient-gold">organization.</span>
            </h1>
            <p className="text-sm text-[var(--color-silver-200)]">
              We tailor SHIELD AI, PILOT, and course recommendations to your
              vertical. Takes 30 seconds.
            </p>
          </div>

          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}

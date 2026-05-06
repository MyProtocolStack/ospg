"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Building2,
  MapPin,
  Users,
  AlertCircle,
  Church,
  GraduationCap,
  Briefcase,
  Home,
  Calendar,
  Dumbbell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ORG_TYPES = [
  { value: "school", label: "School", icon: GraduationCap },
  { value: "parish", label: "Parish", icon: Church },
  { value: "business", label: "Business", icon: Briefcase },
  { value: "estate", label: "Estate", icon: Home },
  { value: "event", label: "Event", icon: Calendar },
  { value: "gym", label: "Gym", icon: Dumbbell },
] as const;

export function OnboardingForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<string>("school");
  const [city, setCity] = useState("");
  const [state, setState] = useState("RI");
  const [population, setPopulation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName,
          type: orgType,
          city,
          state,
          est_population: population ? parseInt(population) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Onboarding failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
          Organization name
        </label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]" strokeWidth={1.5} />
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Bishop Hendricken High School"
            required
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-3">
          Organization type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ORG_TYPES.map((opt) => {
            const Icon = opt.icon;
            const isActive = orgType === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setOrgType(opt.value)}
                className={cn(
                  "p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5",
                  isActive
                    ? "border-[var(--color-gold-400)]/60 bg-[var(--color-gold-400)]/10"
                    : "border-white/10 bg-[var(--color-navy-700)] hover:border-white/20"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-[var(--color-gold-400)]" : "text-[var(--color-silver-300)]"
                  )}
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "text-[12px] font-medium transition-colors",
                    isActive ? "text-[var(--color-cream)]" : "text-[var(--color-silver-200)]"
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]" strokeWidth={1.5} />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Warwick"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
          >
            {["RI", "MA", "CT", "NH", "VT", "ME", "NY", "Other"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
          Approx. population (optional)
        </label>
        <div className="relative">
          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]" strokeWidth={1.5} />
          <input
            type="number"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            placeholder="650 students / congregants / employees"
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
          <AlertCircle className="h-4 w-4 text-[var(--color-crimson-500)] mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[13px] text-[var(--color-crimson-500)]">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !orgName}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Setting up your dashboard...
          </>
        ) : (
          "Continue to Dashboard"
        )}
      </button>
    </form>
  );
}

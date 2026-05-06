"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: err, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { org_name: orgName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user && !data.session) {
      // Email confirmation required
      setSuccess(true);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2
          className="h-12 w-12 text-[var(--color-gold-400)] mx-auto"
          strokeWidth={1.5}
        />
        <h3 className="font-display text-xl text-[var(--color-cream)]">
          Check your email
        </h3>
        <p className="text-sm text-[var(--color-silver-100)] leading-relaxed">
          We sent a confirmation link to <strong>{email}</strong>. Click the
          link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        icon={Building2}
        label="Organization (school, parish, business)"
        type="text"
        value={orgName}
        onChange={setOrgName}
        placeholder="Bishop Hendricken High School"
        required
      />
      <Field
        icon={Mail}
        label="Work Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@school.org"
        autoComplete="email"
        required
      />
      <Field
        icon={Lock}
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        minLength={8}
      />

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
          <AlertCircle
            className="h-4 w-4 text-[var(--color-crimson-500)] mt-0.5 shrink-0"
            strokeWidth={2}
          />
          <p className="text-[13px] text-[var(--color-crimson-500)]">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Free Account"
        )}
      </button>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
}: {
  icon: React.ElementType;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {label}
      </span>
      <div className="relative">
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]"
          strokeWidth={1.5}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 transition-colors text-[14px]"
        />
      </div>
    </label>
  );
}

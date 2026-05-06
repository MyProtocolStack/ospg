"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function WalkthroughForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [type, setType] = useState("school");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/walkthrough", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, org, type, notes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-[var(--color-gold-400)] mx-auto mb-4" strokeWidth={1.5} />
        <h4 className="font-display text-xl text-[var(--color-cream)] mb-2">
          Got it.
        </h4>
        <p className="text-[14px] text-[var(--color-silver-200)] leading-relaxed">
          We&apos;ll reach out within 24 hours to confirm availability and a date.
          Watch for an email from <span className="text-[var(--color-gold-400)]">info@lighthouseprotection.group</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Your name" value={name} onChange={setName} placeholder="Mark DeCiccio" required />
        <Input label="Phone" value={phone} onChange={setPhone} placeholder="(401) 555-0123" type="tel" />
      </div>
      <Input label="Email" value={email} onChange={setEmail} placeholder="you@school.org" type="email" required />
      <Input label="Organization" value={org} onChange={setOrg} placeholder="Your school, parish, or business name" required />
      <Select
        label="Organization type"
        value={type}
        onChange={setType}
        options={[
          { value: "school", label: "School" },
          { value: "parish", label: "Parish / House of Worship" },
          { value: "business", label: "Business" },
          { value: "estate", label: "Estate / Residence" },
          { value: "event", label: "Event" },
          { value: "gym", label: "Gym / Fitness" },
          { value: "other", label: "Other" },
        ]}
      />
      <Textarea
        label="Anything specific you want us to look at?"
        value={notes}
        onChange={setNotes}
        placeholder="Side entrance, recent incident, parking lot lighting at evening masses..."
      />

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
          <AlertCircle className="h-4 w-4 text-[var(--color-crimson-500)] mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[13px] text-[var(--color-crimson-500)]">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Walkthrough"
        )}
      </button>

      <p className="text-[11px] text-[var(--color-silver-400)] leading-relaxed text-center">
        By submitting, you agree to be contacted by Lighthouse about this request only.
        We never share your information with third parties.
      </p>
    </form>
  );
}

function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      />
    </label>
  );
}

function Select(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px] resize-none"
      />
    </label>
  );
}

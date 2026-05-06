"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NewBookingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    start_at: "",
    end_at: "",
    officer_count: 1,
    threat_level: "low",
    location: "",
    description: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Booking failed");
      }
      setDone(true);
      setTimeout(() => router.push("/dashboard/bookings"), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2
          className="h-12 w-12 text-[var(--color-gold-400)] mx-auto mb-5"
          strokeWidth={1.5}
        />
        <h3 className="font-display text-2xl text-[var(--color-cream)] mb-2">
          Request received.
        </h3>
        <p className="text-[var(--color-silver-200)]">
          We&apos;ll confirm availability within 24 hours. You&apos;ll get an email
          confirmation when officers are assigned.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldDate
          label="Start"
          value={form.start_at}
          onChange={(v) => update("start_at", v)}
          required
        />
        <FieldDate
          label="End"
          value={form.end_at}
          onChange={(v) => update("end_at", v)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldNumber
          label="Officers"
          value={form.officer_count}
          onChange={(v) => update("officer_count", v)}
          min={1}
          max={10}
        />
        <FieldSelect
          label="Threat level"
          value={form.threat_level}
          onChange={(v) => update("threat_level", v)}
          options={[
            { value: "low", label: "Low — Standard event presence" },
            { value: "medium", label: "Medium — Some specific concerns" },
            { value: "high", label: "High — Active concerns" },
            { value: "critical", label: "Critical — Specific credible threat" },
          ]}
        />
      </div>

      <FieldText
        label="Location address"
        value={form.location}
        onChange={(v) => update("location", v)}
        placeholder="2615 Warwick Ave, Warwick, RI 02889"
        required
      />

      <FieldTextarea
        label="Event description"
        value={form.description}
        onChange={(v) => update("description", v)}
        placeholder="Sunday vigil mass — typically 250 attendees. Sanctuary entrance and parking lot coverage requested."
        required
      />

      <FieldTextarea
        label="Additional notes (optional)"
        value={form.notes}
        onChange={(v) => update("notes", v)}
        placeholder="Anything we should know — recent incidents, sensitive context, special access needs."
      />

      {error && (
        <div className="p-3 rounded-lg bg-[var(--color-crimson-500)]/10 border border-[var(--color-crimson-500)]/30">
          <p className="text-[13px] text-[var(--color-crimson-500)]">{error}</p>
        </div>
      )}

      <div className="pt-4 border-t border-white/5">
        <p className="text-[12px] text-[var(--color-silver-300)] mb-4 leading-relaxed">
          Standard rate: $200/hour per officer. Elevated rate: $250/hour. Quote
          confirmed before billing. Payment via card or NET30 invoicing.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting request...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </button>
      </div>
    </form>
  );
}

function FieldDate(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <input
        type="datetime-local"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      />
    </label>
  );
}

function FieldText(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      />
    </label>
  );
}

function FieldTextarea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
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
        required={props.required}
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px] resize-none"
      />
    </label>
  );
}

function FieldNumber(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
        {props.label}
      </span>
      <input
        type="number"
        value={props.value}
        onChange={(e) => props.onChange(parseInt(e.target.value || "0"))}
        min={props.min}
        max={props.max}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      />
    </label>
  );
}

function FieldSelect(props: {
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

"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
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
        body: JSON.stringify({
          name,
          email,
          phone,
          org,
          type: topic,
          notes: message,
          source: "contact_form",
        }),
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
          Message sent.
        </h4>
        <p className="text-[14px] text-[var(--color-silver-200)]">
          A founder will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="Your name" value={name} onChange={setName} required />
        <FormField label="Phone (optional)" value={phone} onChange={setPhone} type="tel" />
      </div>
      <FormField label="Email" value={email} onChange={setEmail} type="email" required />
      <FormField label="Organization" value={org} onChange={setOrg} />

      <label className="block">
        <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
          Topic
        </span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
        >
          <option value="general">General inquiry</option>
          <option value="walkthrough">Schedule a walkthrough</option>
          <option value="shield_assessment">SHIELD Assessment</option>
          <option value="security_detail">Security detail</option>
          <option value="grant_help">FEMA grant help</option>
          <option value="custom_training">Custom training</option>
          <option value="press">Press / media</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block">
        <span className="block text-[12px] uppercase tracking-[0.18em] text-[var(--color-silver-200)] mb-2">
          Message
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your situation..."
          rows={5}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px] resize-none"
        />
      </label>

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
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

function FormField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        required={props.required}
        className="w-full px-4 py-3 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
      />
    </label>
  );
}

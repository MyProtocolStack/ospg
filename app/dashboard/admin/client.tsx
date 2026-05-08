"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

export type AdminOrgRow = {
  id: string;
  name: string;
  type: string;
  city: string | null;
  state: string | null;
  plan: string;
  plan_updated_at: string | null;
  primary_contact_email: string | null;
  created_at: string;
};

const PLAN_OPTIONS = [
  { value: "free", label: "Free (Trial)", engaged: false },
  { value: "walkthrough", label: "Walkthrough Pending", engaged: false },
  { value: "shield", label: "SHIELD Client (Engaged)", engaged: true },
  { value: "subscriber", label: "Subscriber (Engaged)", engaged: true },
  { value: "enterprise", label: "Enterprise (Engaged)", engaged: true },
];

const PLAN_LABEL: Record<string, string> = Object.fromEntries(
  PLAN_OPTIONS.map((p) => [p.value, p.label])
);

function isEngagedPlan(plan: string): boolean {
  return plan === "shield" || plan === "subscriber" || plan === "enterprise";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function AdminOrgsClient({ orgs }: { orgs: AdminOrgRow[] }) {
  const [query, setQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      if (filterPlan !== "all" && o.plan !== filterPlan) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        (o.primary_contact_email ?? "").toLowerCase().includes(q) ||
        (o.city ?? "").toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orgs, query, filterPlan]);

  async function changePlan(orgId: string, newPlan: string) {
    setError(null);
    setSuccess(null);
    setBusyId(orgId);
    try {
      const res = await fetch(`/api/admin/orgs/${orgId}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Update failed (${res.status})`);
      }
      const data = await res.json();
      setSuccess(`${data.name} -> ${PLAN_LABEL[data.plan] || data.plan}`);
      // Refresh the server component so the new tier is reflected.
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="surface-card p-5 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)]"
            strokeWidth={1.5}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by org name, email, city, or ID..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px]"
          />
        </div>
        <div className="relative">
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 text-[14px] min-w-[180px]"
          >
            <option value="all">All plans</option>
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-silver-400)] pointer-events-none"
            strokeWidth={1.7}
          />
        </div>
        <p className="text-[12px] text-[var(--color-silver-300)] md:ml-2">
          {filtered.length} of {orgs.length}
        </p>
      </div>

      {/* Toasts */}
      {error && (
        <div className="surface-card p-4 mb-4 border border-[var(--color-crimson-500)]/40 flex items-start gap-3">
          <AlertCircle
            className="h-4 w-4 text-[var(--color-crimson-500)] shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-[13px] text-[var(--color-silver-100)]">
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="surface-card p-4 mb-4 border border-[var(--color-gold-400)]/40 flex items-start gap-3">
          <CheckCircle2
            className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-[13px] text-[var(--color-silver-100)]">
            Updated: <span className="text-[var(--color-cream)] font-medium">{success}</span>
          </p>
        </div>
      )}

      {/* Org list */}
      {filtered.length === 0 ? (
        <div className="surface-card-elevated p-10 text-center">
          <p className="text-[15px] text-[var(--color-silver-200)]">
            No orgs match your filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const engaged = isEngagedPlan(o.plan);
            const busy = busyId === o.id || isPending;
            return (
              <div
                key={o.id}
                className="surface-card p-5 flex flex-col lg:flex-row lg:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-display text-lg text-[var(--color-cream)] leading-tight truncate">
                      {o.name || "(unnamed)"}
                    </h3>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                        engaged
                          ? "text-[var(--color-gold-400)] bg-[var(--color-gold-400)]/10 border-[var(--color-gold-400)]/40"
                          : "text-[var(--color-silver-300)] bg-white/5 border-white/10"
                      }`}
                    >
                      {PLAN_LABEL[o.plan] || o.plan}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-silver-400)]">
                      {o.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--color-silver-300)]">
                    {o.primary_contact_email && (
                      <span>{o.primary_contact_email}</span>
                    )}
                    {(o.city || o.state) && (
                      <span>
                        {o.city}
                        {o.city && o.state ? ", " : ""}
                        {o.state}
                      </span>
                    )}
                    <span>
                      Created {formatDate(o.created_at)}
                    </span>
                    <span className="text-[var(--color-silver-400)] font-mono text-[10px]">
                      {o.id.slice(0, 8)}
                    </span>
                  </div>
                  {o.plan_updated_at && (
                    <p className="mt-1 text-[11px] text-[var(--color-silver-400)]">
                      Plan last changed {formatDate(o.plan_updated_at)}
                    </p>
                  )}
                </div>

                {/* Plan picker */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={o.plan}
                    onChange={(e) => changePlan(o.id, e.target.value)}
                    disabled={busy}
                    className="appearance-none px-3 py-2 rounded-lg bg-[var(--color-navy-700)] border border-white/10 text-[var(--color-cream)] focus:border-[var(--color-gold-400)]/60 focus:outline-none text-[13px] disabled:opacity-50"
                  >
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {busy && (
                    <Loader2
                      className="h-4 w-4 text-[var(--color-gold-400)] animate-spin"
                      strokeWidth={2}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer help */}
      <div className="mt-8 surface-card p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-2 font-medium">
          Tier reference
        </p>
        <ul className="space-y-1.5 text-[13px] text-[var(--color-silver-200)] leading-relaxed">
          <li>
            <strong className="text-[var(--color-cream)]">free</strong> /{" "}
            <strong className="text-[var(--color-cream)]">walkthrough</strong> -
            evaluator tier. PRAESIDIUM 2-cap, course preview only, no detail
            bookings.
          </li>
          <li>
            <strong className="text-[var(--color-gold-400)]">shield</strong> /{" "}
            <strong className="text-[var(--color-gold-400)]">subscriber</strong>{" "}
            / <strong className="text-[var(--color-gold-400)]">enterprise</strong> -
            engaged client tier. Unlimited PRAESIDIUM, full course library,
            detail bookings, founder priority.
          </li>
        </ul>
        <p className="mt-3 text-[12px] text-[var(--color-silver-400)] leading-relaxed">
          Changes are immediate. The user does not need to log out and back
          in - the new tier is reflected on their next page load.
        </p>
      </div>
    </div>
  );
}

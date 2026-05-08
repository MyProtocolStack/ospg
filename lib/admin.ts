/**
 * Admin email allowlist. Server-side only.
 *
 * Routes that need admin gating (e.g. /dashboard/admin, the
 * org-upgrade API) check the caller's auth email against this list.
 *
 * Storage: comma-separated env var ADMIN_EMAILS, lowercase.
 * Falls back to a hard-coded founder list so the gate works even
 * before the env var is set on Vercel.
 */

// Hard-coded fallback - the founders + the developer running ops.
// Production should set ADMIN_EMAILS in Vercel and the env var will
// override / replace this list.
const FALLBACK_ADMIN_EMAILS: ReadonlyArray<string> = [
  "oceanstateprotectiongroup@gmail.com",
];

function getAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) {
    return [...FALLBACK_ADMIN_EMAILS];
  }
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns true if the given email belongs to an admin.
 * Case-insensitive. Returns false for null/empty.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = getAllowlist();
  return allow.includes(email.toLowerCase());
}

/**
 * Lead-magnet email capture (exit-intent popup, blog gates, etc.)
 *
 * POST /api/lead-magnet
 * Body: { email, source?, lead_magnet?, notes? }
 *
 * Inserts into the existing `leads` table via service role. The leads
 * table has RLS enabled with no public policies, so writes only work
 * with the service-role key.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string; lead_magnet?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source, lead_magnet, notes } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (email.length > 255) {
    return NextResponse.json({ error: "Email too long" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If env not configured (preview / local without secrets), accept the
  // submission silently so the UI can still confirm to the user. We log
  // for visibility.
  if (!supabaseUrl || !serviceKey) {
    console.warn(
      "lead-magnet: Supabase not configured, skipping insert for",
      email
    );
    return NextResponse.json({ ok: true });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const finalSource = source || "exit_intent_popup";
  const finalNotes = lead_magnet
    ? `Lead magnet requested: ${lead_magnet}${notes ? ` | ${notes}` : ""}`
    : notes || null;

  const { error } = await admin.from("leads").insert({
    name: email.split("@")[0],
    email: email.toLowerCase().trim(),
    org: "(unknown - lead magnet)",
    source: finalSource,
    notes: finalNotes,
  });

  if (error) {
    console.error("lead-magnet insert failed:", error.message);
    // Don't leak DB errors to the client. Confirm submission anyway -
    // we'd rather the user feel acknowledged than blocked. We'll see
    // the error in Vercel logs and reach out manually if needed.
  }

  return NextResponse.json({ ok: true });
}

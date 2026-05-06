/**
 * Walkthrough request submission.
 * POST /api/walkthrough
 *
 * Captures inquiry without requiring an account. Stores in Supabase via
 * service-role (anonymous public lead). Future: also email the founders
 * via Resend.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, org, type, notes } = body;

  if (!name || !email || !org) {
    return NextResponse.json(
      { error: "Name, email, and organization are required" },
      { status: 400 }
    );
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Lazy admin client - only run at request time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Insert into a leads table - create if needed.
    // Schema: id uuid, name text, email text, phone text, org text, type text, notes text, source text, created_at timestamptz
    await admin.from("leads").insert({
      name,
      email,
      phone: phone || null,
      org,
      type: type || "other",
      notes: notes || null,
      source: "walkthrough_form",
    });
  }

  // TODO: send transactional email via Resend to founders + confirmation to user

  return NextResponse.json({ ok: true });
}

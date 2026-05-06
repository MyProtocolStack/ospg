/**
 * Security detail booking endpoint.
 *
 * POST /api/bookings
 * Body: { start_at, end_at, officer_count, threat_level, location, description, notes }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate
  if (!body.start_at || !body.end_at) {
    return NextResponse.json({ error: "Start and end required" }, { status: 400 });
  }
  const start = new Date(body.start_at);
  const end = new Date(body.end_at);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }
  if (end <= start) {
    return NextResponse.json({ error: "End must be after start" }, { status: 400 });
  }

  // Look up user's primary org
  const { data: m } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!m?.org_id) {
    return NextResponse.json(
      { error: "No org associated with user. Complete signup first." },
      { status: 400 }
    );
  }

  const hours = (end.getTime() - start.getTime()) / 3_600_000;
  const ratePerHour =
    body.threat_level === "high" || body.threat_level === "critical" ? 25000 : 20000;
  const total = Math.round(hours * ratePerHour) * (body.officer_count || 1);

  const { data, error } = await supabase
    .from("detail_bookings")
    .insert({
      org_id: m.org_id,
      requested_by: user.id,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      hours: Number(hours.toFixed(2)),
      rate_per_hour: ratePerHour,
      total_amount: total,
      officer_count: body.officer_count || 1,
      threat_level: body.threat_level || "low",
      location_address: body.location || null,
      event_description: body.description || null,
      notes: body.notes || null,
      status: "requested",
    })
    .select()
    .single();

  if (error) {
    console.error("Booking insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}

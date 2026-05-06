/**
 * Stripe Customer Portal — let customers manage subscription, invoices, payment methods.
 *
 * POST /api/stripe/portal
 * Returns: { url } - redirect URL to portal
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up Stripe customer for this user via their org
  const { data: memberships } = await supabase
    .from("memberships")
    .select("org_id, orgs ( stripe_customer_id )")
    .eq("user_id", user.id)
    .limit(1);
  const customerId =
    (memberships?.[0]?.orgs as { stripe_customer_id?: string } | null | undefined)?.stripe_customer_id;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer for this account" },
      { status: 404 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Portal failed" },
      { status: 500 }
    );
  }
}

/**
 * Stripe Checkout Session creator.
 *
 * POST /api/stripe/checkout
 * Body: { tier_slug: string }
 * Returns: { url: string } - redirect URL to Stripe Checkout
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, priceForTier } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tier_slug } = await request.json();
  if (!tier_slug) {
    return NextResponse.json({ error: "tier_slug required" }, { status: 400 });
  }

  const pricing = priceForTier(tier_slug);
  if (!pricing) {
    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: pricing.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: pricing.priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        tier_slug,
      },
      subscription_data:
        pricing.mode === "subscription"
          ? {
              metadata: {
                user_id: user.id,
                tier_slug,
              },
            }
          : undefined,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}

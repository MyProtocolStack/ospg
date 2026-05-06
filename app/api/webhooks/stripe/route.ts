/**
 * Stripe webhook handler.
 *
 * Configure in Stripe Dashboard:
 *   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.paid, invoice.payment_failed
 *   Endpoint: https://YOUR_DOMAIN/api/webhooks/stripe
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lazy admin client (avoid running at build time when env vars may be empty)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars not configured");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tierSlug = session.metadata?.tier_slug;
        if (!userId || !tierSlug) break;

        if (session.mode === "subscription" && session.subscription) {
          // Find user's primary org and set subscription / customer ids
          const { data: m } = await getSupabaseAdmin()
            .from("memberships")
            .select("org_id")
            .eq("user_id", userId)
            .limit(1)
            .maybeSingle();
          if (m?.org_id) {
            await getSupabaseAdmin()
              .from("orgs")
              .update({
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                plan: tierSlug.includes("subscriber") ? "subscriber" : "shield",
              })
              .eq("id", m.org_id);
          }
        }

        if (session.mode === "payment" && tierSlug.startsWith("course-")) {
          const courseSlug = tierSlug.replace("course-", "");
          const { data: course } = await getSupabaseAdmin()
            .from("courses")
            .select("id")
            .eq("slug", courseSlug)
            .maybeSingle();
          if (course?.id) {
            await getSupabaseAdmin().from("course_purchases").insert({
              user_id: userId,
              course_id: course.id,
              stripe_payment_id: session.payment_intent as string,
              amount_usd: session.amount_total ?? 0,
            });
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        const { data: m } = await getSupabaseAdmin()
          .from("memberships")
          .select("org_id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();
        if (m?.org_id) {
          const newPlan =
            sub.status === "active" || sub.status === "trialing" ? "subscriber" : "free";
          await getSupabaseAdmin().from("orgs").update({ plan: newPlan }).eq("id", m.org_id);
        }
        break;
      }

      case "invoice.payment_failed": {
        // Could trigger email here via Resend
        break;
      }
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

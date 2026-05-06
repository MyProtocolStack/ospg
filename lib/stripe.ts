/**
 * Stripe server client + product config.
 *
 * Set STRIPE_SECRET_KEY in .env.local (test mode for dev, live mode for prod).
 */
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  // SDK uses its bundled default; pin to a version once confirmed in dashboard
  typescript: true,
});

/**
 * Product/Price IDs from Stripe Dashboard.
 * Create these in Stripe Dashboard → Products, then paste IDs here OR load
 * from env. For initial development, use test-mode IDs.
 */
export const STRIPE_PRICES = {
  // Subscription tiers
  subscriber_monthly: process.env.STRIPE_PRICE_SUBSCRIBER_MONTHLY || "price_subscriber_monthly_test",
  subscriber_yearly: process.env.STRIPE_PRICE_SUBSCRIBER_YEARLY || "price_subscriber_yearly_test",

  // One-time purchases
  shield_assessment: process.env.STRIPE_PRICE_SHIELD || "price_shield_assessment_test",

  // Course one-time purchases (slug-keyed)
  course_threat_assessment: process.env.STRIPE_PRICE_COURSE_THREAT || "price_course_threat_test",
  course_shelter_in_place: process.env.STRIPE_PRICE_COURSE_SHELTER || "price_course_shelter_test",
} as const;

export type StripeMode = "subscription" | "payment";

/**
 * Map our internal "tier slug" to a Stripe price + checkout mode.
 */
export function priceForTier(slug: string): { priceId: string; mode: StripeMode } | null {
  switch (slug) {
    case "subscriber":
      return { priceId: STRIPE_PRICES.subscriber_monthly, mode: "subscription" };
    case "subscriber-yearly":
      return { priceId: STRIPE_PRICES.subscriber_yearly, mode: "subscription" };
    case "shield":
      return { priceId: STRIPE_PRICES.shield_assessment, mode: "payment" };
    case "course-threat-assessment-fundamentals":
      return { priceId: STRIPE_PRICES.course_threat_assessment, mode: "payment" };
    case "course-shelter-in-place-protocols":
      return { priceId: STRIPE_PRICES.course_shelter_in_place, mode: "payment" };
    default:
      return null;
  }
}

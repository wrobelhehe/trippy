import Stripe from "stripe";
import { headers } from "next/headers";

import { createAdminClient } from "@/lib/supabase/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID ?? "";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }

  return stripeClient;
}

export function getPremiumPriceId() {
  if (!premiumPriceId) {
    throw new Error("Missing STRIPE_PREMIUM_PRICE_ID.");
  }

  return premiumPriceId;
}

export function getBaseUrl() {
  const origin = headers().get("origin");
  return origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function getOrCreateCustomerId({
  userId,
  email,
}: {
  userId: string;
  email?: string | null;
}) {
  const supabaseAdmin = createAdminClient();
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (data?.stripe_customer_id) {
    return data.stripe_customer_id;
  }

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });

  await supabaseAdmin.from("subscriptions").upsert(
    {
      owner_id: userId,
      stripe_customer_id: customer.id,
      status: "incomplete",
    },
    { onConflict: "owner_id" }
  );

  return customer.id;
}

export async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription
) {
  const supabaseAdmin = createAdminClient();
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const planKey = subscription.items.data[0]?.price?.id ?? null;
  const payload = {
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
    plan_key: planKey,
    status: subscription.status,
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  };

  const ownerId = subscription.metadata?.userId;

  if (ownerId) {
    await supabaseAdmin.from("subscriptions").upsert(
      {
        owner_id: ownerId,
        ...payload,
      },
      { onConflict: "owner_id" }
    );
    return;
  }

  await supabaseAdmin
    .from("subscriptions")
    .update(payload)
    .eq("stripe_customer_id", stripeCustomerId);
}
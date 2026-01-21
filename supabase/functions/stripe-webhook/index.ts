import Stripe from "npm:stripe@16.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function upsertSubscription(subscription: Stripe.Subscription) {
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
    await supabase.from("subscriptions").upsert(
      {
        owner_id: ownerId,
        ...payload,
      },
      { onConflict: "owner_id" }
    );
    return;
  }

  await supabase
    .from("subscriptions")
    .update(payload)
    .eq("stripe_customer_id", stripeCustomerId);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!webhookSecret || !stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
    return new Response("Missing Stripe or Supabase configuration", {
      status: 500,
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Invalid signature",
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (existing) {
    return Response.json({ received: true });
  }

  await supabase.from("stripe_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event,
  });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
        );

        if (session.metadata?.userId) {
          await stripe.subscriptions.update(subscription.id, {
            metadata: {
              userId: session.metadata.userId,
            },
          });
        }

        await upsertSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
});
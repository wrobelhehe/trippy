import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getBaseUrl, getStripeClient } from "@/lib/stripe/server";

export async function POST() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("owner_id", data.user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer found." },
      { status: 400 }
    );
  }

  const stripe = getStripeClient();
  const baseUrl = await getBaseUrl();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${baseUrl}/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal session error:", error);
    return NextResponse.json(
      { error: "Unable to create billing portal session." },
      { status: 500 }
    );
  }
}

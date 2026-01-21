import { NextResponse } from "next/server";

import { logAuditEvent } from "@/lib/observability/audit";
import { createClient } from "@/lib/supabase/server";
import {
  getBaseUrl,
  getOrCreateCustomerId,
  getPremiumPriceId,
  getStripeClient,
} from "@/lib/stripe/server";

export async function POST() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeClient();
  const customerId = await getOrCreateCustomerId({
    userId: data.user.id,
    email: data.user.email,
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: getPremiumPriceId(), quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${getBaseUrl()}/billing?checkout=success`,
    cancel_url: `${getBaseUrl()}/billing?checkout=cancel`,
    metadata: {
      userId: data.user.id,
    },
  });

  await logAuditEvent({
    eventType: "stripe.checkout.started",
    entityType: "subscription",
    entityId: session.id,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe session missing URL." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
import { cache } from "react"

import { getPremiumPriceId, getStripeClient } from "@/lib/stripe/server"

export type PlanPrice = {
  amount: number | null
  currency: string | null
  interval: string | null
  intervalCount: number | null
}

export const getPremiumPlanPrice = cache(async (): Promise<PlanPrice | null> => {
  try {
    const stripe = getStripeClient()
    const price = await stripe.prices.retrieve(getPremiumPriceId())
    return {
      amount: price.unit_amount ?? null,
      currency: price.currency ?? null,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
    }
  } catch {
    return null
  }
})

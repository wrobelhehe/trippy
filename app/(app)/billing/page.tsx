import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingActions } from "@/components/billing/BillingActions";
import { getEntitlements } from "@/lib/entitlements/entitlements";
import { getPremiumPlanPrice } from "@/lib/stripe/pricing";

export default async function BillingPage() {
  const [entitlements, premiumPrice] = await Promise.all([
    getEntitlements(),
    getPremiumPlanPrice(),
  ]);

  const priceLabel =
    premiumPrice?.amount && premiumPrice.currency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: premiumPrice.currency.toUpperCase(),
        }).format(premiumPrice.amount / 100)
      : "Premium";
  const premiumDisplay = priceLabel === "Premium" ? "Premium" : priceLabel;
  const intervalLabel = premiumPrice?.interval
    ? `/${premiumPrice.intervalCount && premiumPrice.intervalCount > 1 ? `${premiumPrice.intervalCount} ` : ""}${premiumPrice.interval}`
    : "/month";
  const upgradeCopy =
    priceLabel === "Premium"
      ? "Unlock premium features with pricing shown at checkout."
      : `Unlock premium features for ${priceLabel} ${intervalLabel}.`;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--panel)]/85 px-6 py-8 shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.18),_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-[radial-gradient(circle_at_top,_rgba(243,161,95,0.2),_transparent_70%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
              Billing
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Premium plan control center
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Track your plan status, update payment details, and keep access
                to sharing tools unlocked.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {entitlements.isPremium ? "Premium" : "Free"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Shine asChild color="rgba(59,211,199,0.3)" enableOnHover opacity={0.2}>
          <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Current plan</CardTitle>
                <Badge variant={entitlements.isPremium ? "default" : "secondary"}>
                  {entitlements.isPremium ? "Premium" : "Free"}
                </Badge>
              </div>
              <CardDescription>
                {entitlements.isPremium
                  ? "You have full access to premium features and higher limits."
                  : "Upgrade anytime to unlock premium features and higher limits."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">
                  {entitlements.isPremium ? premiumDisplay : "$0"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {entitlements.isPremium ? intervalLabel : "/month"}
                </span>
              </div>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Unlimited share links with privacy controls.
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  AI-assisted trip drafts and ticket imports.
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Priority access to upcoming sharing features.
                </li>
              </ul>
              {entitlements.currentPeriodEnd ? (
                <p className="text-xs text-muted-foreground">
                  Current period ends on{" "}
                  {new Date(entitlements.currentPeriodEnd).toLocaleDateString()}.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </Shine>

        <Shine asChild color="rgba(243,161,95,0.3)" enableOnHover opacity={0.2}>
          <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">
                {entitlements.isPremium ? "Manage plan" : "Upgrade to Premium"}
              </CardTitle>
              <CardDescription>
                {entitlements.isPremium
                  ? "Update payment details or cancel from the billing portal."
                  : upgradeCopy}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingActions isPremium={entitlements.isPremium} />
            </CardContent>
          </Card>
        </Shine>
      </div>
    </div>
  );
}

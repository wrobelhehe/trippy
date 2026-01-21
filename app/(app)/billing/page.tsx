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

export default async function BillingPage() {
  const entitlements = await getEntitlements();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Premium membership</CardTitle>
            <Badge variant={entitlements.isPremium ? "default" : "secondary"}>
              {entitlements.isPremium ? "Active" : "Free"}
            </Badge>
          </div>
          <CardDescription>
            Unlock curated share assets, AI trip drafts, and higher media limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
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
              Custom share assets without watermarking.
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

      <Card className="border border-black/5 bg-white/70 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Manage billing</CardTitle>
          <CardDescription>
            Upgrade anytime. You can cancel from the billing portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingActions isPremium={entitlements.isPremium} />
        </CardContent>
      </Card>
    </div>
  );
}
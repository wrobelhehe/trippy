import { createClient } from "@/lib/supabase/server";

export type Entitlements = {
  isPremium: boolean;
  planKey: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
};

const premiumStatuses = new Set(["active", "trialing"]);

export async function getEntitlements(): Promise<Entitlements> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return {
      isPremium: false,
      planKey: null,
      status: null,
      currentPeriodEnd: null,
    };
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("plan_key,status,current_period_end")
    .eq("owner_id", auth.user.id)
    .maybeSingle();

  const status = data?.status ?? null;

  return {
    isPremium: status ? premiumStatuses.has(status) : false,
    planKey: data?.plan_key ?? null,
    status,
    currentPeriodEnd: data?.current_period_end ?? null,
  };
}

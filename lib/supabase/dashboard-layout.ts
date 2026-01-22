import {
  DEFAULT_DASHBOARD_LAYOUT,
  normalizeDashboardLayout,
  type DashboardLayoutItem,
} from "@/lib/dashboard/layout";
import { createClient } from "@/lib/supabase/server";

export async function getDashboardLayout(): Promise<DashboardLayoutItem[]> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return DEFAULT_DASHBOARD_LAYOUT;
  }

  const { data: layoutRow, error } = await supabase
    .from("dashboard_layouts")
    .select("layout")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (error || !layoutRow?.layout) {
    return DEFAULT_DASHBOARD_LAYOUT;
  }

  return normalizeDashboardLayout(layoutRow.layout);
}

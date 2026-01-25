import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { getProfile } from "@/lib/supabase/profile";

export default async function ProfilePage() {
  const profile = await getProfile();

  return <SettingsTabs profile={profile} />;
}

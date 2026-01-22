import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { listShareLinks } from "@/lib/share/share-links";
import { getProfile } from "@/lib/supabase/profile";

export default async function ProfilePage() {
  const [profile, profileLinks] = await Promise.all([
    getProfile(),
    listShareLinks({ scope: "profile" }),
  ]);

  return <SettingsTabs profile={profile} profileLinks={profileLinks} />;
}

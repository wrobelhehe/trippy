import { AppShell } from "@/components/navigation/AppShell"
import { ProfileSetupGate } from "@/components/settings/ProfileSetupGate"
import { signOut } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/server"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  let profile: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    display_name: string | null
  } | null = null

  if (user) {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, display_name")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    profile = profileData
  }

  const needsProfile =
    Boolean(user) && (!profile?.first_name || !profile?.last_name)

  if (needsProfile) {
    return (
      <ProfileSetupGate
        email={user?.email ?? null}
        avatarUrl={profile?.avatar_url ?? null}
        defaultFirstName={profile?.first_name ?? null}
        defaultLastName={profile?.last_name ?? null}
      />
    )
  }

  const displayName = [profile?.first_name, profile?.last_name]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ")

  return (
    <AppShell
      userEmail={user?.email ?? "Unknown"}
      userId={user?.id ?? null}
      userName={displayName || profile?.display_name || undefined}
      userAvatarUrl={profile?.avatar_url ?? null}
      signOutAction={signOut}
    >
      {children}
    </AppShell>
  )
}

import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdateInput = Partial<Pick<
  Profile,
  "display_name" | "avatar_url" | "bio" | "first_name" | "last_name" | "birth_date"
>>;

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

export async function getProfile() {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, bio, first_name, last_name, birth_date")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? (data as Profile) : null;
}

export async function updateProfile(input: ProfileUpdateInput) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId)
    .select("id, display_name, avatar_url, bio, first_name, last_name, birth_date")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

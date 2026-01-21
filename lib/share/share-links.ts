import { createClient } from "@/lib/supabase/server";
import { generateShareToken, hashShareToken } from "@/lib/share/tokens";

export type ShareLink = {
  id: string;
  owner_id: string;
  scope: "trip" | "profile";
  trip_id: string | null;
  token_hash: string;
  privacy_overrides: Record<string, unknown>;
  created_at: string;
  revoked_at: string | null;
  expires_at: string | null;
};

export type CreateShareLinkInput = {
  scope: "trip" | "profile";
  tripId?: string | null;
  privacyOverrides?: Record<string, unknown>;
  expiresAt?: string | null;
};

async function requireUserId() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

export async function listShareLinks({
  tripId,
  scope,
}: {
  tripId?: string;
  scope?: "trip" | "profile";
} = {}) {
  const { supabase } = await requireUserId();
  let query = supabase.from("share_links").select("*").order("created_at", {
    ascending: false,
  });

  if (tripId) {
    query = query.eq("trip_id", tripId);
  }

  if (scope) {
    query = query.eq("scope", scope);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ShareLink[];
}

export async function createShareLink(input: CreateShareLinkInput) {
  const { supabase, userId } = await requireUserId();
  const token = generateShareToken();
  const tokenHash = hashShareToken(token);

  const payload = {
    owner_id: userId,
    scope: input.scope,
    trip_id: input.tripId ?? null,
    token_hash: tokenHash,
    privacy_overrides: input.privacyOverrides ?? {},
    expires_at: input.expiresAt ?? null,
  };

  const { data, error } = await supabase
    .from("share_links")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { shareLink: data as ShareLink, token };
}

export async function revokeShareLink(shareLinkId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("share_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", shareLinkId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function rotateShareLink(shareLinkId: string) {
  const { supabase } = await requireUserId();
  const token = generateShareToken();
  const tokenHash = hashShareToken(token);

  const { data, error } = await supabase
    .from("share_links")
    .update({ token_hash: tokenHash, revoked_at: null })
    .eq("id", shareLinkId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { shareLink: data as ShareLink, token };
}
import { createClient } from "@/lib/supabase/server";

export type Media = {
  id: string;
  owner_id: string;
  media_type: "image" | "video";
  storage_bucket: string;
  storage_path: string;
  thumb_path: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  size_bytes: number | null;
  created_at: string;
};

export type CreateMediaInput = {
  mediaType: "image" | "video";
  storageBucket: string;
  storagePath: string;
  thumbPath?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  sizeBytes?: number | null;
};

async function requireUserId() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

export async function createMedia(input: CreateMediaInput) {
  const { supabase, userId } = await requireUserId();
  const payload = {
    owner_id: userId,
    media_type: input.mediaType,
    storage_bucket: input.storageBucket,
    storage_path: input.storagePath,
    thumb_path: input.thumbPath ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    duration_seconds: input.durationSeconds ?? null,
    size_bytes: input.sizeBytes ?? null,
  };

  const { data, error } = await supabase
    .from("media")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Media;
}

export async function attachMediaToTrip(tripId: string, mediaId: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from("trip_media").insert({
    trip_id: tripId,
    media_id: mediaId,
    owner_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function attachMediaToMoment(momentId: string, mediaId: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from("moment_media").insert({
    moment_id: momentId,
    media_id: mediaId,
    owner_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listTripMedia(tripId: string) {
  const { supabase } = await requireUserId();
  const { data, error } = await supabase
    .from("trip_media")
    .select("media:media_id (*)")
    .eq("trip_id", tripId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => item.media) as Media[];
}

export async function listMomentMedia(momentId: string) {
  const { supabase } = await requireUserId();
  const { data, error } = await supabase
    .from("moment_media")
    .select("media:media_id (*)")
    .eq("moment_id", momentId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => item.media) as Media[];
}
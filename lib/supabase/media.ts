import { createClient } from "@/lib/supabase/server";

export type Media = {
  id: string;
  owner_id: string;
  media_type: "image" | "video";
  storage_bucket: string;
  storage_path: string;
  thumb_path: string | null;
  public_url?: string | null;
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
  const supabase = await createClient();
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
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("id", tripId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (tripError || !trip) {
    throw new Error("Trip not found.");
  }

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
  const { data: moment, error: momentError } = await supabase
    .from("moments")
    .select("id")
    .eq("id", momentId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (momentError || !moment) {
    throw new Error("Moment not found.");
  }

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
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("trip_media")
    .select("media:media_id (*)")
    .eq("trip_id", tripId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((item) => {
      const mediaValue = item.media as unknown as Media | Media[] | null;
      const media = Array.isArray(mediaValue) ? mediaValue[0] ?? null : mediaValue;
      if (!media) {
        return null;
      }
      const { data: publicUrl } = supabase.storage
        .from(media.storage_bucket)
        .getPublicUrl(media.storage_path);
      return {
        ...media,
        public_url: publicUrl.publicUrl ?? null,
      };
    })
    .filter((item): item is Media => Boolean(item));
}

export async function listMomentMedia(momentId: string) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("moment_media")
    .select("media:media_id (*)")
    .eq("moment_id", momentId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((item) => {
      const mediaValue = item.media as unknown as Media | Media[] | null;
      const media = Array.isArray(mediaValue) ? mediaValue[0] ?? null : mediaValue;
      if (!media) {
        return null;
      }
      const { data: publicUrl } = supabase.storage
        .from(media.storage_bucket)
        .getPublicUrl(media.storage_path);
      return {
        ...media,
        public_url: publicUrl.publicUrl ?? null,
      };
    })
    .filter((item): item is Media => Boolean(item));
}

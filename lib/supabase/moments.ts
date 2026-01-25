import { createClient } from "@/lib/supabase/server";
import type { Media } from "@/lib/supabase/media";

export type Moment = {
  id: string;
  trip_id: string;
  owner_id: string;
  title: string | null;
  content_text: string;
  moment_timestamp: string | null;
  order_index: number | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MomentWithMedia = Moment & {
  media: Media[];
};

export type CreateMomentInput = {
  title?: string | null;
  contentText: string;
  momentTimestamp?: string | null;
  orderIndex?: number | null;
  lat?: number | null;
  lng?: number | null;
};

export type UpdateMomentInput = Partial<CreateMomentInput>;

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

export async function listMoments(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("moments")
    .select("*")
    .eq("trip_id", tripId)
    .eq("owner_id", userId)
    .is("deleted_at", null)
    .order("moment_timestamp", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Moment[];
}

export async function listMomentsWithMedia(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { data: moments, error: momentsError } = await supabase
    .from("moments")
    .select("*")
    .eq("trip_id", tripId)
    .eq("owner_id", userId)
    .is("deleted_at", null)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (momentsError) {
    throw new Error(momentsError.message);
  }

  const momentRows = (moments ?? []) as Moment[];
  const momentIds = momentRows.map((moment) => moment.id);

  if (!momentIds.length) {
    return [];
  }

  const { data: momentMedia, error: momentMediaError } = await supabase
    .from("moment_media")
    .select("moment_id, order_index, media:media_id (*)")
    .in("moment_id", momentIds)
    .eq("owner_id", userId);

  if (momentMediaError) {
    throw new Error(momentMediaError.message);
  }

  const mediaWithUrl = await Promise.all(
    (momentMedia ?? []).map(async (row) => {
      const mediaValue = row.media as unknown as Media | Media[] | null;
      const media = Array.isArray(mediaValue)
        ? mediaValue[0] ?? null
        : mediaValue;
      if (!media) {
        return null;
      }

      const path = media.thumb_path ?? media.storage_path;
      const { data } = await supabase.storage
        .from(media.storage_bucket)
        .createSignedUrl(path, 60 * 60);
      const withUrl = {
        ...media,
        public_url: data?.signedUrl ?? null,
      };

      return {
        moment_id: row.moment_id,
        order_index: row.order_index,
        media: withUrl,
      };
    })
  );

  const mediaByMoment: Record<string, Array<{ order: number; media: Media }>> = {};
  mediaWithUrl.forEach((row) => {
    if (!row) return;
    if (!mediaByMoment[row.moment_id]) {
      mediaByMoment[row.moment_id] = [];
    }
    const order =
      typeof row.order_index === "number" ? row.order_index : Number.MAX_SAFE_INTEGER;
    mediaByMoment[row.moment_id].push({ order, media: row.media });
  });

  return momentRows.map((moment) => ({
    ...moment,
    media: (mediaByMoment[moment.id] ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item) => item.media),
  }));
}

export async function createMoment(tripId: string, input: CreateMomentInput) {
  const { supabase, userId } = await requireUserId();
  const payload = {
    trip_id: tripId,
    owner_id: userId,
    title: input.title ?? null,
    content_text: input.contentText,
    moment_timestamp: input.momentTimestamp ?? null,
    order_index: input.orderIndex ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
  };

  const { data, error } = await supabase
    .from("moments")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Moment;
}

export async function updateMoment(momentId: string, input: UpdateMomentInput) {
  const { supabase, userId } = await requireUserId();
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.contentText !== undefined) payload.content_text = input.contentText;
  if (input.momentTimestamp !== undefined)
    payload.moment_timestamp = input.momentTimestamp;
  if (input.orderIndex !== undefined) payload.order_index = input.orderIndex;
  if (input.lat !== undefined) payload.lat = input.lat;
  if (input.lng !== undefined) payload.lng = input.lng;

  const { data, error } = await supabase
    .from("moments")
    .update(payload)
    .eq("id", momentId)
    .eq("owner_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Moment;
}

export async function softDeleteMoment(momentId: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from("moments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", momentId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: mediaError } = await supabase
    .from("moment_media")
    .delete()
    .eq("moment_id", momentId)
    .eq("owner_id", userId);

  if (mediaError) {
    throw new Error(mediaError.message);
  }
}

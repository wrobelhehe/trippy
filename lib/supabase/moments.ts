import { createClient } from "@/lib/supabase/server";

export type Moment = {
  id: string;
  trip_id: string;
  owner_id: string;
  content_text: string;
  moment_timestamp: string | null;
  order_index: number | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CreateMomentInput = {
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

export async function createMoment(tripId: string, input: CreateMomentInput) {
  const { supabase, userId } = await requireUserId();
  const payload = {
    trip_id: tripId,
    owner_id: userId,
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
}

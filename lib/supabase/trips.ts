import { createClient } from "@/lib/supabase/server";

export type Trip = {
  id: string;
  owner_id: string;
  title: string;
  place_name: string;
  country_code: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string | null;
  end_date: string | null;
  short_description: string | null;
  cover_media_id: string | null;
  tags: string[];
  privacy_mode: "private" | "link" | "public";
  hide_exact_dates: boolean;
  moments_count: number;
  media_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type TripCountRow = Trip & {
  moments?: { count: number }[] | null;
  trip_media?: { count: number }[] | null;
};

export type CreateTripInput = {
  title: string;
  placeName: string;
  startDate?: string | null;
  endDate?: string | null;
  shortDescription?: string | null;
  coverMediaId?: string | null;
  tags?: string[];
  privacyMode?: "private" | "link" | "public";
  hideExactDates?: boolean;
  countryCode?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export type UpdateTripInput = Partial<CreateTripInput>;

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

function withTripCounts(row: TripCountRow): Trip {
  const momentsCount = Array.isArray(row.moments)
    ? row.moments[0]?.count ?? 0
    : 0;
  const mediaCount = Array.isArray(row.trip_media)
    ? row.trip_media[0]?.count ?? 0
    : 0;
  const { moments, trip_media, ...trip } = row;
  return {
    ...trip,
    moments_count: momentsCount,
    media_count: mediaCount,
  };
}

export async function listTrips({
  includeDeleted = false,
}: {
  includeDeleted?: boolean;
} = {}) {
  const { supabase, userId } = await requireUserId();
  let query = supabase
    .from("trips")
    .select("*, moments(count), trip_media(count)")
    .order("created_at", {
    ascending: false,
  });
  query = query.eq("owner_id", userId);

  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => withTripCounts(row as TripCountRow));
}

export async function getTrip(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("trips")
    .select("*, moments(count), trip_media(count)")
    .eq("id", tripId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? withTripCounts(data as TripCountRow) : null;
}

export async function createTrip(input: CreateTripInput) {
  const { supabase, userId } = await requireUserId();
  const payload = {
    owner_id: userId,
    title: input.title,
    place_name: input.placeName,
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    short_description: input.shortDescription ?? null,
    cover_media_id: input.coverMediaId ?? null,
    tags: input.tags ?? [],
    privacy_mode: input.privacyMode ?? "private",
    hide_exact_dates: input.hideExactDates ?? true,
    country_code: input.countryCode ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
  };

  const { data, error } = await supabase
    .from("trips")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Trip;
}

export async function updateTrip(tripId: string, input: UpdateTripInput) {
  const { supabase, userId } = await requireUserId();
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.placeName !== undefined) payload.place_name = input.placeName;
  if (input.startDate !== undefined) payload.start_date = input.startDate;
  if (input.endDate !== undefined) payload.end_date = input.endDate;
  if (input.shortDescription !== undefined)
    payload.short_description = input.shortDescription;
  if (input.coverMediaId !== undefined)
    payload.cover_media_id = input.coverMediaId;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.privacyMode !== undefined) payload.privacy_mode = input.privacyMode;
  if (input.hideExactDates !== undefined)
    payload.hide_exact_dates = input.hideExactDates;
  if (input.countryCode !== undefined) payload.country_code = input.countryCode;
  if (input.lat !== undefined) payload.lat = input.lat;
  if (input.lng !== undefined) payload.lng = input.lng;

  const { data, error } = await supabase
    .from("trips")
    .update(payload)
    .eq("id", tripId)
    .eq("owner_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Trip;
}

export async function softDeleteTrip(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from("trips")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", tripId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function restoreTrip(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase
    .from("trips")
    .update({ deleted_at: null })
    .eq("id", tripId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

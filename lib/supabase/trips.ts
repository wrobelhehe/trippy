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
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

export async function listTrips({
  includeDeleted = false,
}: {
  includeDeleted?: boolean;
} = {}) {
  const { supabase } = await requireUserId();
  let query = supabase.from("trips").select("*").order("created_at", {
    ascending: false,
  });

  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Trip[];
}

export async function getTrip(tripId: string) {
  const { supabase } = await requireUserId();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Trip | null;
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
  const payload = {
    owner_id: userId,
    title: input.title,
    place_name: input.placeName,
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    short_description: input.shortDescription ?? null,
    cover_media_id: input.coverMediaId ?? null,
    tags: input.tags,
    privacy_mode: input.privacyMode,
    hide_exact_dates: input.hideExactDates,
    country_code: input.countryCode,
    lat: input.lat,
    lng: input.lng,
  };

  const { data, error } = await supabase
    .from("trips")
    .update(payload)
    .eq("id", tripId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Trip;
}

export async function softDeleteTrip(tripId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("trips")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", tripId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function restoreTrip(tripId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase
    .from("trips")
    .update({ deleted_at: null })
    .eq("id", tripId);

  if (error) {
    throw new Error(error.message);
  }
}
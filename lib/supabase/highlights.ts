import { createClient } from "@/lib/supabase/server";

type TripHighlightRow = {
  id: string;
  highlight_items: unknown;
};

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: data.user.id };
}

function normalizeHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function prepareHighlights(items: string[]) {
  const normalized = normalizeHighlights(items);

  if (normalized.length < 3 || normalized.length > 7) {
    throw new Error("Highlights must include between 3 and 7 items.");
  }

  return normalized;
}

export async function getTripHighlights(tripId: string) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("trip_highlights")
    .select("id, highlight_items")
    .eq("trip_id", tripId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeHighlights((data as TripHighlightRow).highlight_items) : [];
}

export async function saveTripHighlights(tripId: string, items: string[]) {
  const { supabase, userId } = await requireUserId();
  const payload = {
    trip_id: tripId,
    owner_id: userId,
    highlight_items: prepareHighlights(items),
  };

  const { data: existing, error: findError } = await supabase
    .from("trip_highlights")
    .select("id")
    .eq("trip_id", tripId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (findError) {
    throw new Error(findError.message);
  }

  if (existing?.id) {
    const { error } = await supabase
      .from("trip_highlights")
      .update({ highlight_items: payload.highlight_items })
      .eq("id", existing.id)
      .eq("owner_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("trip_highlights").insert(payload);

    if (error) {
      throw new Error(error.message);
    }
  }

  return payload.highlight_items;
}

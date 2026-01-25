import { notFound } from "next/navigation";

import { TripStoryEditor } from "@/components/trips/TripStoryEditor";
import type { StoryEntry } from "@/components/trips/TripStoryPresentation";
import { listMomentsWithMedia } from "@/lib/supabase/moments";
import { getTrip } from "@/lib/supabase/trips";

export default async function TripDetailEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  const moments = await listMomentsWithMedia(trip.id);
  const entries: StoryEntry[] = moments.map((moment) => ({
    id: moment.id,
    title: moment.title,
    description: moment.content_text,
    media: moment.media.map((media) => ({
      id: media.id,
      mediaType: media.media_type,
      url: media.public_url ?? null,
    })),
  }));

  return <TripStoryEditor trip={trip} entries={entries} />;
}

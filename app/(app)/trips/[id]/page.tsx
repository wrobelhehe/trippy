import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { SimpleShareLink } from "@/components/share/SimpleShareLink";
import {
  TripStoryPresentation,
  type StoryEntry,
} from "@/components/trips/TripStoryPresentation";
import { Button } from "@/components/ui/button";
import type { GlobePin } from "@/components/globe/GlobePins";
import { listMomentsWithMedia } from "@/lib/supabase/moments";
import { getTrip } from "@/lib/supabase/trips";

export default async function TripPreviewPage({
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

  const hasCoordinates = trip.lat !== null && trip.lng !== null;
  const pins: GlobePin[] = hasCoordinates
    ? [
        {
          id: trip.id,
          lat: trip.lat ?? 0,
          lng: trip.lng ?? 0,
          title: trip.title,
          placeName: trip.place_name,
          momentsCount: trip.moments_count,
          mediaCount: trip.media_count,
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Button asChild className="gap-2">
          <Link href={`/trips/${trip.id}/edit`}>
            Edit trip
            <Pencil className="size-4" />
          </Link>
        </Button>
      </div>
      <TripStoryPresentation
        title={trip.title}
        city={trip.place_name}
        countryCode={trip.country_code ?? null}
        startDate={trip.start_date}
        endDate={trip.end_date}
        preset={(trip.story_preset ?? "postcards") as
          | "postcards"
          | "album"
          | "carousel"
          | "collage"
          | "cinematic"
          | "journal"}
        entries={entries}
        globePins={pins}
        focusPinId={hasCoordinates ? trip.id : null}
        label="Trip story"
        fullBleed
      />

      <SimpleShareLink
        scope="trip"
        tripId={trip.id}
        title="Share this trip"
        description="One tap creates a shareable link for this story."
        ctaLabel="Create share link"
      />
    </div>
  );
}

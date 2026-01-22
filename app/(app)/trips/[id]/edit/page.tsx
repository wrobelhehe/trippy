import { notFound } from "next/navigation";
import { NotebookPen } from "lucide-react";

import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight";
import { GlobeShowcase } from "@/components/globe/GlobeShowcase";
import type { GlobePin } from "@/components/globe/GlobePins";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TripStats } from "@/components/trips/TripStats";
import { MomentForm } from "@/components/trips/MomentForm";
import { TripHighlightsPanel } from "@/components/trips/TripHighlightsPanel";
import { TripPrivacyControl } from "@/components/trips/TripPrivacyControl";
import { TripShowcaseHeader } from "@/components/trips/TripShowcaseHeader";
import { MediaGallery } from "@/components/media/MediaGallery";
import { UploadDropzone } from "@/components/media/UploadDropzone";
import { SharePanel } from "@/components/trips/SharePanel";
import { Separator } from "@/components/ui/separator";
import { getTripHighlights } from "@/lib/supabase/highlights";
import { listMoments } from "@/lib/supabase/moments";
import { listTripMedia } from "@/lib/supabase/media";
import { getTrip } from "@/lib/supabase/trips";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatDateRange = (startDate: string | null, endDate: string | null) => {
  const start = startDate ? formatter.format(new Date(startDate)) : null;
  const end = endDate ? formatter.format(new Date(endDate)) : null;

  if (start && end) {
    return `${start} — ${end}`;
  }

  return start ?? end;
};

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

  const [moments, media, highlights] = await Promise.all([
    listMoments(trip.id),
    listTripMedia(trip.id),
    getTripHighlights(trip.id),
  ]);

  const durationDays =
    trip.start_date && trip.end_date
      ? Math.max(
          1,
          Math.round(
            (new Date(trip.end_date).getTime() -
              new Date(trip.start_date).getTime()) /
              86_400_000
          ) + 1
        )
      : null;
  const hasCoordinates = trip.lat !== null && trip.lng !== null;
  const pins: GlobePin[] = hasCoordinates
    ? [
        {
          id: trip.id,
          lat: trip.lat ?? 0,
          lng: trip.lng ?? 0,
          title: trip.title,
          placeName: trip.place_name,
          momentsCount: moments.length,
          mediaCount: media.length,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-[0_35px_80px_rgba(6,10,16,0.55)] backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">Trip globe</CardTitle>
          <CardDescription>
            Drag to explore the location pinned on the globe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/80">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.2),_transparent_65%)]" />
            <div className="relative h-[320px] md:h-[380px]">
              <GlobeShowcase
                pins={pins}
                showLabels
                focusPinId={hasCoordinates ? trip.id : null}
                controlsEnabled
                showTripLink={false}
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              {hasCoordinates ? "Drag to rotate" : "No location pinned"}
            </div>
          </div>
        </CardContent>
      </Card>

      <TripShowcaseHeader
        title={trip.title}
        placeName={trip.place_name}
        dateLabel={formatDateRange(trip.start_date, trip.end_date)}
        shortDescription={trip.short_description}
        tags={trip.tags}
        tagPlaceholder="Add tags in trip settings"
        kicker="Trip edit"
        footerSlot={(
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Dates
              </p>
              <p className="text-base font-semibold text-white">
                {formatDateRange(trip.start_date, trip.end_date) ?? "Dates TBD"}
              </p>
              {durationDays ? (
                <p className="text-xs text-muted-foreground">
                  {durationDays} days total
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Country
              </p>
              <p className="text-base font-semibold text-white">
                {trip.country_code
                  ? `Country ${trip.country_code.toUpperCase()}`
                  : "Location masked"}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasCoordinates
                  ? `${trip.lat?.toFixed(2)}°, ${trip.lng?.toFixed(2)}°`
                  : "Not pinned"}
              </p>
            </div>
          </div>
        )}
        rightSlot={
          <>
            <TripStats
              moments={moments.length}
              media={media.length}
              privacyMode={trip.privacy_mode}
            />
            <TripPrivacyControl tripId={trip.id} value={trip.privacy_mode} />
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Highlights</CardTitle>
            <CardDescription>
              Pick 3-7 lines that define this journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripHighlightsPanel
              tripId={trip.id}
              initialHighlights={highlights}
            />
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Moments</CardTitle>
            <CardDescription>
              Add notes, timestamps, and locations for this trip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MomentForm tripId={trip.id} />
            <Separator className="bg-white/10" />
            {moments.length === 0 ? (
              <EmptyState
                icon={NotebookPen}
                title="No moments yet"
                description="Add your first diary entry to start this timeline."
              />
            ) : (
              <Highlight
                hover
                controlledItems
                className="rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_70%)]"
                itemsClassName="rounded-2xl"
              >
                <div className="space-y-3">
                  {moments.map((moment) => (
                    <HighlightItem key={moment.id} asChild>
                      <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3">
                        <p className="text-sm">{moment.content_text}</p>
                        {moment.moment_timestamp ? (
                          <p className="text-xs text-muted-foreground">
                            {new Date(moment.moment_timestamp).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    </HighlightItem>
                  ))}
                </div>
              </Highlight>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">Media</CardTitle>
          <CardDescription>
            Upload photos or video clips to build the gallery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadDropzone tripId={trip.id} />
          <MediaGallery
            items={media.map((item) => ({
              id: item.id,
              mediaType: item.media_type,
              url: item.public_url ?? item.storage_path,
            }))}
          />
        </CardContent>
      </Card>

      <SharePanel tripId={trip.id} />
    </div>
  );
}

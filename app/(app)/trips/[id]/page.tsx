import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TripStats } from "@/components/trips/TripStats";
import { MomentForm } from "@/components/trips/MomentForm";
import { HighlightsEditor } from "@/components/trips/HighlightsEditor";
import { MediaGallery } from "@/components/media/MediaGallery";
import { UploadDropzone } from "@/components/media/UploadDropzone";
import { SharePanel } from "@/components/trips/SharePanel";
import { listMoments } from "@/lib/supabase/moments";
import { listTripMedia } from "@/lib/supabase/media";
import { getTrip } from "@/lib/supabase/trips";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  const [moments, media] = await Promise.all([
    listMoments(trip.id),
    listTripMedia(trip.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {trip.place_name}
        </p>
        <h1 className="text-3xl font-semibold">{trip.title}</h1>
        {trip.short_description ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {trip.short_description}
          </p>
        ) : null}
      </div>

      <TripStats
        moments={trip.moments_count}
        media={trip.media_count}
        privacyMode={trip.privacy_mode}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Moments</CardTitle>
            <CardDescription>
              Add notes, timestamps, and locations for this trip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MomentForm tripId={trip.id} />
            {moments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 text-sm text-muted-foreground">
                No moments yet. Add your first diary entry.
              </div>
            ) : (
              <div className="space-y-3">
                {moments.map((moment) => (
                  <div
                    key={moment.id}
                    className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3"
                  >
                    <p className="text-sm">{moment.content_text}</p>
                    {moment.moment_timestamp ? (
                      <p className="text-xs text-muted-foreground">
                        {new Date(moment.moment_timestamp).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Highlights</CardTitle>
              <CardDescription>
                Pick 3-7 lines that define this journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightsEditor />
            </CardContent>
          </Card>

          <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
            <CardHeader>
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
      </div>
    </div>
  );
}

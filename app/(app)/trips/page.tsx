import Link from "next/link";
import { Compass, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripsLibrary } from "@/components/trips/TripsLibrary";
import { listTrips } from "@/lib/supabase/trips";

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

export default async function TripsPage() {
  const trips = await listTrips();
  const totalMoments = trips.reduce((sum, trip) => sum + trip.moments_count, 0);
  const totalMedia = trips.reduce((sum, trip) => sum + trip.media_count, 0);
  const pinnedTrips = trips.filter(
    (trip) => trip.lat !== null && trip.lng !== null
  ).length;
  const tripSummaries = trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    placeName: trip.place_name,
    privacyMode: trip.privacy_mode,
    momentsCount: trip.moments_count,
    mediaCount: trip.media_count,
    tags: trip.tags,
    dateLabel: formatDateRange(trip.start_date, trip.end_date),
    hasPin: trip.lat !== null && trip.lng !== null,
  }));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--panel)]/85 px-6 py-8 shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,234,217,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-[radial-gradient(circle_at_top,_rgba(255,180,92,0.16),_transparent_70%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
                Trips
              </Badge>
              <span className="text-xs uppercase tracking-[0.36em] text-muted-foreground">
                Memory atlas
              </span>
            </div>
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
              Your journeys, styled like a living archive.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Browse every expedition, refresh highlights, and keep your globe
              glowing with new moments.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="gap-2">
                <Link href="/trips/new">
                  Create trip
                  <Plus className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/globe">
                  <Compass className="size-4" />
                  View globe
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg">
              <CardContent className="space-y-2 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Total trips
                </p>
                <p className="text-2xl font-semibold">{trips.length}</p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg">
              <CardContent className="space-y-2 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Pinned
                </p>
                <p className="text-2xl font-semibold">{pinnedTrips}</p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg">
              <CardContent className="space-y-2 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Moments
                </p>
                <p className="text-2xl font-semibold">{totalMoments}</p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg">
              <CardContent className="space-y-2 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Media
                </p>
                <p className="text-2xl font-semibold">{totalMedia}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TripsLibrary trips={tripSummaries} />
    </div>
  );
}

import Link from "next/link";
import {
  ArrowUpRight,
  Flag,
  Globe2,
  Image,
  MapPinned,
  NotebookPen,
  Share2,
} from "lucide-react";

import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { Tilt, TiltContent } from "@/components/animate-ui/primitives/effects/tilt";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listShareLinks } from "@/lib/share/share-links";
import { type Trip, listTrips } from "@/lib/supabase/trips";
import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statMeta = [
  {
    label: "Trips",
    helper: "Total journeys",
    icon: MapPinned,
    tone: "text-[color:var(--lagoon)]",
    panel: "bg-[linear-gradient(150deg,#111827,#0b0f14)]",
    shine: "rgba(59,211,199,0.45)",
  },
  {
    label: "Countries",
    helper: "Unique places",
    icon: Flag,
    tone: "text-[color:var(--sunrise)]",
    panel: "bg-[linear-gradient(150deg,#141d29,#0a0f15)]",
    shine: "rgba(243,161,95,0.45)",
  },
  {
    label: "Moments",
    helper: "Highlights logged",
    icon: NotebookPen,
    tone: "text-[color:var(--ember)]",
    panel: "bg-[linear-gradient(150deg,#161b24,#0b0f14)]",
    shine: "rgba(240,107,90,0.4)",
  },
  {
    label: "Media",
    helper: "Files attached",
    icon: Image,
    tone: "text-white/80",
    panel: "bg-[linear-gradient(150deg,#0f172a,#0b0f14)]",
    shine: "rgba(255,255,255,0.35)",
  },
];

const statLayout = [
  "sm:col-span-1 lg:col-span-3 xl:col-span-2",
  "sm:col-span-1 lg:col-span-3 xl:col-span-3",
  "sm:col-span-1 lg:col-span-3 xl:col-span-4",
  "sm:col-span-1 lg:col-span-3 xl:col-span-3",
];

export default async function DashboardPage() {
  const [trips, shareLinks] = await Promise.all([
    listTrips(),
    listShareLinks(),
  ]);
  const now = new Date();
  const totalTrips = trips.length;
  const countries = new Set(
    trips.map((trip) => trip.country_code).filter(Boolean)
  );
  const moments = trips.reduce((sum, trip) => sum + trip.moments_count, 0);
  const media = trips.reduce((sum, trip) => sum + trip.media_count, 0);
  const recentTrips = trips.slice(0, 4);
  const hasTrips = totalTrips > 0;

  const statValues = [totalTrips, countries.size, moments, media];

  const privacyCounts = trips.reduce(
    (acc, trip) => {
      acc[trip.privacy_mode] += 1;
      return acc;
    },
    { private: 0, link: 0, public: 0 }
  );

  type PrivacyMode = Trip["privacy_mode"];
  const privacyChartData: Array<{
    mode: PrivacyMode;
    value: number;
    fill: string;
  }> = [
    {
      mode: "private",
      value: privacyCounts.private,
      fill: "var(--color-private)",
    },
    { mode: "link", value: privacyCounts.link, fill: "var(--color-link)" },
    { mode: "public", value: privacyCounts.public, fill: "var(--color-public)" },
  ];

  const windowStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
    };
  });
  const monthCounts = new Map<string, number>();

  trips.forEach((trip) => {
    if (!trip.created_at) return;
    const date = new Date(trip.created_at);
    if (date < windowStart || date >= windowEnd) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  });

  const tripsByMonth = monthBuckets.map((bucket) => ({
    month: bucket.label,
    trips: monthCounts.get(bucket.key) ?? 0,
  }));

  const activeShareLinks = shareLinks.filter((link) => {
    if (link.revoked_at) return false;
    if (!link.expires_at) return true;
    return new Date(link.expires_at) > now;
  });
  const expiringSoon = shareLinks.filter((link) => {
    if (link.revoked_at || !link.expires_at) return false;
    const expiresAt = new Date(link.expires_at);
    const diff = expiresAt.getTime() - now.getTime();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });
  const tripsMissingMoments = trips.filter((trip) => trip.moments_count === 0);
  const tripsMissingMedia = trips.filter((trip) => trip.media_count === 0);
  const latestTrip = trips[0] ?? null;
  const latestTripDate = latestTrip?.created_at
    ? formatter.format(new Date(latestTrip.created_at))
    : null;
  const tripsNeedingAttention =
    tripsMissingMoments.length + tripsMissingMedia.length;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-min lg:grid-flow-dense">
      {statMeta.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Tilt
            key={stat.label}
            maxTilt={8}
            className={cn("h-full", statLayout[index])}
          >
            <TiltContent className="h-full">
              <Shine
                asChild
                color={stat.shine}
                enableOnHover
                opacity={0.28}
              >
                <Card
                  className={cn(
                    `h-full border border-white/10 ${stat.panel} shadow-md backdrop-blur`,
                    "transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm uppercase tracking-[0.3em] text-white/60">
                        {stat.label}
                      </CardTitle>
                      <div className={`rounded-full bg-white/5 p-2 ${stat.tone}`}>
                        <Icon className="size-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <p className="text-3xl font-semibold text-white">
                        {statValues[index]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.helper}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Shine>
            </TiltContent>
          </Tilt>
        );
      })}

      <Shine
        asChild
        color="rgba(255,255,255,0.35)"
        opacity={0.22}
        enableOnHover
      >
        <Card className="sm:col-span-2 lg:col-span-7 xl:col-span-7 border border-white/10 bg-[color:var(--panel)]/90 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border border-white/10 bg-white/5 text-xs uppercase tracking-[0.24em] text-white/70">
                Atlas Console
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Archive overview
              </Badge>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2 lg:max-w-[32rem]">
                <CardTitle className="text-3xl leading-tight md:text-4xl">
                  Your memory archive, curated for easy momentum.
                </CardTitle>
                <CardDescription className="text-base text-white/70">
                  Keep the globe growing, polish highlights, and ship share links
                  with confidence.
                </CardDescription>
              </div>
              <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                <Button
                  asChild
                  size="lg"
                  className="w-full gap-2 whitespace-nowrap sm:w-auto sm:min-w-[170px]"
                >
                  <Link href="/globe">
                    Open globe
                    <Globe2 className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="w-full gap-2 whitespace-nowrap border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[170px]"
                >
                  <Link href="/trips/new">
                    Create trip
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="w-full gap-2 whitespace-nowrap border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[170px]"
                >
                  <Link href="/profile">
                    Profile sharing
                    <Share2 className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Share links
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-4xl font-semibold text-white">
                    {activeShareLinks.length}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {expiringSoon.length} expiring soon
                  </div>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="mt-4 w-full justify-between border-white/30 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/profile">
                    Manage share links
                    <Share2 className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Archive upkeep
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trips missing moments</span>
                    <span className="font-semibold text-white">
                      {tripsMissingMoments.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trips missing media</span>
                    <span className="font-semibold text-white">
                      {tripsMissingMedia.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active share links</span>
                    <span className="font-semibold text-white">
                      {activeShareLinks.length}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="mt-4 w-full justify-between border-white/25 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/trips">Review your trips</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Shine>

      <Card className="sm:col-span-2 lg:col-span-5 xl:col-span-5 border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Recent trips</CardTitle>
          <CardDescription>
            Jump back into the latest entries in your archive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTrips.length ? (
            recentTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block rounded-2xl border border-white/10 bg-[color:var(--panel-3)]/70 px-4 py-3 transition hover:border-white/20 hover:shadow-[0_12px_28px_rgba(0,0,0,0.24)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{trip.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {trip.place_name}
                    </p>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {trip.moments_count} moments
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-3)]/70 px-4 py-6 text-sm text-muted-foreground">
              No trips yet. Start your first journey to populate the globe.
            </div>
          )}
          <Button variant="outline" asChild className="w-full">
            <Link href="/trips">Browse all trips</Link>
          </Button>
        </CardContent>
      </Card>

      <DashboardCharts
        tripsByMonth={tripsByMonth}
        privacyChartData={privacyChartData}
        hasTrips={hasTrips}
        className="sm:col-span-2 lg:col-span-12 lg:grid-cols-12"
        tripCardClassName="lg:col-span-7 xl:col-span-8"
        privacyCardClassName="lg:col-span-5 xl:col-span-4"
      />

      <Card className="sm:col-span-2 lg:col-span-12 border border-white/10 bg-[linear-gradient(150deg,rgba(59,211,199,0.12),rgba(10,15,20,0.9))] shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Archive focus</CardTitle>
          <CardDescription>
            Keep momentum by polishing the newest trip and closing gaps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Latest entry
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {latestTrip?.title ?? "No trips yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {latestTripDate ?? "Create a trip to start the archive."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Attention needed
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {tripsNeedingAttention}
              </p>
              <p className="text-xs text-muted-foreground">
                Trips missing moments or media.
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="w-full">
            <Link href="/trips">Review trips now</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

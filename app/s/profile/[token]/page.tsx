import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  Camera,
  Globe2,
  MapPinned,
  Sparkles,
} from "lucide-react";

import { Globe } from "@/components/globe/Globe";
import type { GlobePin } from "@/components/globe/GlobePins";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ShareErrorState } from "@/components/share/ShareErrorState";
import type { ShareProfilePayload } from "@/lib/share/serializer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchSharePayload(token: string) {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const fallback = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const baseUrl = host ? `${protocol}://${host}` : fallback;

  const response = await fetch(`${baseUrl}/api/share/${token}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ShareProfilePayload;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function toInitials(value?: string | null) {
  if (!value) return "TR";
  const letters = value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return letters || "TR";
}

export default async function ShareProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = await fetchSharePayload(token);

  if (!payload || payload.scope !== "profile") {
    return (
      <div className="min-h-screen bg-[color:var(--sand)] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <ShareErrorState />
        </div>
      </div>
    );
  }

  const { owner, trips, visibility, stats } = payload;
  const rawName = owner?.display_name ?? null;
  const safeName = rawName && rawName.includes("@") ? null : rawName;
  const initials = toInitials(safeName ?? "Traveler");
  const pins: GlobePin[] = trips
    .filter((trip) => trip.lat !== null && trip.lng !== null)
    .map((trip) => ({
      id: trip.id,
      lat: trip.lat ?? 0,
      lng: trip.lng ?? 0,
      title: trip.title,
      placeName: trip.place_name,
      momentsCount: trip.moments_count,
      mediaCount: trip.media_count,
    }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--sand)] text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.35),transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(243,161,95,0.3),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,20,0.35),rgba(11,15,20,0.9))]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10 px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-[0_35px_80px_rgba(6,10,16,0.55)] backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge className="bg-[color:var(--lagoon)]/15 text-[color:var(--lagoon)]">
                  Shared profile
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/80">
                  Always shareable
                </Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl">
                {safeName ?? "Traveler profile"}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                A curated look at shared journeys and the traveler behind them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {visibility.show_owner && owner ? (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-sm text-muted-foreground">
                  <Avatar className="h-12 w-12 border border-white/10">
                    {owner.avatar_url ? (
                      <AvatarImage
                        src={owner.avatar_url}
                        alt={safeName ?? "Traveler"}
                      />
                    ) : null}
                    <AvatarFallback className="bg-[color:var(--panel-3)] text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--lagoon)]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Traveler
                    </p>
                    <p className="text-sm text-foreground">
                      {safeName ?? "Traveler"}
                    </p>
                    {owner.bio ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {owner.bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-xs text-muted-foreground">
                This profile shares the full story behind each trip.
              </div>
            </CardContent>
          </Card>

          {visibility.show_globe ? (
            <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl">Atlas overview</CardTitle>
                <CardDescription>
                  A static globe snapshot of shared locations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/80">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.2),_transparent_65%)]" />
                  <div className="relative h-[320px] md:h-[380px]">
                    <Globe
                      pins={pins}
                      showLabels
                      controlsEnabled={false}
                      showTripLink={false}
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                    {pins.length
                      ? `${pins.length} pinned locations`
                      : "No locations pinned"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {visibility.show_stats ? (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <MapPinned className="size-4 text-[color:var(--lagoon)]" />
                  Trips
                </div>
                <p className="text-3xl font-semibold">
                  {formatNumber(stats.trip_count)}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <Sparkles className="size-4 text-[color:var(--ember)]" />
                  Stories
                </div>
                <p className="text-3xl font-semibold">
                  {formatNumber(stats.moments_count)}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <Globe2 className="size-4 text-[color:var(--sunrise)]" />
                  Countries
                </div>
                <p className="text-3xl font-semibold">
                  {formatNumber(stats.countries_count)}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-white/10 bg-[color:var(--panel-2)]/80">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <Camera className="size-4 text-[color:var(--lagoon)]" />
                  Media
                </div>
                <p className="text-3xl font-semibold">
                  {formatNumber(stats.media_count)}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {visibility.show_trip_list ? (
          <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Shared trips</CardTitle>
              <CardDescription>
                Browse the shared memories in this profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <EmptyState
                  icon={MapPinned}
                  title="No trips shared yet"
                  description="Trips will appear here once the owner shares them."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        <span>{trip.place_name}</span>
                        {trip.date_label ? (
                          <span>• {trip.date_label}</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {trip.title}
                      </p>
                      {trip.short_description ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {trip.short_description}
                        </p>
                      ) : null}
                      {visibility.show_tags && trip.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {trip.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-white/15 bg-white/5 text-[10px] text-white/80"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {visibility.show_stats ? (
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{trip.moments_count} stories</span>
                          <span>{trip.media_count} media</span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}

        <Card className="border border-white/10 bg-[color:var(--panel)]/90 shadow-xl backdrop-blur">
          <CardContent className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Ready to join?
              </p>
              <p className="text-lg font-semibold">
                Start your own travel memory album today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up" className="gap-2">
                  Create your album <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

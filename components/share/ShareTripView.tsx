import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calendar, Camera, Sparkles } from "lucide-react";

import { GlobeShowcase } from "@/components/globe/GlobeShowcase";
import type { GlobePin } from "@/components/globe/GlobePins";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { TripShowcaseHeader } from "@/components/trips/TripShowcaseHeader";
import { SharedMediaGallery } from "@/components/share/SharedMediaGallery";
import type { ShareTripPayload } from "@/lib/share/serializer";
import { cn } from "@/lib/utils";

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

type ShareTripViewProps = {
  payload: ShareTripPayload;
  fullBleed?: boolean;
  headerLabel?: string;
  headerAction?: ReactNode;
  showGuestCta?: boolean;
};

export function ShareTripView({
  payload,
  fullBleed = false,
  headerLabel = "Shared trip",
  headerAction,
  showGuestCta = true,
}: ShareTripViewProps) {
  const { trip, highlights, moments, media, owner, privacy, visibility } =
    payload;
  const rawName = owner?.display_name ?? null;
  const safeName = rawName && rawName.includes("@") ? null : rawName;
  const initials = toInitials(safeName ?? "Traveler");
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
  const privacyBadges = [
    privacy.hide_exact_dates ? "Exact dates hidden" : "Exact dates visible",
    privacy.allow_downloads ? "Downloads enabled" : "Downloads locked",
  ];

  const stats = [
    {
      label: "Moments",
      value: formatNumber(trip.moments_count),
      icon: BookOpenCheck,
      tone: "text-[color:var(--lagoon)]",
    },
    {
      label: "Media",
      value: formatNumber(trip.media_count),
      icon: Camera,
      tone: "text-[color:var(--sunrise)]",
    },
    ...(visibility.show_highlights
      ? [
          {
            label: "Highlights",
            value: formatNumber(highlights.length),
            icon: Sparkles,
            tone: "text-[color:var(--ember)]",
          },
        ]
      : []),
  ];

  const containerClassName = cn(
    "relative mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700",
    fullBleed ? "max-w-none px-4 md:px-8" : "max-w-7xl px-6"
  );

  const infoGrid = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Dates
        </p>
        <p className="text-base font-semibold text-white">
          {trip.date_label ?? "Hidden"}
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
  );

  const headerFooter = (
    <div className="space-y-3">
      {infoGrid}
      {visibility.show_owner && owner ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-sm text-muted-foreground">
          <Avatar className="h-10 w-10 border border-white/10">
            {owner.avatar_url ? (
              <AvatarImage
                src={owner.avatar_url}
                alt={safeName ?? "Traveler"}
              />
            ) : null}
            <AvatarFallback className="bg-[color:var(--panel-3)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--lagoon)]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Shared by
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
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--sand)] text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.35),transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(243,161,95,0.3),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,20,0.35),rgba(11,15,20,0.9))]" />
      </div>

      <div className={containerClassName}>
        {visibility.show_globe ? (
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
        ) : null}

        <TripShowcaseHeader
          title={trip.title}
          placeName={trip.place_name}
          dateLabel={trip.date_label}
          shortDescription={trip.short_description}
          tags={visibility.show_tags ? trip.tags : []}
          badges={privacyBadges}
          kicker={headerLabel}
          action={headerAction}
          rightSlot={
            visibility.show_stats ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.label}
                      className="border border-white/10 bg-[color:var(--panel-2)]/80"
                    >
                      <CardContent className="space-y-2 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          <Icon className={cn("size-4", stat.tone)} />
                          {stat.label}
                        </div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : null
          }
          footerSlot={headerFooter}
        />

        {visibility.show_highlights || visibility.show_moments ? (
          <section className="grid gap-6 lg:grid-cols-2">
            {visibility.show_highlights ? (
              <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl">Highlights</CardTitle>
                  <CardDescription>
                    The standout memories that define this journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {highlights.length === 0 ? (
                    <EmptyState
                      icon={Sparkles}
                      title="No highlights shared yet"
                      description="Highlights will appear once the trip is curated."
                    />
                  ) : (
                    <div className="space-y-3">
                      {highlights.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3 text-sm"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {visibility.show_moments ? (
              <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl">Diary moments</CardTitle>
                  <CardDescription>
                    Time-stamped notes captured along the way.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {moments.length === 0 ? (
                    <EmptyState
                      icon={BookOpenCheck}
                      title="No moments shared yet"
                      description="Diary moments will appear here once shared."
                    />
                  ) : (
                    moments.map((moment, index) => (
                      <div
                        key={moment.id}
                        className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          <span>
                            Moment {String(index + 1).padStart(2, "0")}
                          </span>
                          {moment.moment_timestamp ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {new Date(moment.moment_timestamp).toLocaleString(
                                "en-US",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          ) : null}
                        </div>
                        <Separator className="my-2 bg-white/10" />
                        <p className="text-sm text-foreground">
                          {moment.content_text}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ) : null}
          </section>
        ) : null}

        {visibility.show_media ? (
          <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Shared media</CardTitle>
              <CardDescription>
                {privacy.allow_downloads
                  ? "Downloads are enabled for this share link."
                  : "Downloads are disabled for this share link."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SharedMediaGallery
                items={media.map((item) => ({
                  id: item.id,
                  media_type: item.media_type,
                  preview_url: item.preview_url,
                  full_url: item.full_url,
                  download_url: item.download_url,
                }))}
                allowDownloads={privacy.allow_downloads}
              />
            </CardContent>
          </Card>
        ) : null}

        {showGuestCta ? (
          <Card className="border border-white/10 bg-[color:var(--panel)]/90 shadow-xl backdrop-blur">
            <CardContent className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Inspired?
                </p>
                <p className="text-lg font-semibold">
                  Create your own memory album in minutes.
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
        ) : null}
      </div>
    </div>
  );
}

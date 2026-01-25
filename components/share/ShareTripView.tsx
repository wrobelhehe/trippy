"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TripStoryPresentation, type StoryEntry } from "@/components/trips/TripStoryPresentation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GlobePin } from "@/components/globe/GlobePins";
import type { ShareTripPayload } from "@/lib/share/serializer";

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
  const { trip, story_entries, owner, visibility } = payload;
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

  const storyEntries: StoryEntry[] = story_entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    media: entry.media.map((media) => ({
      id: media.id,
      mediaType: media.media_type,
      url: media.full_url ?? media.preview_url,
    })),
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--sand)] text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.35),transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(243,161,95,0.3),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,20,0.35),rgba(11,15,20,0.9))]" />
      </div>

      <div
        className={
          fullBleed
            ? "relative mx-auto space-y-10 px-4 py-10 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            : "relative mx-auto max-w-7xl space-y-10 px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
        }
      >
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
          entries={storyEntries}
          globePins={pins}
          focusPinId={hasCoordinates ? trip.id : null}
          label={headerLabel}
          fullBleed={fullBleed}
          showGlobe={visibility.show_globe}
          actionSlot={headerAction}
        />

        {visibility.show_owner && owner ? (
          <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 px-5 py-4 text-sm text-muted-foreground shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <Avatar className="h-12 w-12 border border-white/10">
              {owner.avatar_url ? (
                <AvatarImage src={owner.avatar_url} alt={safeName ?? "Traveler"} />
              ) : null}
              <AvatarFallback className="bg-[color:var(--panel-3)] text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--lagoon)]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Shared by
              </p>
              <p className="text-sm text-foreground">{safeName ?? "Traveler"}</p>
              {owner.bio ? (
                <p className="mt-1 text-xs text-muted-foreground">{owner.bio}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {showGuestCta ? (
          <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel)]/90 px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Inspired?
                </p>
                <p className="text-lg font-semibold">
                  Create your own travel story in minutes.
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
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

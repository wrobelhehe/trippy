"use client";

import { Fragment, type ReactNode, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, MapPin, Sparkles } from "lucide-react";

import { GlobeShowcase } from "@/components/globe/GlobeShowcase";
import type { GlobePin } from "@/components/globe/GlobePins";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { cn } from "@/lib/utils";

export type TripStoryPreset =
  | "postcards"
  | "album"
  | "carousel"
  | "collage"
  | "cinematic"
  | "journal";

export type StoryMediaItem = {
  id: string;
  mediaType: "image" | "video";
  url: string | null;
};

export type StoryEntry = {
  id: string;
  title?: string | null;
  description: string;
  media: StoryMediaItem[];
};

type TripStoryPresentationProps = {
  title: string;
  city: string;
  countryCode: string | null;
  startDate: string | null;
  endDate: string | null;
  preset: TripStoryPreset;
  entries: StoryEntry[];
  globePins?: GlobePin[];
  focusPinId?: string | null;
  label?: string;
  fullBleed?: boolean;
  showGlobe?: boolean;
  actionSlot?: ReactNode;
  enableLightbox?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const startLabel = start ? dateFormatter.format(new Date(start)) : null;
  const endLabel = end ? dateFormatter.format(new Date(end)) : null;
  if (startLabel && endLabel) return `${startLabel} — ${endLabel}`;
  return startLabel ?? endLabel;
}

function toCountryName(code: string | null) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

type LightboxMedia = {
  url: string;
  mediaType: "image" | "video";
};

const normalizePreset = (value: TripStoryPreset) => {
  if (value === "cinematic" || value === "journal") return "postcards";
  return value;
};

function MediaTile({
  media,
  onOpen,
  canOpen = true,
  frameClassName,
  className,
  fit = "contain",
}: {
  media: StoryMediaItem | null;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
  frameClassName?: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const hasMedia = Boolean(media?.url);
  const isInteractive = hasMedia && canOpen;
  const isImage = media?.mediaType === "image";
  const imageFit = fit === "cover" ? "object-cover" : "object-contain";
  const videoFit = fit === "contain" ? "object-contain" : "object-cover";
  const backdropStyle =
    hasMedia && isImage ? { backgroundImage: `url(${media?.url ?? ""})` } : undefined;
  return (
    <button
      type="button"
      onClick={() => media && media.url && onOpen(media)}
      className={cn(
        "group w-full text-left",
        isInteractive ? "cursor-zoom-in" : "cursor-default",
        className
      )}
      disabled={!isInteractive}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[26px] border border-white/10 bg-[color:var(--panel-2)]/80",
          frameClassName ?? "aspect-[4/3]"
        )}
      >
        {backdropStyle ? (
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center blur-2xl opacity-70"
            style={backdropStyle}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(18,24,32,0.4),rgba(18,24,32,0.75))]" />
        {isInteractive && hasMedia ? (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80">
            <Eye className="size-3.5" />
            View
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        {hasMedia ? (
          media?.mediaType === "video" ? (
            <video
              src={media.url ?? undefined}
              className={cn(
                "absolute inset-0 h-full w-full bg-[color:var(--panel-2)]/50",
                videoFit,
                isInteractive && "pointer-events-none"
              )}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={media?.url ?? undefined}
              alt="Trip memory"
              loading="lazy"
              className={cn(
                "absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.01]",
                imageFit,
                isInteractive && "pointer-events-none"
              )}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Media preview
          </div>
        )}
      </div>
    </button>
  );
}

function MediaStack({
  items,
  onOpen,
  canOpen,
}: {
  items: StoryMediaItem[];
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-44 w-full items-center justify-center rounded-[28px] border border-white/10 bg-[color:var(--panel-3)]/80 text-xs text-muted-foreground">
        Add media to bring this scene alive.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((media) => (
        <MediaTile key={media.id} media={media} onOpen={onOpen} canOpen={canOpen} />
      ))}
    </div>
  );
}

function PostcardEntry({
  entry,
  index,
  onOpen,
  canOpen,
}: {
  entry: StoryEntry;
  index: number;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  const entryLabel =
    entry.title?.trim() || `Scene ${String(index + 1).padStart(2, "0")}`;
  const rotation = index % 2 === 0 ? "-rotate-1" : "rotate-1";
  return (
    <div className="relative">
      <div
        className={cn(
          "rounded-[34px] border border-white/10 bg-[color:var(--panel-2)]/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
          rotation
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="size-3.5 text-[color:var(--ember)]" />
            {entryLabel}
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/70">
            Air mail
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <MediaStack items={entry.media} onOpen={onOpen} canOpen={canOpen} />
          <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel-3)]/70 p-5">
            <p className="text-sm text-foreground">
              {entry.description || "Drop a line that captures this stop."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlbumCover({
  title,
  coverMedia,
  note,
  onOpen,
  canOpen,
}: {
  title: string;
  coverMedia: StoryMediaItem | null;
  note: string;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[color:var(--panel-2)]/80 p-6 shadow-[0_28px_90px_rgba(6,10,16,0.45)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_70%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
        <MediaTile
          media={coverMedia}
          onOpen={onOpen}
          canOpen={canOpen}
          frameClassName="aspect-[4/5]"
          fit="contain"
        />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.34em] text-muted-foreground">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/80">
              Travel album
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm text-white/80">{note}</p>
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
            Volume 01 · Collector's cut
          </div>
        </div>
      </div>
    </div>
  );
}

function AlbumEntry({
  entry,
  index,
  onOpen,
  canOpen,
}: {
  entry: StoryEntry;
  index: number;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  const primary = entry.media[0] ?? null;
  const rest = entry.media.slice(1);
  const entryLabel =
    entry.title?.trim() || `Scene ${String(index + 1).padStart(2, "0")}`;

  return (
    <div className="relative rounded-[36px] border border-white/10 bg-[color:var(--panel-2)]/80 p-6 shadow-[0_26px_70px_rgba(6,10,16,0.45)]">
      <div className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {entryLabel}
      </div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <Sparkles className="size-3.5 text-[color:var(--lagoon)]" />
        {entryLabel}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <MediaTile
            media={primary}
            onOpen={onOpen}
            canOpen={canOpen}
            frameClassName="aspect-[5/4]"
            fit="contain"
          />
          <div className="rounded-[22px] border border-white/10 bg-[color:var(--panel-3)]/70 p-4">
            <p className="text-sm text-foreground">
              {entry.description || "Leave a note to remember this moment."}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Contact sheet
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rest.length ? (
              rest.map((media, mediaIndex) => (
                <div
                  key={media.id}
                  className={cn(
                    mediaIndex % 2 === 0 ? "rotate-1" : "-rotate-1"
                  )}
                >
                  <MediaTile
                    media={media}
                    onOpen={onOpen}
                    canOpen={canOpen}
                    frameClassName="aspect-[4/5]"
                    fit="contain"
                  />
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-[color:var(--panel-3)]/70 p-6 text-xs text-muted-foreground">
                Add more media to fill the spread.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselEntry({
  entry,
  index,
  onOpen,
  canOpen,
}: {
  entry: StoryEntry;
  index: number;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const entryLabel =
    entry.title?.trim() || `Scene ${String(index + 1).padStart(2, "0")}`;
  const handleScroll = (direction: "left" | "right") => {
    const target = stripRef.current;
    if (!target) return;
    const amount = Math.max(240, target.clientWidth * 0.7);
    target.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="rounded-[34px] border border-white/10 bg-[color:var(--panel-2)]/80 p-6 shadow-[0_24px_70px_rgba(6,10,16,0.4)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles className="size-3.5 text-[color:var(--sunrise)]" />
          {entryLabel}
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Drag →
        </span>
      </div>
      <p className="mt-3 text-sm text-foreground">
        {entry.description || "Scroll the reel frame by frame."}
      </p>
      <div className="relative mt-5">
        <div className="absolute -top-3 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_18px,transparent_18px_30px)] opacity-40" />
        <div className="absolute -bottom-3 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_18px,transparent_18px_30px)] opacity-40" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center">
          <button
            type="button"
            className="pointer-events-auto ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-black/80"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <ArrowLeft className="size-4" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center">
          <button
            type="button"
            className="pointer-events-auto mr-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-black/80"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
        <div
          ref={stripRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-2"
        >
          {entry.media.length ? (
            entry.media.map((media, frameIndex) => (
              <div
                key={media.id}
                className="min-w-[76%] snap-start sm:min-w-[52%] lg:min-w-[36%]"
              >
                <div className="rounded-[24px] border border-white/10 bg-[color:var(--panel-3)]/70 p-3">
                  <MediaTile
                    media={media}
                    onOpen={onOpen}
                    canOpen={canOpen}
                    frameClassName="aspect-[3/4]"
                  />
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/70">
                    <span>Frame {String(frameIndex + 1).padStart(2, "0")}</span>
                    <span>Reel</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex min-h-[200px] w-full items-center justify-center rounded-[26px] border border-white/10 bg-[color:var(--panel-3)]/70 text-xs text-muted-foreground">
              Add media to start the reel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollageEntry({
  entry,
  index,
  onOpen,
  canOpen,
}: {
  entry: StoryEntry;
  index: number;
  onOpen: (media: StoryMediaItem) => void;
  canOpen?: boolean;
}) {
  const entryLabel =
    entry.title?.trim() || `Scene ${String(index + 1).padStart(2, "0")}`;
  return (
    <div className="rounded-[34px] border border-white/10 bg-[color:var(--panel-2)]/80 p-6 shadow-[0_24px_70px_rgba(6,10,16,0.4)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <Sparkles className="size-3.5 text-[color:var(--ember)]" />
        {entryLabel}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid auto-rows-[150px] gap-3 sm:auto-rows-[180px] sm:grid-cols-2">
          {entry.media.length ? (
            entry.media.map((media, mediaIndex) => {
              const tileClass =
                mediaIndex === 0
                  ? "sm:col-span-2 sm:row-span-2"
                  : mediaIndex === 3
                    ? "sm:col-span-2"
                    : "";
              const rotation =
                mediaIndex % 3 === 0
                  ? "-rotate-1"
                  : mediaIndex % 3 === 1
                    ? "rotate-1"
                    : "-rotate-2";
              return (
                <div key={media.id} className={cn("h-full", tileClass, rotation)}>
                  <MediaTile
                    media={media}
                    onOpen={onOpen}
                    canOpen={canOpen}
                    frameClassName="h-full"
                    className="h-full"
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-[26px] border border-white/10 bg-[color:var(--panel-3)]/70 text-xs text-muted-foreground">
              Add media to build the memory wall.
            </div>
          )}
        </div>
        <div className="space-y-4 rounded-[28px] border border-white/10 bg-[color:var(--panel-3)]/70 p-5">
          <p className="text-sm text-foreground">
            {entry.description || "Layer the memories into a dense collage."}
          </p>
          <div className="space-y-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            <div className="h-px w-full bg-white/10" />
            <span>Notes & textures</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Clip the highlights together to feel the atmosphere.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TripStoryPresentation({
  title,
  city,
  countryCode,
  startDate,
  endDate,
  preset,
  entries,
  globePins,
  focusPinId,
  label = "Trip story",
  fullBleed = false,
  showGlobe = true,
  actionSlot,
  enableLightbox = true,
}: TripStoryPresentationProps) {
  const countryName = toCountryName(countryCode);
  const locationLabel = [city, countryName].filter(Boolean).join(", ");
  const dateLabel = formatDateRange(startDate, endDate);
  const resolvedPreset = useMemo(
    () => normalizePreset(preset),
    [preset]
  );
  const [lightboxMedia, setLightboxMedia] = useState<LightboxMedia | null>(
    null
  );
  const handleOpenMedia = (media: StoryMediaItem) => {
    if (!enableLightbox) return;
    if (!media.url) return;
    setLightboxMedia({ url: media.url, mediaType: media.mediaType });
  };
  const durationDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              86_400_000
          ) + 1
        )
      : null;
  const coverMedia = entries[0]?.media?.[0] ?? null;
  const coverNote = "A collected story of the journey, told page by page.";

  const containerClassName = cn(
    "relative mx-auto space-y-10 overflow-hidden rounded-[36px] border border-white/10 bg-[color:var(--panel)]/80 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur",
    fullBleed ? "max-w-none" : "max-w-6xl"
  );

  const innerPadding = fullBleed ? "px-6 py-10 md:px-10" : "px-6 py-10";

  return (
    <div className={containerClassName}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.14),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,14,20,0.35),rgba(10,14,20,0.85))]" />
      </div>

      <div className={cn("relative", innerPadding)}>
        <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/80">
                  {label}
                </span>
                {locationLabel ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-[color:var(--sunrise)]" />
                    {locationLabel}
                  </span>
                ) : null}
                {dateLabel ? <span>{dateLabel}</span> : null}
              </div>
              {actionSlot ? <div className="ml-auto">{actionSlot}</div> : null}
            </div>
            {resolvedPreset === "album" ? (
              <h1 className="sr-only">{title}</h1>
            ) : (
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                {title}
              </h1>
            )}
            {resolvedPreset === "album" ? null : durationDays ? (
              <p className="text-sm text-muted-foreground">
                {durationDays} days of memories, edited into a single story.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add dates to show the arc of the journey.
              </p>
            )}
          </div>
          {showGlobe && globePins?.length ? (
            <div className="relative h-[220px] overflow-hidden rounded-[28px] border border-white/10 bg-[color:var(--panel-3)]/80">
              <GlobeShowcase
                pins={globePins}
                focusPinId={focusPinId ?? null}
                showLabels
                controlsEnabled={false}
                showTripLink={false}
              />
              <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-4 py-1 text-[10px] uppercase tracking-[0.28em] text-white/70">
                Globe view (static)
              </div>
            </div>
          ) : (
            <div className="flex h-[220px] items-center justify-center rounded-[28px] border border-white/10 bg-[color:var(--panel-3)]/80 text-xs text-muted-foreground">
              Pin a location to light up the globe.
            </div>
          )}
        </header>

        <section className="mt-10 space-y-10">
          {entries.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel-2)]/70 px-6 py-8 text-sm text-muted-foreground">
              Add media and write descriptions to build the trip story.
            </div>
          ) : (
            <>
              {resolvedPreset === "album" ? (
                <AlbumCover
                  title={title}
                  coverMedia={coverMedia}
                  note={coverNote}
                  onOpen={handleOpenMedia}
                  canOpen={enableLightbox}
                />
              ) : null}
              {entries.map((entry, index) => (
                <Fragment key={entry.id}>
                  {resolvedPreset === "postcards" ? (
                    <PostcardEntry
                      entry={entry}
                      index={index}
                      onOpen={handleOpenMedia}
                      canOpen={enableLightbox}
                    />
                  ) : resolvedPreset === "album" ? (
                    <AlbumEntry
                      entry={entry}
                      index={index}
                      onOpen={handleOpenMedia}
                      canOpen={enableLightbox}
                    />
                  ) : resolvedPreset === "carousel" ? (
                    <CarouselEntry
                      entry={entry}
                      index={index}
                      onOpen={handleOpenMedia}
                      canOpen={enableLightbox}
                    />
                  ) : (
                    <CollageEntry
                      entry={entry}
                      index={index}
                      onOpen={handleOpenMedia}
                      canOpen={enableLightbox}
                    />
                  )}
                </Fragment>
              ))}
            </>
          )}
        </section>
      </div>

      {enableLightbox && lightboxMedia ? (
        <Dialog
          open={Boolean(lightboxMedia)}
          onOpenChange={() => setLightboxMedia(null)}
        >
          <DialogContent className="max-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden p-0">
            <VisuallyHidden>
              <DialogTitle>Media preview</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden>
              <DialogDescription>Full screen media viewer.</DialogDescription>
            </VisuallyHidden>
            <div className="relative flex max-h-[calc(100vh-4rem)] min-h-[240px] w-full items-center justify-center bg-black">
              {lightboxMedia?.mediaType === "video" ? (
                <video
                  src={lightboxMedia.url}
                  className="max-h-[calc(100vh-4rem)] w-full object-contain"
                  controls
                  autoPlay
                />
              ) : lightboxMedia?.url ? (
                <img
                  src={lightboxMedia.url}
                  alt="Trip memory full screen"
                  className="max-h-[calc(100vh-4rem)] w-full object-contain"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

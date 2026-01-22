"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Image,
  PlayCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export type SharedMediaItem = {
  id: string;
  media_type: "image" | "video";
  preview_url: string | null;
  full_url: string | null;
  download_url: string | null;
};

type GalleryItem = SharedMediaItem & {
  display_url: string | null;
  modal_url: string | null;
};

export function SharedMediaGallery({
  items,
  allowDownloads,
}: {
  items: SharedMediaItem[];
  allowDownloads: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const galleryItems = useMemo<GalleryItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        display_url:
          item.media_type === "video"
            ? item.preview_url ?? item.full_url
            : item.preview_url ?? item.full_url,
        modal_url:
          item.media_type === "video"
            ? item.full_url ?? item.preview_url
            : item.full_url ?? item.preview_url,
      })),
    [items]
  );

  if (galleryItems.length === 0) {
    return (
      <EmptyState
        icon={Image}
        title="No media shared yet"
        description="Media will appear here once the owner uploads it."
      />
    );
  }

  const total = galleryItems.length;
  const navDisabled = total <= 1;
  const activeItem =
    activeIndex !== null ? galleryItems[activeIndex] ?? null : null;

  const handlePrev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + total - 1) % total);
  };

  const handleNext = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % total);
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, index) => {
          const mediaLabel = `Media ${index + 1}`;
          return (
            <Card
              key={item.id}
              className="relative overflow-hidden border border-white/10 bg-[color:var(--panel-2)]/80"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full text-left"
              >
                <div className="aspect-[4/3] w-full bg-muted">
                  {item.display_url ? (
                    item.media_type === "video" ? (
                      <div className="relative h-full w-full">
                        <video
                          src={item.display_url}
                          className="h-full w-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <PlayCircle className="size-10 text-white/80" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.display_url}
                        alt={mediaLabel}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Media preview
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 border border-transparent group-hover:border-white/30" />
              </button>
              {allowDownloads && item.download_url ? (
                <div className="border-t border-white/10 bg-[color:var(--panel-3)]/80 px-3 py-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.download_url} download>
                      Download
                    </a>
                  </Button>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => {
        if (!open) setActiveIndex(null);
      }}>
        <DialogContent className="max-w-6xl p-0">
          {activeItem ? (
            <div className="flex flex-col">
              <DialogHeader className="flex-row items-center justify-between border-b border-white/10 px-6 py-4">
                <DialogTitle>Shared media</DialogTitle>
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                  <span>
                    {activeIndex !== null ? activeIndex + 1 : 1} / {total}
                  </span>
                  {allowDownloads && activeItem.download_url ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={activeItem.download_url} download>
                        <Download className="size-3.5" />
                        Download
                      </a>
                    </Button>
                  ) : null}
                </div>
              </DialogHeader>
              <div className="relative flex h-[60vh] items-center justify-center bg-black/80">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={navDisabled}
                  className="absolute left-4 top-1/2 -translate-y-1/2 border-white/20 bg-black/40 text-white/80 hover:bg-black/60"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={navDisabled}
                  className="absolute right-4 top-1/2 -translate-y-1/2 border-white/20 bg-black/40 text-white/80 hover:bg-black/60"
                >
                  <ChevronRight className="size-4" />
                </Button>
                {activeItem.modal_url ? (
                  activeItem.media_type === "video" ? (
                    <video
                      src={activeItem.modal_url}
                      className="h-full w-full max-w-4xl object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={activeItem.modal_url}
                      alt="Shared media"
                      className="h-full w-full max-w-4xl object-contain"
                    />
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Media unavailable
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-6 py-4">
                {galleryItems.map((item, index) => (
                  <button
                    key={`${item.id}-thumb`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative h-16 w-24 overflow-hidden rounded-xl border border-white/10 bg-black/40",
                      index === activeIndex &&
                        "border-[color:var(--lagoon)]/70 shadow-[0_0_0_1px_rgba(59,211,199,0.35)]"
                    )}
                  >
                    {item.display_url ? (
                      item.media_type === "video" ? (
                        <div className="relative h-full w-full">
                          <video
                            src={item.display_url}
                            className="h-full w-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <PlayCircle className="size-5 text-white/80" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.display_url}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                        Empty
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

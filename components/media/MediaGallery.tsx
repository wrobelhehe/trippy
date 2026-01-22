import { Image } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export type MediaItem = {
  id: string;
  mediaType: "image" | "video";
  url?: string | null;
};

export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Image}
        title="No media yet"
        description="Upload a photo or video to start the gallery."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group relative overflow-hidden border border-white/10 bg-[color:var(--panel-2)]/80 shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:border-white/20"
        >
          <div className="aspect-[4/3] w-full bg-muted">
            {item.url ? (
              item.mediaType === "video" ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={item.url}
                  alt="Trip media"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                Media preview
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </Card>
      ))}
    </div>
  );
}

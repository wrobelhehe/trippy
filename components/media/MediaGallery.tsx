import { Card } from "@/components/ui/card";

export type MediaItem = {
  id: string;
  mediaType: "image" | "video";
  url?: string | null;
};

export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 text-sm text-muted-foreground">
        No media yet. Upload a photo or video to start the gallery.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="relative overflow-hidden border border-black/5 bg-white/70"
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
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                Media preview
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
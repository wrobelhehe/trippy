import { Card, CardContent } from "@/components/ui/card";

export function TripStats({
  moments,
  media,
  privacyMode,
}: {
  moments: number;
  media: number;
  privacyMode: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border border-black/5 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="space-y-1 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Moments
          </p>
          <p className="text-2xl font-semibold">{moments}</p>
        </CardContent>
      </Card>
      <Card className="border border-black/5 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="space-y-1 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Media
          </p>
          <p className="text-2xl font-semibold">{media}</p>
        </CardContent>
      </Card>
      <Card className="border border-black/5 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="space-y-1 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Privacy
          </p>
          <p className="text-2xl font-semibold capitalize">{privacyMode}</p>
        </CardContent>
      </Card>
    </div>
  );
}
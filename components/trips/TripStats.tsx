import { Camera, NotebookPen, Shield } from "lucide-react";

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
      <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Moments
            </p>
            <p className="text-2xl font-semibold">{moments}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(99,218,226,0.35),_transparent_70%)]">
            <NotebookPen className="size-5 text-white/80" />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Media
            </p>
            <p className="text-2xl font-semibold">{media}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(236,194,92,0.35),_transparent_70%)]">
            <Camera className="size-5 text-white/80" />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Privacy
            </p>
            <p className="text-2xl font-semibold capitalize">{privacyMode}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(173,124,255,0.35),_transparent_70%)]">
            <Shield className="size-5 text-white/80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

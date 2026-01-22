import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TripShowcaseHeaderProps = {
  title: string;
  placeName: string;
  dateLabel?: string | null;
  shortDescription?: string | null;
  tags?: string[];
  tagPlaceholder?: string;
  badges?: string[];
  kicker?: string;
  action?: ReactNode;
  rightSlot?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
};

export function TripShowcaseHeader({
  title,
  placeName,
  dateLabel,
  shortDescription,
  tags = [],
  tagPlaceholder,
  badges = [],
  kicker,
  action,
  rightSlot,
  footerSlot,
  className,
}: TripShowcaseHeaderProps) {
  const hasTags = tags.length > 0;
  const hasBadges = badges.length > 0;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--panel)]/85 px-6 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur lg:px-10 lg:py-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,238,206,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] bg-[radial-gradient(circle_at_top,_rgba(255,202,128,0.2),_transparent_70%)]" />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {kicker ? (
              <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
                {kicker}
              </Badge>
            ) : null}
            <span>{placeName}</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] tracking-[0.2em] text-white/70">
              {dateLabel ?? "Dates TBD"}
            </span>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
              {shortDescription ? (
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {shortDescription}
                </p>
              ) : null}
            </div>
            {hasBadges ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((label) => (
                  <Badge
                    key={label}
                    variant="outline"
                    className="border-white/20 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/80"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
            {hasTags ? (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white/15 bg-black/25 text-[10px] uppercase tracking-[0.2em] text-white/70"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : tagPlaceholder ? (
              <Badge
                variant="outline"
                className="border-white/15 bg-black/25 text-[10px] uppercase tracking-[0.2em] text-white/70"
              >
                {tagPlaceholder}
              </Badge>
            ) : null}
            {footerSlot ? <div>{footerSlot}</div> : null}
          </div>
          {rightSlot ? <div className="space-y-4">{rightSlot}</div> : null}
        </div>
      </div>
    </section>
  );
}

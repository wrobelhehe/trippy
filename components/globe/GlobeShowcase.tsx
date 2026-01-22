"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Globe } from "@/components/globe/Globe";
import type { GlobePin } from "@/components/globe/GlobePins";
import { cn } from "@/lib/utils";

type GlobeShowcaseProps = {
  pins?: GlobePin[];
  focusPinId?: string | null;
  controlsEnabled?: boolean;
  showLabels?: boolean;
  showTripLink?: boolean;
  delayMs?: number;
  className?: string;
};

export function GlobeShowcase({
  pins,
  focusPinId,
  controlsEnabled = true,
  showLabels,
  showTripLink,
  delayMs = 900,
  className,
}: GlobeShowcaseProps) {
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGlobe(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {showGlobe ? (
        <Globe
          pins={pins}
          showLabels={showLabels}
          focusPinId={focusPinId ?? null}
          controlsEnabled={controlsEnabled}
          showTripLink={showTripLink}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/70">
            <Loader2 className="size-4 animate-spin" />
            Loading globe
          </div>
        </div>
      )}
    </div>
  );
}

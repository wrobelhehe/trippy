"use client";

import { GradientBackground } from "@/components/animate-ui/components/backgrounds/gradient";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { cn } from "@/lib/utils";

type AppBackdropProps = {
  className?: string;
};

export function AppBackdrop({ className }: AppBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <GradientBackground
        className="absolute inset-0 bg-[conic-gradient(from_120deg_at_10%_10%,rgba(59,211,199,0.25),rgba(11,15,20,0.95),rgba(243,161,95,0.35),rgba(11,15,20,0.9),rgba(59,211,199,0.2))] opacity-40"
      />
      <StarsBackground
        className="absolute inset-0 bg-transparent opacity-40"
        starColor="rgba(255,255,255,0.22)"
        pointerEvents={false}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(243,161,95,0.16),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.6),transparent_45%,rgba(5,8,12,0.75))]" />
    </div>
  );
}

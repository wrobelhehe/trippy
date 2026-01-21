"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

import { cn } from "@/lib/utils";
import { GlobePins, type GlobePin } from "@/components/globe/GlobePins";
import { useFpsMonitor } from "@/components/globe/useFpsMonitor";

function GlobeScene({ pins }: { pins: GlobePin[] }) {
  const globeRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 4]} intensity={0.8} />
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#1c2333" roughness={0.55} metalness={0.2} />
      </mesh>
      <GlobePins pins={pins} />
    </>
  );
}

function GlobeCanvasInner({
  pins,
  showStats,
}: {
  pins: GlobePin[];
  showStats: boolean;
}) {
  const fps = useFpsMonitor();

  return (
    <div className="relative h-full w-full">
      <Suspense
        fallback={
          <div className="grid h-full w-full place-items-center rounded-3xl border border-white/20 bg-white/40 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Loading globe
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          gl={{ antialias: true }}
          dpr={[1, 1.5]}
        >
          <GlobeScene pins={pins} />
        </Canvas>
      </Suspense>
      {showStats ? (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-[11px] font-medium">
          {fps} fps
        </div>
      ) : null}
    </div>
  );
}

const GlobeCanvas = dynamic(
  () => Promise.resolve({ default: GlobeCanvasInner }),
  { ssr: false }
);

export function Globe({
  pins = [],
  showStats = false,
  className,
}: {
  pins?: GlobePin[];
  showStats?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <GlobeCanvas pins={pins} showStats={showStats} />
    </div>
  );
}
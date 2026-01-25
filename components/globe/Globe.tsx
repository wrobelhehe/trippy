"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  extend,
  type ReactThreeFiber,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { X } from "lucide-react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SRGBColorSpace, TextureLoader, Vector3 } from "three";
import type { Mesh, Texture } from "three";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GlobeBorders } from "@/components/globe/GlobeBorders";
import { GlobePins, type GlobePin } from "@/components/globe/GlobePins";
import { useFpsMonitor } from "@/components/globe/useFpsMonitor";

extend({ OrbitControls });

type OrbitControlsImpl = OrbitControls;

declare module "@react-three/fiber" {
  interface ThreeElements {
    orbitControls: ReactThreeFiber.Object3DNode<
      OrbitControlsImpl,
      typeof OrbitControlsImpl
    >;
  }
}

const GLOBE_RADIUS = 1.75;
const BASE_CAMERA_DISTANCE = 6.6;
const FOCUS_CAMERA_DISTANCE = 4.7;
const LABEL_RADIUS = GLOBE_RADIUS + 0.2;

const toRadians = (value: number) => (value * Math.PI) / 180;

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = toRadians(90 - lat);
  const theta = toRadians(lng + 180);

  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Controls({
  focusTarget,
  focusPosition,
  onFocusComplete,
  onChange,
  enabled = true,
  resetTarget,
  resetDistance,
  onResetComplete,
}: {
  focusTarget?: Vector3 | null;
  focusPosition?: Vector3 | null;
  onFocusComplete?: () => void;
  onChange?: () => void;
  enabled?: boolean;
  resetTarget?: Vector3 | null;
  resetDistance?: number | null;
  onResetComplete?: () => void;
}) {
  const controls = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();
  const focusRef = useRef<{ target: Vector3; position: Vector3 } | null>(null);
  const resetTargetRef = useRef<Vector3 | null>(null);
  const resetRef = useRef<number | null>(null);
  const wasResettingRef = useRef(false);

  useEffect(() => {
    if (focusTarget && focusPosition) {
      focusRef.current = {
        target: focusTarget.clone(),
        position: focusPosition.clone(),
      };
    } else {
      focusRef.current = null;
    }
  }, [focusTarget, focusPosition]);

  useEffect(() => {
    const control = controls.current;
    if (!control) {
      return;
    }
    control.enabled = enabled;
    control.enableRotate = enabled;
    control.enableZoom = enabled;
  }, [enabled]);

  useEffect(() => {
    resetRef.current = typeof resetDistance === "number" ? resetDistance : null;
  }, [resetDistance]);

  useEffect(() => {
    resetTargetRef.current = resetTarget ? resetTarget.clone() : null;
  }, [resetTarget]);

  useEffect(() => {
    if (resetTargetRef.current || resetRef.current !== null) {
      wasResettingRef.current = true;
    }
  }, [resetTarget, resetDistance]);

  useEffect(() => {
    const control = controls.current;
    if (!control || !onChange) {
      return;
    }
    const handleChange = () => onChange();
    control.addEventListener("change", handleChange);
    return () => {
      control.removeEventListener("change", handleChange);
    };
  }, [onChange]);

  useFrame(() => {
    const control = controls.current;
    if (!control) {
      return;
    }
    if (focusRef.current) {
      control.target.lerp(focusRef.current.target, 0.12);
      camera.position.lerp(focusRef.current.position, 0.12);
      if (
        control.target.distanceTo(focusRef.current.target) < 0.02 &&
        camera.position.distanceTo(focusRef.current.position) < 0.02
      ) {
        control.target.copy(focusRef.current.target);
        camera.position.copy(focusRef.current.position);
        focusRef.current = null;
        onFocusComplete?.();
      }
    } else if (resetTargetRef.current || resetRef.current !== null) {
      const resetTargetValue = resetTargetRef.current;
      if (resetTargetValue) {
        control.target.lerp(resetTargetValue, 0.12);
        if (control.target.distanceTo(resetTargetValue) < 0.02) {
          control.target.copy(resetTargetValue);
          resetTargetRef.current = null;
        }
      }
      const direction = camera.position
        .clone()
        .sub(control.target)
        .normalize();
      const desiredDistance =
        resetRef.current ?? camera.position.distanceTo(control.target);
      const desired = control.target
        .clone()
        .add(direction.multiplyScalar(desiredDistance));
      camera.position.lerp(desired, 0.12);
      if (resetRef.current !== null && camera.position.distanceTo(desired) < 0.02) {
        camera.position.copy(desired);
        resetRef.current = null;
      }
      if (!resetTargetRef.current && resetRef.current === null) {
        if (wasResettingRef.current) {
          wasResettingRef.current = false;
          onResetComplete?.();
        }
      }
    }
    control.update();
  });

  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableRotate={enabled}
      enableZoom={enabled}
      minDistance={4.2}
      maxDistance={9}
      rotateSpeed={0.5}
      zoomSpeed={0.7}
    />
  );
}

function CursorController({ cursor }: { cursor: string }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.domElement.style.cursor = cursor;
    return () => {
      gl.domElement.style.cursor = "auto";
    };
  }, [cursor, gl]);

  return null;
}

type LabelPosition = {
  id: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
};

function GlobeLabelProjector({
  pins,
  radius,
  activeId,
  onUpdate,
}: {
  pins: GlobePin[];
  radius: number;
  activeId?: string | null;
  onUpdate: (labels: LabelPosition[]) => void;
}) {
  const { camera, size } = useThree();
  const lastUpdateRef = useRef(0);
  const previousRef = useRef<LabelPosition[]>([]);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (now - lastUpdateRef.current < 0.12) {
      return;
    }
    lastUpdateRef.current = now;
    const cameraDirection = camera.position.clone().normalize();

    const nextLabels = pins
      .map((pin, index) => {
        const label = pin.placeName || pin.title || "Trip";
        const position = latLngToVector3(pin.lat, pin.lng, radius);
        const projected = position.clone().project(camera);
        const facing = cameraDirection.dot(position.clone().normalize()) > 0.12;
        const inView = projected.z > -1 && projected.z < 1;

        if (!facing || !inView) {
          return null;
        }

        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;

        return {
          id: pin.id ?? `${pin.lat}-${pin.lng}-${index}`,
          label,
          x,
          y,
          active: pin.id === activeId,
        };
      })
      .filter((label): label is LabelPosition => Boolean(label));

    const prev = previousRef.current;
    const hasSameLength = prev.length === nextLabels.length;
    const isUnchanged =
      hasSameLength &&
      prev.every((prevLabel, index) => {
        const nextLabel = nextLabels[index];
        return (
          prevLabel.id === nextLabel.id &&
          prevLabel.active === nextLabel.active &&
          Math.abs(prevLabel.x - nextLabel.x) < 2 &&
          Math.abs(prevLabel.y - nextLabel.y) < 2
        );
      });

    if (!isUnchanged) {
      previousRef.current = nextLabels;
      onUpdate(nextLabels);
    }
  });

  return null;
}

function GlobeScene({
  pins,
  onSelect,
  onHoverChange,
  selectedId,
  hoveredId,
  mapTexture,
}: {
  pins: GlobePin[];
  onSelect?: (pin: GlobePin, event: ThreeEvent<PointerEvent>) => void;
  onHoverChange?: (pin: GlobePin | null) => void;
  selectedId?: string | null;
  hoveredId?: string | null;
  mapTexture?: Texture | null;
}) {
  const globeRef = useRef<Mesh>(null);
  const borderRadius = GLOBE_RADIUS + 0.02;
  const pinRadius = GLOBE_RADIUS + 0.06;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 3, 5]} intensity={1.1} />
      <directionalLight position={[-3, -2, 4]} intensity={0.6} />
      <mesh ref={globeRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#10182a"
          map={mapTexture ?? undefined}
          emissive="#0b1322"
          emissiveIntensity={mapTexture ? 0.35 : 0.6}
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>
      <GlobeBorders radius={borderRadius} />
      <GlobePins
        pins={pins}
        radius={pinRadius}
        onSelect={onSelect}
        onHoverChange={onHoverChange}
        selectedId={selectedId}
        hoveredId={hoveredId}
      />
    </>
  );
}

function GlobeCanvasInner({
  pins,
  showStats,
  focusPinId,
  showLabels,
  onSelectPin,
  controlsEnabled = true,
  showTripLink = true,
}: {
  pins: GlobePin[];
  showStats: boolean;
  focusPinId?: string | null;
  showLabels?: boolean;
  onSelectPin?: (pin: GlobePin | null) => void;
  controlsEnabled?: boolean;
  showTripLink?: boolean;
}) {
  const fps = useFpsMonitor();
  const [mounted, setMounted] = useState(false);
  const [canRender, setCanRender] = useState(true);
  const [selectedPin, setSelectedPin] = useState<GlobePin | null>(null);
  const [popoverPoint, setPopoverPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursor, setCursor] = useState("grab");
  const [mapTexture, setMapTexture] = useState<Texture | null>(null);
  const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);
  const [focusTarget, setFocusTarget] = useState<Vector3 | null>(null);
  const [focusPosition, setFocusPosition] = useState<Vector3 | null>(null);
  const [resetDistance, setResetDistance] = useState<number | null>(null);
  const [resetTarget, setResetTarget] = useState<Vector3 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<string | null>(null);
  const shouldShowStats = showStats && process.env.NODE_ENV === "development";
  const textureSources = useMemo(
    () => [
      "/textures/earth-day.jpg",
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg",
      "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg",
    ],
    []
  );

  const clamp = useMemo(
    () => (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max),
    []
  );

  useEffect(() => {
    if (hoveredId) {
      return;
    }
    setCursor(controlsEnabled ? "grab" : "default");
  }, [controlsEnabled, hoveredId]);

  useEffect(() => {
    setMounted(true);
    const canvas = document.createElement("canvas");
    const supportsWebGL = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
    setCanRender(supportsWebGL);
  }, []);

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (!canvasRef.current) {
        return;
      }
      event.preventDefault();
      const forwarded = new WheelEvent("wheel", {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaMode: event.deltaMode,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      });
      canvasRef.current.dispatchEvent(forwarded);
    };

    popover.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      popover.removeEventListener("wheel", handleWheel);
    };
  }, [selectedPin, popoverPoint]);

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();
    loader.crossOrigin = "anonymous";

    const loadTexture = (index: number) => {
      if (index >= textureSources.length) {
        if (!cancelled) {
          setMapTexture(null);
        }
        return;
      }
      loader.load(
        textureSources[index],
        (texture) => {
          if (cancelled) return;
          texture.colorSpace = SRGBColorSpace;
          setMapTexture(texture);
        },
        undefined,
        () => loadTexture(index + 1)
      );
    };

    loadTexture(0);
    return () => {
      cancelled = true;
    };
  }, [textureSources]);

  useEffect(() => {
    if (!focusPinId) {
      setSelectedPin(null);
      setPopoverPoint(null);
      setFocusTarget(null);
      setFocusPosition(null);
      if (previousFocusRef.current) {
        setResetDistance(BASE_CAMERA_DISTANCE);
        setResetTarget(new Vector3(0, 0, 0));
      }
      previousFocusRef.current = null;
      return;
    }
    const targetPin = pins.find((pin) => pin.id === focusPinId);
    if (!targetPin) {
      return;
    }
    previousFocusRef.current = focusPinId;
    setResetDistance(null);
    setResetTarget(null);
    setSelectedPin(targetPin);
    setPopoverPoint(null);
    const target = latLngToVector3(targetPin.lat, targetPin.lng, GLOBE_RADIUS);
    const position = target
      .clone()
      .normalize()
      .multiplyScalar(FOCUS_CAMERA_DISTANCE);
    setFocusTarget(target);
    setFocusPosition(position);
  }, [focusPinId, pins]);

  const handleSelect = (pin: GlobePin, event: ThreeEvent<PointerEvent>) => {
    if (!containerRef.current) {
      setSelectedPin(pin);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = event.nativeEvent;
    const x = clamp(clientX - rect.left + 12, 12, rect.width - 260);
    const y = clamp(clientY - rect.top + 12, 12, rect.height - 200);
    setSelectedPin(pin);
    setPopoverPoint({ x, y });
    onSelectPin?.(pin);
  };

  if (!mounted || !canRender) {
    return (
      <div className="grid h-full w-full place-items-center rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/80 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {mounted ? "WebGL unavailable" : "Loading globe"}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Suspense
        fallback={
          <div className="grid h-full w-full place-items-center rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/80 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Loading globe
          </div>
        }
      >
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, BASE_CAMERA_DISTANCE], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.25]}
          className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerMissed={() => {
            setSelectedPin(null);
            setPopoverPoint(null);
            onSelectPin?.(null);
          }}
        >
          <CursorController cursor={cursor} />
          <Controls
            focusTarget={focusTarget}
            focusPosition={focusPosition}
            onFocusComplete={() => {
              setFocusTarget(null);
              setFocusPosition(null);
            }}
            enabled={controlsEnabled}
            resetTarget={resetTarget}
            resetDistance={resetDistance}
            onResetComplete={() => {
              setResetDistance(null);
              setResetTarget(null);
            }}
          />
          <GlobeScene
            pins={pins}
            onSelect={handleSelect}
            onHoverChange={(pin) => {
              setHoveredId(pin?.id ?? null);
              if (pin) {
                setCursor("pointer");
              } else {
                setCursor(controlsEnabled ? "grab" : "default");
              }
            }}
            selectedId={selectedPin?.id ?? null}
            hoveredId={hoveredId}
            mapTexture={mapTexture}
          />
          {showLabels ? (
            <GlobeLabelProjector
              pins={pins}
              radius={LABEL_RADIUS}
              activeId={selectedPin?.id ?? focusPinId ?? null}
              onUpdate={setLabelPositions}
            />
          ) : null}
        </Canvas>
      </Suspense>
      {showLabels ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          {labelPositions.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className={cn(
                "absolute max-w-[180px] -translate-x-1/2 -translate-y-1/2 border-white/15 bg-black/40 px-2 py-0.5 text-[10px] tracking-[0.16em] text-white/80",
                label.active && "border-[color:var(--lagoon)]/60 text-white"
              )}
              style={{ left: label.x, top: label.y }}
            >
              <span className="truncate">{label.label}</span>
            </Badge>
          ))}
        </div>
      ) : null}
      {selectedPin && popoverPoint ? (
        <div
          ref={popoverRef}
          className="absolute z-20 w-64"
          style={{ left: popoverPoint.x, top: popoverPoint.y }}
        >
          <Card
            size="sm"
            className="border border-white/10 bg-[color:var(--panel-2)]/95 shadow-2xl backdrop-blur"
          >
            <CardHeader className="border-b border-white/10">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-white">
                    {selectedPin.title ?? "Trip"}
                  </CardTitle>
                  <CardDescription className="text-xs text-white/60">
                    {selectedPin.placeName ?? "Unknown location"}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    setSelectedPin(null);
                    setPopoverPoint(null);
                    onSelectPin?.(null);
                  }}
                  aria-label="Close trip preview"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Stories</span>
                <span className="text-white">{selectedPin.momentsCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Media</span>
                <span className="text-white">{selectedPin.mediaCount ?? 0}</span>
              </div>
              {showTripLink && selectedPin.id ? (
                <Button asChild size="sm" className="w-full">
                  <Link href={`/trips/${selectedPin.id}`}>View trip</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
      {shouldShowStats ? (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/20 bg-[color:var(--panel-2)]/80 px-3 py-1 text-[11px] font-medium">
          {fps} fps
        </div>
      ) : null}
    </div>
  );
}

export function Globe({
  pins = [],
  showStats = false,
  showLabels = false,
  focusPinId,
  onSelectPin,
  controlsEnabled = true,
  showTripLink = true,
  className,
}: {
  pins?: GlobePin[];
  showStats?: boolean;
  showLabels?: boolean;
  focusPinId?: string | null;
  onSelectPin?: (pin: GlobePin | null) => void;
  controlsEnabled?: boolean;
  showTripLink?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <GlobeCanvasInner
        pins={pins}
        showStats={showStats}
        showLabels={showLabels}
        focusPinId={focusPinId}
        onSelectPin={onSelectPin}
        controlsEnabled={controlsEnabled}
        showTripLink={showTripLink}
      />
    </div>
  );
}

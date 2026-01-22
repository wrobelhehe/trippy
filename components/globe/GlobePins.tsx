"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import type {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";

export type GlobePin = {
  id?: string;
  lat: number;
  lng: number;
  title?: string;
  placeName?: string;
  momentsCount?: number;
  mediaCount?: number;
  color?: string;
};

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

function GlobePinMarker({
  pin,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHoverChange,
}: {
  pin: GlobePin;
  position: Vector3;
  isSelected: boolean;
  isHovered: boolean;
  onSelect?: (pin: GlobePin, event: ThreeEvent<PointerEvent>) => void;
  onHoverChange?: (pin: GlobePin | null) => void;
}) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const coreMaterialRef = useRef<MeshStandardMaterial>(null);
  const glowMaterialRef = useRef<MeshBasicMaterial>(null);
  const scaleRef = useRef(1);
  const glowScaleRef = useRef(1);

  const targetScale = isHovered ? 1.55 : isSelected ? 1.3 : 1;
  const targetGlowScale = isHovered ? 1.25 : isSelected ? 1.1 : 1;
  const targetEmissive = isHovered ? 0.95 : isSelected ? 0.7 : 0.45;
  const targetGlowOpacity = isHovered ? 0.45 : isSelected ? 0.28 : 0.2;
  const initialValues = useRef({
    scale: targetScale,
    glowScale: targetGlowScale,
    emissive: targetEmissive,
    glowOpacity: targetGlowOpacity,
  });

  useEffect(() => {
    const group = groupRef.current;
    if (group) {
      scaleRef.current = initialValues.current.scale;
      group.scale.setScalar(initialValues.current.scale);
    }
    const glowMesh = glowRef.current;
    if (glowMesh) {
      glowScaleRef.current = initialValues.current.glowScale;
      glowMesh.scale.setScalar(initialValues.current.glowScale);
    }
    if (coreMaterialRef.current) {
      coreMaterialRef.current.emissiveIntensity = initialValues.current.emissive;
    }
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = initialValues.current.glowOpacity;
    }
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (group) {
      scaleRef.current = MathUtils.damp(
        scaleRef.current,
        targetScale,
        8,
        delta
      );
      group.scale.setScalar(scaleRef.current);
    }

    const glowMesh = glowRef.current;
    if (glowMesh) {
      glowScaleRef.current = MathUtils.damp(
        glowScaleRef.current,
        targetGlowScale,
        10,
        delta
      );
      glowMesh.scale.setScalar(glowScaleRef.current);
    }

    const coreMaterial = coreMaterialRef.current;
    if (coreMaterial) {
      coreMaterial.emissiveIntensity = MathUtils.damp(
        coreMaterial.emissiveIntensity,
        targetEmissive,
        10,
        delta
      );
    }

    const glowMaterial = glowMaterialRef.current;
    if (glowMaterial) {
      glowMaterial.opacity = MathUtils.damp(
        glowMaterial.opacity,
        targetGlowOpacity,
        10,
        delta
      );
    }
  });

  const coreColor = pin?.color ?? (isSelected ? "#6ee7ff" : "#ffd7b1");
  const emissiveColor = isSelected ? "#0b3b4a" : "#101c2b";

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect?.(pin, event);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverChange?.(pin);
      }}
      onPointerOut={() => {
        onHoverChange?.(null);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={coreColor}
          emissive={emissiveColor}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color={pin?.color ?? "#6ee7ff"}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export const GlobePins = memo(function GlobePins({
  pins,
  radius = 1.74,
  onSelect,
  onHoverChange,
  selectedId,
  hoveredId,
}: {
  pins: GlobePin[];
  radius?: number;
  onSelect?: (pin: GlobePin, event: ThreeEvent<PointerEvent>) => void;
  onHoverChange?: (pin: GlobePin | null) => void;
  selectedId?: string | null;
  hoveredId?: string | null;
}) {
  const positions = useMemo(
    () => pins.map((pin) => latLngToVector3(pin.lat, pin.lng, radius)),
    [pins, radius]
  );

  return (
    <group>
      {positions.map((position, index) => {
        const pin = pins[index];
        const isSelected = Boolean(pin?.id && pin.id === selectedId);
        const isHovered = Boolean(pin?.id && pin.id === hoveredId);
        return (
          <GlobePinMarker
            key={`${position.x}-${position.y}-${position.z}-${index}`}
            pin={pin}
            position={position}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={onSelect}
            onHoverChange={onHoverChange}
          />
        );
      })}
    </group>
  );
});

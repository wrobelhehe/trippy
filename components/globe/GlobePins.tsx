"use client";

import { memo, useMemo } from "react";
import { Vector3 } from "three";

export type GlobePin = {
  lat: number;
  lng: number;
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

export const GlobePins = memo(function GlobePins({
  pins,
  radius = 1.02,
}: {
  pins: GlobePin[];
  radius?: number;
}) {
  const positions = useMemo(
    () => pins.map((pin) => latLngToVector3(pin.lat, pin.lng, radius)),
    [pins, radius]
  );

  return (
    <group>
      {positions.map((position, index) => (
        <mesh key={`${position.x}-${position.y}-${position.z}-${index}`} position={position}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color={pins[index]?.color ?? "#ffd7b1"} />
        </mesh>
      ))}
    </group>
  );
});
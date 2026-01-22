"use client";

import { useEffect, useMemo, useState } from "react";
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][] | number[][][][];
    } | null;
  }>;
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

function pushRingPositions(
  ring: number[][],
  radius: number,
  positions: number[]
) {
  for (let i = 0; i < ring.length; i += 1) {
    const current = ring[i];
    const next = ring[(i + 1) % ring.length];
    if (!current || !next) continue;
    const [lngA, latA] = current;
    const [lngB, latB] = next;
    const start = latLngToVector3(latA, lngA, radius);
    const end = latLngToVector3(latB, lngB, radius);
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
  }
}

export function GlobeBorders({
  radius = 1.71,
  dataUrl = "/data/world-borders.geojson",
}: {
  radius?: number;
  dataUrl?: string;
}) {
  const [linePositions, setLinePositions] = useState<Float32Array | null>(null);
  const fallbackUrl =
    "https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/country-polygons/ne_110m_admin_0_countries.geojson";

  useEffect(() => {
    let isMounted = true;
    const sources = [dataUrl, fallbackUrl].filter(Boolean);

    const loadBorders = async () => {
      for (const source of sources) {
        try {
          const response = await fetch(source);
          if (!response.ok) {
            continue;
          }
          const data = (await response.json()) as GeoJSONFeatureCollection;
          if (!isMounted) return;
          const positions: number[] = [];
          data.features.forEach((feature) => {
            if (!feature.geometry) return;
            if (feature.geometry.type === "Polygon") {
              const rings = feature.geometry.coordinates as number[][][];
              rings.forEach((ring) => pushRingPositions(ring, radius, positions));
              return;
            }
            const polygons = feature.geometry.coordinates as number[][][][];
            polygons.forEach((polygon) => {
              polygon.forEach((ring) =>
                pushRingPositions(ring, radius, positions)
              );
            });
          });
          setLinePositions(new Float32Array(positions));
          return;
        } catch {
          continue;
        }
      }
      if (isMounted) {
        setLinePositions(null);
      }
    };

    loadBorders();

    return () => {
      isMounted = false;
    };
  }, [dataUrl, radius]);

  const geometry = useMemo(() => {
    if (!linePositions) return null;
    const geom = new BufferGeometry();
    geom.setAttribute("position", new Float32BufferAttribute(linePositions, 3));
    return geom;
  }, [linePositions]);

  if (!geometry) {
    return null;
  }

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#9dd6ff" transparent opacity={0.65} />
    </lineSegments>
  );
}

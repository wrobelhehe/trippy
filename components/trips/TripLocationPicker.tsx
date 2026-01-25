"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TripLocationPickerProps = {
  city: string;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
  error?: string | null;
  onLocationChange: (next: {
    city: string;
    countryCode: string | null;
    lat: number | null;
    lng: number | null;
  }) => void;
};

const DEFAULT_CENTER = { lat: 52.237, lng: 21.017 };

function toCountryName(code: string | null) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function TripLocationPicker({
  city,
  countryCode,
  lat,
  lng,
  error,
  onLocationChange,
}: TripLocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const countryName = useMemo(() => toCountryName(countryCode), [countryCode]);

  useEffect(() => {
    if (!inputRef.current) return;
    const nextValue =
      city && countryName ? `${city}, ${countryName}` : city || "";
    if (inputRef.current.value !== nextValue) {
      inputRef.current.value = nextValue;
    }
  }, [city, countryName]);

  useEffect(() => {
    if (!apiKey) {
      setStatus("error");
      return;
    }

    if (typeof window === "undefined") return;

    if ((window as any).google?.maps) {
      setStatus("ready");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);
    setStatus("loading");

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [apiKey]);

  useEffect(() => {
    if (status !== "ready") return;
    if (!mapRef.current || !inputRef.current) return;

    const googleMaps = (window as any).google as any;
    if (!googleMaps?.maps) return;

    const center = {
      lat: typeof lat === "number" ? lat : DEFAULT_CENTER.lat,
      lng: typeof lng === "number" ? lng : DEFAULT_CENTER.lng,
    };

    if (!mapInstanceRef.current) {
      const map = new googleMaps.maps.Map(mapRef.current, {
        center,
        zoom: typeof lat === "number" && typeof lng === "number" ? 7 : 4,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#111922" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#c9d2e0" }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#0f141c" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0b1f24" }],
          },
        ],
      });

      const marker = new googleMaps.maps.Marker({
        position: center,
        map,
        icon: {
          path: googleMaps.maps.SymbolPath.CIRCLE,
          fillColor: "#3bd3c7",
          fillOpacity: 0.9,
          strokeColor: "#0b0f14",
          strokeOpacity: 0.9,
          strokeWeight: 2,
          scale: 7,
        },
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    if (!autocompleteRef.current) {
      const autocomplete = new googleMaps.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "address_components", "formatted_address", "name"],
          types: ["(cities)"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (!location) return;

      const nextLat = location.lat();
      const nextLng = location.lng();
      const components = place.address_components ?? [];
      const cityComponent =
        components.find((component: any) =>
          component.types.includes("locality")
        ) ??
        components.find((component: any) =>
          component.types.includes("administrative_area_level_1")
        );
      const countryComponent = components.find((component: any) =>
        component.types.includes("country")
      );

      const nextCity = cityComponent?.long_name ?? place.name ?? "";
      const nextCountryCode = countryComponent?.short_name ?? null;

        mapInstanceRef.current?.setCenter({ lat: nextLat, lng: nextLng });
        mapInstanceRef.current?.setZoom(7);
        markerRef.current?.setPosition({ lat: nextLat, lng: nextLng });

      if (inputRef.current && place.formatted_address) {
        inputRef.current.value = place.formatted_address;
      }

        onLocationChange({
          city: nextCity,
          countryCode: nextCountryCode,
          lat: nextLat,
          lng: nextLng,
        });
      });

      autocompleteRef.current = autocomplete;
    }

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter(center);
      markerRef.current.setPosition(center);
    }

    return undefined;
  }, [status, lat, lng, onLocationChange]);

  const hasLocation = Boolean(city || countryCode || (lat !== null && lng !== null));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Where it happened</p>
          <p className="text-xs text-muted-foreground">
            Search the city to lock in the exact location on the map.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <MapPin className="size-3.5 text-[color:var(--sunrise)]" />
          Location
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tripLocation">Search city</Label>
        <Input
          id="tripLocation"
          ref={inputRef}
          placeholder="Search for a city"
          defaultValue={city && countryName ? `${city}, ${countryName}` : city}
          className={cn(
            error && "border-destructive/60 focus-visible:ring-destructive/40"
          )}
        />
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          City
          <p className="mt-2 text-sm font-semibold text-foreground">
            {city || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Country
          <p className="mt-2 text-sm font-semibold text-foreground">
            {countryName || "Not set"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/80",
          status === "error" && "flex items-center justify-center"
        )}
      >
        {status === "error" ? (
          <p className="px-6 text-center text-xs text-muted-foreground">
            Google Maps API key missing. Add
            {" "}
            <span className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
            {" "}
            to enable the map.
          </p>
        ) : null}
        <div
          ref={mapRef}
          className={cn("absolute inset-0", status === "error" && "hidden")}
        />
      </div>
    </div>
  );
}

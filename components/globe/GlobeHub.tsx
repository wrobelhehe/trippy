"use client"

import { useMemo, useState } from "react"
import { Compass, Search } from "lucide-react"

import { MapPin } from "@/components/animate-ui/icons/map-pin"
import { Shine } from "@/components/animate-ui/primitives/effects/shine"
import { Globe } from "@/components/globe/Globe"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type GlobeTrip = {
  id: string
  title: string
  placeName: string
  lat: number | null
  lng: number | null
  momentsCount: number
  mediaCount: number
}

export function GlobeHub({
  trips,
  pins,
}: {
  trips: GlobeTrip[]
  pins: GlobeTrip[]
}) {
  const [query, setQuery] = useState("")
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)

  const filteredTrips = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      return trips
    }
    return trips.filter((trip) =>
      `${trip.title} ${trip.placeName}`.toLowerCase().includes(trimmed)
    )
  }, [query, trips])

  const handleTripSelect = (tripId: string) => {
    setSelectedTripId(tripId)
  }

  const activeTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedTripId) ?? null,
    [selectedTripId, trips]
  )

  return (
    <div className="grid min-h-[calc(100svh-8rem)] gap-6 lg:h-[calc(100svh-8rem)] lg:min-h-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:items-stretch lg:overflow-hidden">
      <Shine
        asChild
        color="rgba(59,211,199,0.35)"
        opacity={0.2}
        enableOnHover
      >
        <Card className="flex h-full flex-col border border-white/10 bg-[color:var(--panel)]/85 py-0 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <CardContent className="h-full px-0 py-0">
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--panel-3)]/85">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.18),_transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="relative h-[60vh] min-h-[420px] lg:h-full">
                <Globe
                  pins={pins}
                  showLabels
                  focusPinId={selectedTripId}
                  controlsEnabled={!selectedTripId}
                  onSelectPin={(pin) => {
                    if (pin?.id) {
                      setSelectedTripId(pin.id)
                    } else {
                      setSelectedTripId(null)
                    }
                  }}
                />
              </div>
              {selectedTripId ? (
                <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-black/50 px-3 py-2 text-[11px] uppercase tracking-[0.32em] text-white/70">
                  Trip focus locked
                </div>
              ) : (
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.32em] text-white/70">
                  Drag to rotate • Scroll to zoom
                </div>
              )}
              {selectedTripId ? (
                <button
                  type="button"
                  onClick={() => setSelectedTripId(null)}
                  className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 hover:border-white/30 hover:bg-black/70"
                >
                  <Compass className="size-3.5" />
                  Back to globe
                </button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Shine>

      <Shine
        asChild
        color="rgba(243,161,95,0.3)"
        opacity={0.2}
        enableOnHover
      >
        <Card className="flex min-h-[360px] flex-col border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur lg:h-full">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Trip atlas</CardTitle>
                <CardDescription>
                  {activeTrip
                    ? `Focused: ${activeTrip.title}. Tap Back to globe to unlock navigation.`
                    : "Focus any trip to glide the globe to its pin."}
                </CardDescription>
              </div>
              <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                {pins.length} pinned
              </Badge>
            </div>
            <InputGroup className="bg-[color:var(--panel-2)]/70">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search trips"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search trips"
              />
            </InputGroup>
          </CardHeader>
          <Separator className="bg-white/10" />
          <CardContent className="flex min-h-0 flex-1 flex-col py-4">
            <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-2 overscroll-contain">
              {filteredTrips.map((trip) => {
                const isPinned = trip.lat !== null && trip.lng !== null
                const isActive = trip.id === selectedTripId
                return (
                  <button
                    key={trip.id}
                    type="button"
                    disabled={!isPinned}
                    onClick={() => handleTripSelect(trip.id)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-3 py-3 text-left",
                      isPinned &&
                        "hover:border-white/20 hover:bg-[color:var(--panel-3)]/80",
                      isActive &&
                        "border-[color:var(--lagoon)]/40 bg-[color:var(--panel-3)]/90 shadow-[0_0_0_1px_rgba(59,211,199,0.2)]",
                      !isPinned && "opacity-60"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {trip.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {trip.placeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isPinned ? (
                        <Badge variant="outline" className="text-[10px]">
                          No location
                        </Badge>
                      ) : null}
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-black/30 text-[10px] text-white/80"
                      >
                        {trip.momentsCount} stories
                      </Badge>
                    </div>
                  </button>
                )
              })}
              {!filteredTrips.length ? (
                <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-6 text-sm text-muted-foreground">
                  No trips match this filter.
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={14} animateOnHover />
              {trips.length} trips • {pins.length} with pins
            </div>
          </CardContent>
        </Card>
      </Shine>
    </div>
  )
}

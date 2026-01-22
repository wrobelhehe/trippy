"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPinned, Search, Sparkles } from "lucide-react";

import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export type TripLibraryItem = {
  id: string;
  title: string;
  placeName: string;
  privacyMode: "private" | "link" | "public";
  momentsCount: number;
  mediaCount: number;
  tags: string[];
  dateLabel: string | null;
  hasPin: boolean;
};

export function TripsLibrary({ trips }: { trips: TripLibraryItem[] }) {
  const [query, setQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [withMedia, setWithMedia] = useState(false);
  const [withMoments, setWithMoments] = useState(false);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    trips.forEach((trip) => {
      trip.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [trips]);

  const filteredTrips = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return trips.filter((trip) => {
      if (trimmed) {
        const haystack = `${trip.title} ${trip.placeName} ${trip.tags.join(" ")}`
          .toLowerCase();
        if (!haystack.includes(trimmed)) return false;
      }

      if (privacyFilter !== "all" && trip.privacyMode !== privacyFilter) {
        return false;
      }

      if (tagFilter !== "all" && !trip.tags.includes(tagFilter)) {
        return false;
      }

      if (pinnedOnly && !trip.hasPin) {
        return false;
      }

      if (withMedia && trip.mediaCount === 0) {
        return false;
      }

      if (withMoments && trip.momentsCount === 0) {
        return false;
      }

      return true;
    });
  }, [
    query,
    trips,
    privacyFilter,
    tagFilter,
    pinnedOnly,
    withMedia,
    withMoments,
  ]);

  if (trips.length === 0) {
    return (
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">Trip library</CardTitle>
              <CardDescription>
                Open a trip to revisit moments, media, and map pins.
              </CardDescription>
            </div>
            <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
              0 trips
            </Badge>
          </div>
          <Separator className="bg-white/10" />
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={MapPinned}
            title="No trips yet"
            description="Create your first trip to start the archive."
            actionLabel="Create a trip"
            actionHref="/trips/new"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">Trip library</CardTitle>
            <CardDescription>
              Open a trip to revisit moments, media, and map pins.
            </CardDescription>
          </div>
          <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
            {filteredTrips.length} trips
          </Badge>
        </div>
        <Separator className="bg-white/10" />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <InputGroup className="bg-[color:var(--panel-2)]/70">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search trips, places, tags"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search trips"
            />
          </InputGroup>
          <div className="flex flex-wrap gap-2">
            <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
              <SelectTrigger className="min-w-[150px] bg-[color:var(--panel-2)]/70">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All privacy</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="min-w-[160px] bg-[color:var(--panel-2)]/70">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          <label className="flex items-center gap-2">
            <Switch checked={pinnedOnly} onCheckedChange={setPinnedOnly} />
            Pinned only
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={withMedia} onCheckedChange={setWithMedia} />
            With media
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={withMoments} onCheckedChange={setWithMoments} />
            With moments
          </label>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTrips.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-6 text-sm text-muted-foreground">
            No trips match the current filters.
          </div>
        ) : (
          <Highlight
            hover
            controlledItems
            className="rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_70%)]"
            itemsClassName="rounded-[28px]"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTrips.map((trip, index) => (
                <HighlightItem key={trip.id}>
                  <Link
                    href={`/trips/${trip.id}`}
                    className="group flex h-full flex-col gap-4 rounded-[28px] border border-white/10 bg-[color:var(--panel-2)]/80 p-5 hover:border-white/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold">{trip.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip.placeName}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {trip.privacyMode}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-black/20 text-[10px] uppercase tracking-[0.2em] text-white/70"
                      >
                        {trip.momentsCount} moments
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-black/20 text-[10px] uppercase tracking-[0.2em] text-white/70"
                      >
                        {trip.mediaCount} media
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-black/20 text-[10px] uppercase tracking-[0.2em] text-white/70"
                      >
                        {trip.hasPin ? "Pinned" : "No pin"}
                      </Badge>
                      <span>{trip.dateLabel ?? "Dates TBD"}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {trip.tags.length
                          ? `${trip.tags.length} tags`
                          : "No tags yet"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-[color:var(--lagoon)]" />
                        Trip #{index + 1}
                      </span>
                    </div>
                  </Link>
                </HighlightItem>
              ))}
            </div>
          </Highlight>
        )}
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { ArrowLeft, MapPinned, Sparkles, Wand2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TripCreateForm } from "@/components/trips/TripCreateForm";
import { listTrips } from "@/lib/supabase/trips";

export default async function NewTripPage() {
  const trips = await listTrips();
  const recentTrips = trips.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--panel)]/85 px-6 py-8 shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,234,217,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[45%] bg-[radial-gradient(circle_at_top,_rgba(171,130,255,0.22),_transparent_70%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
              New trip
            </Badge>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Plot the next chapter on your globe.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Add details, set the mood, and let Trippy thread it into the atlas.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/trips">
              <ArrowLeft className="size-4" />
              Back to trips
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Create a new trip</CardTitle>
            <CardDescription>
              Add the details and let Trippy place it on the atlas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripCreateForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Recent trips</CardTitle>
              <CardDescription>Jump back into the last journeys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTrips.length === 0 ? (
                <EmptyState
                  icon={MapPinned}
                  title="No trips yet"
                  description="Create your first trip to start filling the globe."
                  actionLabel="Explore the globe"
                  actionHref="/globe"
                  size="sm"
                />
              ) : (
                recentTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block rounded-2xl border border-white/10 bg-[color:var(--panel)]/70 px-4 py-3 transition hover:border-white/20 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold">{trip.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {trip.place_name}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-4 text-[color:var(--lagoon)]" />
                Trip blueprint
              </CardTitle>
              <CardDescription>
                Keep the trip vivid with a few extra touches.
              </CardDescription>
            </CardHeader>
            <Separator className="bg-white/10" />
            <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-[color:var(--panel-3)]/80">
                  <Wand2 className="size-4 text-white/80" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Add highlights</p>
                  <p className="text-xs">
                    Capture 3-7 lines to anchor the story.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-[color:var(--panel-3)]/80">
                  <MapPinned className="size-4 text-white/80" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pin the globe</p>
                  <p className="text-xs">
                    Add coordinates so the globe locks the journey in place.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

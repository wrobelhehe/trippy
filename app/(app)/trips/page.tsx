import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TripForm } from "@/components/trips/TripForm";
import { listTrips } from "@/lib/supabase/trips";

export default async function TripsPage() {
  const trips = await listTrips();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Your trips</CardTitle>
          <CardDescription>
            Browse the journeys you have already captured.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 text-sm text-muted-foreground">
              No trips yet. Create one to begin your archive.
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="block rounded-2xl border border-black/5 bg-white/70 px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-base font-semibold">{trip.title}</p>
                  <p className="text-sm text-muted-foreground">{trip.place_name}</p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Create a new trip</CardTitle>
          <CardDescription>
            Add a past journey to your private archive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TripForm />
        </CardContent>
      </Card>
    </div>
  );
}
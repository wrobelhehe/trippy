import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe } from "@/components/globe/Globe";
import { listTrips } from "@/lib/supabase/trips";

export default async function DashboardPage() {
  const trips = await listTrips();
  const pins = trips
    .filter((trip) => trip.lat !== null && trip.lng !== null)
    .map((trip) => ({
      lat: trip.lat as number,
      lng: trip.lng as number,
    }));

  const totalTrips = trips.length;
  const countries = new Set(
    trips.map((trip) => trip.country_code).filter(Boolean)
  );
  const moments = trips.reduce((sum, trip) => sum + trip.moments_count, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Your world of memories</CardTitle>
            <CardDescription>
              Rotate the globe to revisit where your stories live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[360px] rounded-3xl border border-white/40 bg-white/40">
              <Globe pins={pins} showStats />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-black/5 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Trips captured</CardTitle>
              <CardDescription>Past journeys stored securely.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totalTrips}</p>
            </CardContent>
          </Card>
          <Card className="border border-black/5 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Countries remembered</CardTitle>
              <CardDescription>Unique places across your archive.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{countries.size}</p>
            </CardContent>
          </Card>
          <Card className="border border-black/5 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Moments collected</CardTitle>
              <CardDescription>Highlights and journal entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{moments}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
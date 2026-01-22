import { GlobeHub, type GlobeTrip } from "@/components/globe/GlobeHub";
import { listTrips } from "@/lib/supabase/trips";

export default async function GlobePage() {
  const trips = await listTrips();
  const tripData: GlobeTrip[] = trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    placeName: trip.place_name,
    momentsCount: trip.moments_count,
    mediaCount: trip.media_count,
    lat: trip.lat ?? null,
    lng: trip.lng ?? null,
  }));
  const pins = tripData.filter((trip) => trip.lat !== null && trip.lng !== null);

  return <GlobeHub trips={tripData} pins={pins} />;
}

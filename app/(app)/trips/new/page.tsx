import { TripStoryEditor } from "@/components/trips/TripStoryEditor";

export default async function NewTripPage() {
  return <TripStoryEditor mode="create" backHref="/trips" />;
}

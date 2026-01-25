import { SimpleShareLink } from "@/components/share/SimpleShareLink";

export function SharePanel({ tripId }: { tripId: string }) {
  return (
    <SimpleShareLink
      scope="trip"
      tripId={tripId}
      title="Share this trip"
      description="One tap creates a shareable link — no extra settings."
      ctaLabel="Create share link"
    />
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Link2, Pencil } from "lucide-react";

import { ShareTripView } from "@/components/share/ShareTripView";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getTripSharePayloadForLink, type ShareLinkRecord } from "@/lib/share/serializer";
import { listShareLinks } from "@/lib/share/share-links";
import { getTrip } from "@/lib/supabase/trips";

function pickActiveLink(links: ShareLinkRecord[]) {
  const now = Date.now();
  return links.find((link) => {
    if (link.revoked_at) return false;
    if (link.expires_at && new Date(link.expires_at).getTime() <= now) {
      return false;
    }
    return true;
  });
}

export default async function TripPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  const links = (await listShareLinks({
    tripId: trip.id,
    scope: "trip",
  })) as ShareLinkRecord[];
  const activeLink = pickActiveLink(links);
  const previewPayload = activeLink
    ? await getTripSharePayloadForLink(activeLink)
    : null;

  if (!previewPayload) {
    return (
      <EmptyState
        icon={Link2}
        title="No share preview yet"
        description="Create a share link to preview the guest experience."
        actionLabel="Edit trip"
        actionHref={`/trips/${trip.id}/edit`}
        className="border-white/10 bg-[color:var(--panel)]/70"
      />
    );
  }

  return (
    <div className="-mx-4 md:-mx-8">
      <ShareTripView
        payload={previewPayload}
        fullBleed
        headerLabel="Trip preview"
        headerAction={(
          <Button asChild className="gap-2">
            <Link href={`/trips/${trip.id}/edit`}>
              Edit trip
              <Pencil className="size-4" />
            </Link>
          </Button>
        )}
        showGuestCta={false}
      />
    </div>
  );
}

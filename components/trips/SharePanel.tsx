import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareLinkForm } from "@/components/share/ShareLinkForm";
import { ShareLinkList } from "@/components/share/ShareLinkList";
import { listShareLinks } from "@/lib/share/share-links";

export async function SharePanel({ tripId }: { tripId: string }) {
  const links = await listShareLinks({ tripId });

  return (
    <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Share this trip</CardTitle>
        <CardDescription>
          Generate a private link and control what guests can see.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ShareLinkForm tripId={tripId} scope="trip" />
        <ShareLinkList links={links} />
      </CardContent>
    </Card>
  );
}
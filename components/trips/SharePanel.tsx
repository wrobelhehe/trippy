import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareLinksPanel } from "@/components/share/ShareLinksPanel";
import { listShareLinks } from "@/lib/share/share-links";

export async function SharePanel({ tripId }: { tripId: string }) {
  const links = await listShareLinks({ tripId });

  return (
    <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Share this trip</CardTitle>
        <CardDescription>
          Generate a private link and control what guests can see.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShareLinksPanel scope="trip" tripId={tripId} links={links} />
      </CardContent>
    </Card>
  );
}

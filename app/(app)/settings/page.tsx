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

export default async function SettingsPage() {
  const profileLinks = await listShareLinks({ scope: "profile" });

  return (
    <div className="space-y-6">
      <Card className="border border-black/5 bg-white/80 shadow-lg backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Profile sharing</CardTitle>
          <CardDescription>
            Manage your public profile share links and privacy defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ShareLinkForm scope="profile" />
          <ShareLinkList links={profileLinks} />
        </CardContent>
      </Card>
    </div>
  );
}
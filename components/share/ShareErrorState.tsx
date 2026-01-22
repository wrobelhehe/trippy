import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ShareErrorState({
  title = "Share link unavailable",
  description = "This share link is invalid, expired, or has been revoked.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border border-white/10 bg-[color:var(--panel)]/85 p-6 text-sm text-muted-foreground shadow-lg">
      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Return to Trippy</Link>
        </Button>
      </div>
    </Card>
  );
}

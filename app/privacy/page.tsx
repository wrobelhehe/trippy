import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--sand)] px-6 py-12 text-[color:var(--ink)]">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Trippy stores the data you provide to build your memory archive
              and secure share links. We only expose information you explicitly
              choose to share.
            </p>
            <p>
              You can revoke share links at any time. For additional details,
              contact the Trippy team.
            </p>
          </CardContent>
        </Card>
        <Button asChild variant="outline">
          <Link href="/sign-up">Back to sign up</Link>
        </Button>
      </div>
    </div>
  )
}

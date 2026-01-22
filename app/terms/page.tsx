import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[color:var(--sand)] px-6 py-12 text-[color:var(--ink)]">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              These terms outline how Trippy handles your account, content, and
              access to shared links. Keep your credentials secure and only share
              links with people you trust.
            </p>
            <p>
              We may update these terms as the product evolves. For questions,
              reach out to the Trippy team.
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

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyOtp } from "@/lib/supabase/auth";

const statusCopy: Record<string, string> = {
  "check-email": "Check your inbox for a verification link, then confirm here.",
  "recovery-sent": "We sent a recovery link. You can also paste the code here.",
};

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { error?: string; status?: string; email?: string };
}) {
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error.replace(/\+/g, " "))
    : null;
  const statusMessage = searchParams?.status
    ? statusCopy[searchParams.status] ?? "Enter the code from your email."
    : "Enter the code from your email.";

  return (
    <Card className="w-full max-w-lg border border-white/60 bg-white/80 shadow-xl backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </div>
        ) : null}
        <form className="space-y-4" action={verifyOtp}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={searchParams?.email ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Verification code</Label>
            <Input id="token" name="token" type="text" inputMode="numeric" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Flow type</Label>
            <select
              id="type"
              name="type"
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm"
              defaultValue="signup"
            >
              <option value="signup">Email verification</option>
              <option value="recovery">Password recovery</option>
            </select>
          </div>
          <Button className="w-full" type="submit">
            Confirm
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Need to try again?{" "}
        <Link className="text-foreground underline-offset-4 hover:underline" href="/sign-in">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
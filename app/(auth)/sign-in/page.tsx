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
import { Separator } from "@/components/ui/separator";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";

const benefits = [
  "Curate trips like a private gallery.",
  "Share moments without revealing the map.",
  "Collect highlights that stay yours.",
];

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { error?: string; redirectedFrom?: string };
}) {
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error.replace(/\+/g, " "))
    : null;

  return (
    <div className="grid w-full max-w-4xl gap-10 md:grid-cols-[1.1fr_1fr]">
      <section className="hidden flex-col justify-between rounded-3xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur md:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Travel Memory Album
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">
            Come back to the places that still feel like yours.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Trippy keeps your past trips pristine, private, and beautifully easy
            to share.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {benefits.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Card className="w-full border border-white/60 bg-white/80 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to edit your album and manage private shares.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errorMessage}
            </div>
          ) : null}
          <form className="space-y-4" action={signInWithEmail}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams?.redirectedFrom ?? "/dashboard"}
            />
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Or
            </span>
            <Separator className="flex-1" />
          </div>
          <form action={signInWithGoogle}>
            <Button type="submit" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 text-sm">
          <Link className="text-muted-foreground hover:text-foreground" href="/forgot-password">
            Forgot password?
          </Link>
          <p className="text-muted-foreground">
            New here?{" "}
            <Link className="text-foreground underline-offset-4 hover:underline" href="/sign-up">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
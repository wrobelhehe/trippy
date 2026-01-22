"use client";

import { useMemo, useState } from "react";
import { Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileSetupGateProps = {
  email?: string | null;
  avatarUrl?: string | null;
  defaultFirstName?: string | null;
  defaultLastName?: string | null;
};

function toInitials(firstName?: string | null, lastName?: string | null) {
  const letters = [firstName, lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .map((value) => value?.[0]?.toUpperCase());
  if (letters.length) return letters.join("");
  return "ME";
}

export function ProfileSetupGate({
  email,
  avatarUrl,
  defaultFirstName,
  defaultLastName,
}: ProfileSetupGateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initials = useMemo(
    () => toInitials(defaultFirstName, defaultLastName),
    [defaultFirstName, defaultLastName]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to save profile.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--sand)] text-[color:var(--ink)]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-0 size-96 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.25),transparent_70%)]" />
        <div className="absolute -bottom-32 right-0 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(243,161,95,0.25),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(11,15,20,0.4),rgba(11,15,20,0.85))]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="rounded-[32px] border border-white/10 bg-[color:var(--panel)]/90 p-8 shadow-[0_30px_80px_rgba(6,10,16,0.6)] backdrop-blur">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Profile required
                  </p>
                  <h1 className="text-2xl font-semibold md:text-3xl">
                    Name your traveler identity
                  </h1>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Add your first and last name to unlock the app experience.
                    This step cannot be skipped.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3 text-sm text-muted-foreground">
                  <LockKeyhole className="size-4 text-[color:var(--lagoon)]" />
                  <span>Access locked</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-4 py-4 sm:flex-row sm:items-center">
                <Avatar className="size-16 border border-white/10">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar" /> : null}
                  <AvatarFallback className="bg-[color:var(--panel-3)] text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--lagoon)]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="text-foreground">{email ?? "Unknown"}</p>
                </div>
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      defaultValue={defaultFirstName ?? ""}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      defaultValue={defaultLastName ?? ""}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-3)]/60 px-4 py-3 text-xs text-muted-foreground">
                  <span>We use your name across profile shares and headers.</span>
                  <span className="flex items-center gap-2 text-[color:var(--lagoon)]">
                    <Sparkles className="size-3" />
                    Required
                  </span>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Unlocking...
                    </span>
                  ) : (
                    "Save and unlock"
                  )}
                </Button>
              </form>
            </div>
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Complete profile to continue
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ShareLinkForm({
  tripId,
  scope = "trip",
  onCreated,
}: {
  tripId?: string;
  scope?: "trip" | "profile";
  onCreated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setToken(null);

    const formData = new FormData(event.currentTarget);
    const hideExactDates = formData.get("hideExactDates") === "on";
    const allowDownloads = formData.get("allowDownloads") === "on";
    const expiresAt = formData.get("expiresAt")?.toString() || null;

    try {
      const response = await fetch("/api/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope,
          tripId,
          privacyOverrides: {
            hideExactDates,
            allowDownloads,
          },
          expiresAt: expiresAt || null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to create share link.");
      }

      const payload = (await response.json()) as { token: string };
      setToken(payload.token);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create share link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiry date</Label>
        <Input id="expiresAt" name="expiresAt" type="date" />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="hideExactDates" defaultChecked />
          Hide exact dates
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="allowDownloads" />
          Allow media downloads
        </label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Generate share link"}
      </Button>
      {token ? (
        <div className="rounded-2xl border border-black/5 bg-white/70 p-3 text-xs">
          <p className="text-muted-foreground">Share token (copy now):</p>
          <p className="mt-1 font-mono text-sm text-foreground">{token}</p>
        </div>
      ) : null}
    </form>
  );
}
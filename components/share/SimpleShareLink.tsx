"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { storeShareToken } from "@/components/share/shareTokenStore";

type SimpleShareLinkProps = {
  scope: "trip" | "profile";
  tripId?: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export function SimpleShareLink({
  scope,
  tripId,
  title,
  description,
  ctaLabel,
}: SimpleShareLinkProps) {
  const [origin, setOrigin] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    setToken(null);
    setShareLinkId(null);

    try {
      const response = await fetch("/api/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, tripId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to create share link.");
      }

      const payload = (await response.json()) as { token: string; shareLink: { id: string } };
      setToken(payload.token);
      setShareLinkId(payload.shareLink.id);
      storeShareToken(payload.shareLink.id, payload.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create share link.");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl =
    token && origin
      ? `${origin}/s/${scope === "trip" ? "trip" : "profile"}/${token}`
      : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          <Link2 className="size-4 text-[color:var(--lagoon)]" />
          Share
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleCreate} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Creating..." : ctaLabel}
        </Button>
        {shareLinkId ? (
          <p className="text-xs text-muted-foreground">
            Link ready — copy it below and share.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            One tap creates a fresh link you can send right away.
          </p>
        )}
      </div>

      {shareUrl ? (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-[280px] truncate font-mono text-[11px] text-foreground md:max-w-[420px]">
              {shareUrl}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-1"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

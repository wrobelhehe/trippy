"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type ShareLinkItem = {
  id: string;
  scope: "trip" | "profile";
  trip_id: string | null;
  created_at: string;
  revoked_at: string | null;
  expires_at: string | null;
};

export function ShareLinkList({
  links,
  onChange,
}: {
  links: ShareLinkItem[];
  onChange?: () => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (id: string, action: "revoke" | "rotate") => {
    setLoadingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/share-links/${id}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Action failed.");
      }

      onChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setLoadingId(null);
    }
  };

  if (links.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-4 text-sm text-muted-foreground">
        No share links yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      {links.map((link) => (
        <div
          key={link.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-3 text-sm"
        >
          <div>
            <p className="font-medium capitalize">{link.scope} share</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(link.created_at).toLocaleDateString()} •{" "}
              {link.revoked_at ? "Revoked" : "Active"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(link.id, "rotate")}
              disabled={loadingId === link.id}
            >
              Rotate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(link.id, "revoke")}
              disabled={loadingId === link.id}
            >
              Revoke
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
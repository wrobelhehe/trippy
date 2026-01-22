"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getShareToken,
  removeShareToken,
  storeShareToken,
} from "@/components/share/shareTokenStore";

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
  const [origin, setOrigin] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tokenById, setTokenById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!links.length) {
      setTokenById({});
      return;
    }
    const nextTokens: Record<string, string> = {};
    links.forEach((link) => {
      const token = getShareToken(link.id);
      if (token) {
        nextTokens[link.id] = token;
      }
    });
    setTokenById(nextTokens);
  }, [links]);

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

      const payload = (await response.json().catch(() => null)) as
        | { token?: string; shareLink?: { id: string } }
        | null;
      if (action === "rotate" && payload?.token) {
        storeShareToken(id, payload.token);
        setTokenById((prev) => ({ ...prev, [id]: payload.token! }));
      }
      if (action === "revoke") {
        removeShareToken(id);
        setTokenById((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
      onChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setLoadingId(null);
    }
  };

  const shareUrlFor = (link: ShareLinkItem) => {
    const token = tokenById[link.id];
    if (!token || !origin) {
      return null;
    }
    const segment = link.scope === "trip" ? "trip" : "profile";
    return `${origin}/s/${segment}/${token}`;
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
  const formatDate = (value: string | null) =>
    value ? dateFormatter.format(new Date(value)) : "Never";

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  if (links.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="No share links yet"
        description="Generate a link to invite guests or share a profile."
        size="sm"
      />
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      {links.map((link) => {
        const shareUrl = link.revoked_at ? null : shareUrlFor(link);

        return (
          <div
            key={link.id}
          className="space-y-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium capitalize">{link.scope} share</p>
                <p className="text-xs text-muted-foreground">
                  Created {formatDate(link.created_at)} •{" "}
                  {link.revoked_at ? "Revoked" : "Active"} • Expires{" "}
                  {formatDate(link.expires_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {shareUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(link.id, shareUrl)}
                    className="gap-1"
                  >
                    {copiedId === link.id ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedId === link.id ? "Copied" : "Copy link"}
                  </Button>
                ) : null}
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
            {shareUrl ? (
              <div className="rounded-xl border border-white/10 bg-[color:var(--panel-3)]/80 px-3 py-2 text-xs text-muted-foreground">
                <span className="mr-2 uppercase tracking-[0.2em]">Link</span>
                <span className="block max-w-full truncate font-mono text-[11px] text-foreground">
                  {shareUrl}
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {link.revoked_at
                  ? "Link revoked. Rotate to issue a new token."
                  : "Tokens are only shown immediately after creation or rotation."}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

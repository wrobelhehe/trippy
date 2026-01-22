"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker, formatDateInputValue } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { storeShareToken } from "@/components/share/shareTokenStore";

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
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [hideExactDates, setHideExactDates] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [showOwner, setShowOwner] = useState(true);
  const [showProfileBio, setShowProfileBio] = useState(true);
  const [showTripList, setShowTripList] = useState(true);
  const [showTripDescriptions, setShowTripDescriptions] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showGlobe, setShowGlobe] = useState(true);
  const [showHighlights, setShowHighlights] = useState(true);
  const [showMoments, setShowMoments] = useState(true);
  const [showMedia, setShowMedia] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setToken(null);
    setShareLinkId(null);
    setCopied(false);

    const expiresAtValue = expiresAt ? formatDateInputValue(expiresAt) : null;

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
            showOwner,
            showProfileBio,
            showTripList,
            showTripDescriptions,
            showStats,
            showGlobe,
            showHighlights,
            showMoments,
            showMedia,
            showTags,
          },
          expiresAt: expiresAtValue,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to create share link.");
      }

      const payload = (await response.json()) as { token: string; shareLink: { id: string } };
      setToken(payload.token);
      setShareLinkId(payload.shareLink.id);
      storeShareToken(payload.shareLink.id, payload.token);
      onCreated?.();
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

  const isTripShare = scope === "trip";

  const visibilityOptions = isTripShare
    ? [
        {
          id: "showOwner",
          label: "Show traveler card",
          description: "Display the traveler name and avatar.",
          checked: showOwner,
          onChange: setShowOwner,
        },
        {
          id: "showProfileBio",
          label: "Show traveler bio",
          description: "Include the profile bio in the header card.",
          checked: showProfileBio,
          onChange: setShowProfileBio,
        },
        {
          id: "showStats",
          label: "Show summary stats",
          description: "Moments, media, and highlights totals.",
          checked: showStats,
          onChange: setShowStats,
        },
        {
          id: "showGlobe",
          label: "Show globe focus",
          description: "Reveal the trip pin and globe view.",
          checked: showGlobe,
          onChange: setShowGlobe,
        },
        {
          id: "showHighlights",
          label: "Share highlights",
          description: "Expose curated highlight notes.",
          checked: showHighlights,
          onChange: setShowHighlights,
        },
        {
          id: "showTripDescriptions",
          label: "Show trip description",
          description: "Include the short trip summary.",
          checked: showTripDescriptions,
          onChange: setShowTripDescriptions,
        },
        {
          id: "showMoments",
          label: "Share diary moments",
          description: "Include written moments from the trip.",
          checked: showMoments,
          onChange: setShowMoments,
        },
        {
          id: "showMedia",
          label: "Share media gallery",
          description: "Expose shared photos and videos.",
          checked: showMedia,
          onChange: setShowMedia,
        },
        {
          id: "showTags",
          label: "Show trip tags",
          description: "Reveal trip tags and themes.",
          checked: showTags,
          onChange: setShowTags,
        },
      ]
    : [
        {
          id: "showOwner",
          label: "Show profile header",
          description: "Share the traveler name and avatar.",
          checked: showOwner,
          onChange: setShowOwner,
        },
        {
          id: "showProfileBio",
          label: "Show profile bio",
          description: "Include your profile bio text.",
          checked: showProfileBio,
          onChange: setShowProfileBio,
        },
        {
          id: "showStats",
          label: "Show profile stats",
          description: "Totals across shared trips.",
          checked: showStats,
          onChange: setShowStats,
        },
        {
          id: "showGlobe",
          label: "Show globe overview",
          description: "Reveal pinned trip locations.",
          checked: showGlobe,
          onChange: setShowGlobe,
        },
        {
          id: "showTripList",
          label: "Show trip list",
          description: "Display the shared trips list.",
          checked: showTripList,
          onChange: setShowTripList,
        },
        {
          id: "showTripDescriptions",
          label: "Show trip descriptions",
          description: "Include short descriptions for each trip.",
          checked: showTripDescriptions,
          onChange: setShowTripDescriptions,
        },
        {
          id: "showTags",
          label: "Show trip tags",
          description: "Reveal tags on shared trips.",
          checked: showTags,
          onChange: setShowTags,
        },
      ];

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiry date</Label>
        <DatePicker
          id="expiresAt"
          name="expiresAt"
          value={expiresAt}
          onChange={setExpiresAt}
          placeholder="Select expiry date"
        />
        <p className="text-xs text-muted-foreground">
          Uses your local timezone. Format: YYYY-MM-DD.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            id="hideExactDates"
            checked={hideExactDates}
            onCheckedChange={(checked) => setHideExactDates(Boolean(checked))}
          />
          <Label htmlFor="hideExactDates" className="text-sm">
            Hide exact dates
          </Label>
        </div>
        {isTripShare ? (
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              id="allowDownloads"
              checked={allowDownloads}
              onCheckedChange={(checked) => setAllowDownloads(Boolean(checked))}
            />
            <Label htmlFor="allowDownloads" className="text-sm">
              Allow media downloads
            </Label>
          </div>
        ) : null}
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Visibility controls
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {visibilityOptions.map((option) => (
            <label
              key={option.id}
              htmlFor={option.id}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 px-3 py-3 text-left text-sm"
            >
              <Checkbox
                id={option.id}
                checked={option.checked}
                onCheckedChange={(checked) =>
                  option.onChange(Boolean(checked))
                }
              />
              <span className="space-y-1">
                <span className="block text-sm font-medium text-foreground">
                  {option.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating...
          </span>
        ) : (
          "Generate share link"
        )}
      </Button>
      {token && shareUrl ? (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 p-3 text-xs">
          <p className="text-muted-foreground">
            Share link ready. Copy it now — tokens are hidden after you leave.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[color:var(--panel-3)]/80 px-3 py-2">
            <p className="max-w-[280px] truncate font-mono text-xs text-foreground md:max-w-[360px]">
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
          {shareLinkId ? (
            <p className="text-[11px] text-muted-foreground">
              Link ID: {shareLinkId}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

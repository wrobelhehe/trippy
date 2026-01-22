"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { HighlightsEditor } from "@/components/trips/HighlightsEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MIN_HIGHLIGHTS = 3;
const MAX_HIGHLIGHTS = 7;

const normalizeHighlights = (items: string[]) =>
  items.map((item) => item.trim()).filter((item) => item.length > 0);

export function TripHighlightsPanel({
  tripId,
  initialHighlights,
}: {
  tripId: string;
  initialHighlights: string[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<string[]>(
    initialHighlights.length >= MIN_HIGHLIGHTS
      ? initialHighlights
      : Array.from({ length: MIN_HIGHLIGHTS }, () => "")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setItems(
      initialHighlights.length >= MIN_HIGHLIGHTS
        ? initialHighlights
        : Array.from({ length: MIN_HIGHLIGHTS }, () => "")
    );
    setSavedAt(null);
  }, [initialHighlights]);

  const normalized = useMemo(() => normalizeHighlights(items), [items]);
  const canSave =
    normalized.length >= MIN_HIGHLIGHTS && normalized.length <= MAX_HIGHLIGHTS;

  const handleItemsChange = (nextItems: string[]) => {
    setItems(nextItems);
    if (savedAt) {
      setSavedAt(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${tripId}/highlights`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ highlights: items }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to save highlights.");
      }

      setSavedAt(new Date().toLocaleTimeString());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save highlights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-[color:var(--lagoon)]" />
            Trip highlights
          </div>
          <p className="text-xs text-muted-foreground">
            Add {MIN_HIGHLIGHTS}-{MAX_HIGHLIGHTS} lines that capture the mood.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-white/15 bg-black/30 text-[11px] uppercase tracking-[0.24em] text-white/70"
        >
          {normalized.length}/{MAX_HIGHLIGHTS}
        </Badge>
      </div>

      <HighlightsEditor
        value={items}
        onChange={handleItemsChange}
        showHeader={false}
      />

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {savedAt ? `Saved at ${savedAt}` : "Saved highlights sync across the app."}
        </p>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!canSave || loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save highlights"
          )}
        </Button>
      </div>
    </div>
  );
}

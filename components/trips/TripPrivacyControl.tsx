"use client";

import { useEffect, useState } from "react";
import { Globe2, Link2, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIVACY_OPTIONS = [
  {
    value: "private",
    label: "Private",
    description: "Only you can access this trip.",
    icon: Lock,
  },
  {
    value: "link",
    label: "Link",
    description: "Shareable with a secret link.",
    icon: Link2,
  },
  {
    value: "public",
    label: "Public",
    description: "Visible to anyone with the link.",
    icon: Globe2,
  },
];

export function TripPrivacyControl({
  tripId,
  value,
}: {
  tripId: string;
  value: "private" | "link" | "public";
}) {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrivacyMode(value);
  }, [value]);

  const handleChange = async (nextValue: string) => {
    if (nextValue === privacyMode) {
      return;
    }
    const previousValue = privacyMode;
    setPrivacyMode(nextValue as "private" | "link" | "public");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacyMode: nextValue }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to update privacy.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update privacy.");
      setPrivacyMode(previousValue);
    } finally {
      setLoading(false);
    }
  };

  const selectedOption =
    PRIVACY_OPTIONS.find((option) => option.value === privacyMode) ??
    PRIVACY_OPTIONS[0];
  const Icon = selectedOption.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Privacy
        </p>
        <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
          {privacyMode}
        </Badge>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[color:var(--panel-3)]/80">
              <Icon className="size-4 text-white/80" />
            </div>
            <div>
              <p className="text-sm font-semibold">{selectedOption.label}</p>
              <p className="text-xs text-muted-foreground">
                {selectedOption.description}
              </p>
            </div>
          </div>
          <div className="min-w-[150px]">
            <Select
              value={privacyMode}
              onValueChange={handleChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-[color:var(--panel-3)]/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIVACY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Updating privacy…
          </div>
        ) : null}
        {error ? (
          <div className="mt-2 text-xs text-destructive">{error}</div>
        ) : null}
      </div>
    </div>
  );
}

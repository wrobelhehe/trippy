"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MomentForm({
  tripId,
  onCreated,
}: {
  tripId: string;
  onCreated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      contentText: formData.get("contentText"),
      momentTimestamp: formData.get("momentTimestamp") || null,
    };

    try {
      const response = await fetch(`/api/trips/${tripId}/moments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to add moment.");
      }

      form.reset();
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add moment.");
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
        <Label htmlFor="contentText">Moment</Label>
        <Textarea id="contentText" name="contentText" rows={3} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="momentTimestamp">Timestamp</Label>
        <Input id="momentTimestamp" name="momentTimestamp" type="datetime-local" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add moment"}
      </Button>
    </form>
  );
}

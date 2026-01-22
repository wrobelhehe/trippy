"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DatePicker, formatDateInputValue } from "@/components/ui/date-picker";
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
  const [momentDate, setMomentDate] = useState<Date | undefined>(undefined);
  const [momentTime, setMomentTime] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const timestampValue = momentDate
      ? momentTime
        ? `${formatDateInputValue(momentDate)}T${momentTime}`
        : formatDateInputValue(momentDate)
      : null;
    const payload = {
      contentText: formData.get("contentText"),
      momentTimestamp: timestampValue,
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
      setMomentDate(undefined);
      setMomentTime("");
      onCreated?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-4 rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/70 p-4 shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
      onSubmit={handleSubmit}
    >
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
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <DatePicker
            id="momentTimestamp"
            name="momentTimestamp"
            value={momentDate}
            onChange={setMomentDate}
            placeholder="Select date"
          />
          <Input
            id="momentTime"
            type="time"
            value={momentTime}
            onChange={(event) => setMomentTime(event.target.value)}
            aria-label="Time"
            disabled={!momentDate}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Add a time for precise sequencing, or leave it blank.
        </p>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </span>
        ) : (
          "Add moment"
        )}
      </Button>
    </form>
  );
}

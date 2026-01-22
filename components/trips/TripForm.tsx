"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DatePicker, formatDateInputValue } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TripResponse = {
  id: string;
  title: string;
  place_name: string;
};

export function TripForm({
  onCreated,
}: {
  onCreated?: (trip: TripResponse) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = event.currentTarget;

    const formData = new FormData(form);
    const payload = {
      title: formData.get("title"),
      placeName: formData.get("placeName"),
      startDate: startDate ? formatDateInputValue(startDate) : null,
      endDate: endDate ? formatDateInputValue(endDate) : null,
      shortDescription: formData.get("shortDescription") || null,
    };

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to create trip.");
      }

      const trip = (await response.json()) as TripResponse;
      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      onCreated?.(trip);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <div className="rounded-3xl border border-white/10 bg-[color:var(--panel-2)]/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Trip essentials</p>
            <p className="text-xs text-muted-foreground">
              Name the journey and lock in the locale.
            </p>
          </div>
          <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
            Step 01
          </Badge>
        </div>
        <Separator className="my-4 bg-white/10" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Trip title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeName">Place name</Label>
            <Input id="placeName" name="placeName" required />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[color:var(--panel-2)]/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Trip timing</p>
            <p className="text-xs text-muted-foreground">
              Pin the dates or keep them flexible for now.
            </p>
          </div>
          <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
            Step 02
          </Badge>
        </div>
        <Separator className="my-4 bg-white/10" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <DatePicker
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <DatePicker
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[color:var(--panel-2)]/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Trip mood</p>
            <p className="text-xs text-muted-foreground">
              One line that captures the atmosphere.
            </p>
          </div>
          <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
            Step 03
          </Badge>
        </div>
        <Separator className="my-4 bg-white/10" />
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea id="shortDescription" name="shortDescription" rows={3} />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </span>
        ) : (
          "Create trip"
        )}
      </Button>
    </form>
  );
}

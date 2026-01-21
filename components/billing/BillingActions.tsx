"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

async function redirectToStripe(path: string) {
  const response = await fetch(path, { method: "POST" });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Unable to start billing session.");
  }

  const payload = (await response.json()) as { url?: string };

  if (payload.url) {
    window.location.assign(payload.url);
    return;
  }

  throw new Error("Stripe did not return a checkout URL.");
}

export function BillingActions({ isPremium }: { isPremium: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading("checkout");
    setError(null);

    try {
      await redirectToStripe("/api/stripe/checkout");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    setError(null);

    try {
      await redirectToStripe("/api/stripe/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <Button
        className="w-full"
        onClick={isPremium ? handlePortal : handleCheckout}
        disabled={loading !== null}
      >
        {loading
          ? "Redirecting..."
          : isPremium
          ? "Manage subscription"
          : "Upgrade to Premium"}
      </Button>
      {isPremium ? (
        <Button
          className="w-full"
          variant="outline"
          onClick={handlePortal}
          disabled={loading !== null}
        >
          Open billing portal
        </Button>
      ) : null}
    </div>
  );
}
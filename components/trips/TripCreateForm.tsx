"use client";

import { useRouter } from "next/navigation";

import { TripForm } from "@/components/trips/TripForm";

export function TripCreateForm() {
  const router = useRouter();

  return (
    <TripForm onCreated={(trip) => router.push(`/trips/${trip.id}`)} />
  );
}

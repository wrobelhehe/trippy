import { NextResponse } from "next/server";

import { createTrip, listTrips } from "@/lib/supabase/trips";

export async function GET() {
  try {
    const trips = await listTrips();
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.title || !body?.placeName) {
      return NextResponse.json(
        { error: "Title and place name are required." },
        { status: 400 }
      );
    }

    const trip = await createTrip({
      title: body.title,
      placeName: body.placeName,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      shortDescription: body.shortDescription ?? null,
      coverMediaId: body.coverMediaId ?? null,
      tags: body.tags ?? [],
      privacyMode: body.privacyMode ?? "private",
      hideExactDates: body.hideExactDates ?? true,
      countryCode: body.countryCode ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create trip" },
      { status: 500 }
    );
  }
}
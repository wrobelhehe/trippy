import { NextResponse } from "next/server";

import { getTrip, softDeleteTrip, updateTrip } from "@/lib/supabase/trips";

export async function GET(
  _request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const trip = await getTrip(params.tripId);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load trip" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const body = await request.json();
    const trip = await updateTrip(params.tripId, {
      title: body.title,
      placeName: body.placeName,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      shortDescription: body.shortDescription ?? null,
      coverMediaId: body.coverMediaId ?? null,
      tags: body.tags,
      privacyMode: body.privacyMode,
      hideExactDates: body.hideExactDates,
      countryCode: body.countryCode,
      lat: body.lat,
      lng: body.lng,
    });

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    await softDeleteTrip(params.tripId);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete trip" },
      { status: 500 }
    );
  }
}
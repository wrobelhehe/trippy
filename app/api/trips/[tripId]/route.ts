import { NextResponse } from "next/server";

import { getTrip, softDeleteTrip, updateTrip } from "@/lib/supabase/trips";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const trip = await getTrip(tripId);

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
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const body = await request.json();
    const trip = await updateTrip(tripId, {
      title: body.title,
      placeName: body.placeName,
      storyPreset: body.storyPreset,
      startDate: body.startDate,
      endDate: body.endDate,
      shortDescription: body.shortDescription,
      coverMediaId: body.coverMediaId,
      tags: body.tags,
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
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    await softDeleteTrip(tripId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete trip" },
      { status: 500 }
    );
  }
}

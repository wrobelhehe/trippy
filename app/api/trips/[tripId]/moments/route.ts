import { NextResponse } from "next/server";

import { createMoment, listMoments } from "@/lib/supabase/moments";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const moments = await listMoments(tripId);
    return NextResponse.json(moments);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load moments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const body = await request.json();

    if (!body?.contentText) {
      return NextResponse.json(
        { error: "Moment content is required." },
        { status: 400 }
      );
    }

    const moment = await createMoment(tripId, {
      contentText: body.contentText,
      momentTimestamp: body.momentTimestamp,
      orderIndex: body.orderIndex,
      lat: body.lat,
      lng: body.lng,
    });

    return NextResponse.json(moment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create moment" },
      { status: 500 }
    );
  }
}

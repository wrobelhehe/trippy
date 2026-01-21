import { NextResponse } from "next/server";

import { createMoment, listMoments } from "@/lib/supabase/moments";

export async function GET(
  _request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const moments = await listMoments(params.tripId);
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
  { params }: { params: { tripId: string } }
) {
  try {
    const body = await request.json();

    if (!body?.contentText) {
      return NextResponse.json(
        { error: "Moment content is required." },
        { status: 400 }
      );
    }

    const moment = await createMoment(params.tripId, {
      contentText: body.contentText,
      momentTimestamp: body.momentTimestamp ?? null,
      orderIndex: body.orderIndex ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
    });

    return NextResponse.json(moment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create moment" },
      { status: 500 }
    );
  }
}
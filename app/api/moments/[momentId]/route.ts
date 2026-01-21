import { NextResponse } from "next/server";

import { softDeleteMoment, updateMoment } from "@/lib/supabase/moments";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const { momentId } = await params;
    const body = await request.json();
    const moment = await updateMoment(momentId, {
      contentText: body.contentText,
      momentTimestamp: body.momentTimestamp,
      orderIndex: body.orderIndex,
      lat: body.lat,
      lng: body.lng,
    });

    return NextResponse.json(moment);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update moment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const { momentId } = await params;
    await softDeleteMoment(momentId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete moment" },
      { status: 500 }
    );
  }
}

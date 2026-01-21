import { NextResponse } from "next/server";

import { softDeleteMoment, updateMoment } from "@/lib/supabase/moments";

export async function PATCH(
  request: Request,
  { params }: { params: { momentId: string } }
) {
  try {
    const body = await request.json();
    const moment = await updateMoment(params.momentId, {
      contentText: body.contentText,
      momentTimestamp: body.momentTimestamp ?? null,
      orderIndex: body.orderIndex ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
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
  { params }: { params: { momentId: string } }
) {
  try {
    await softDeleteMoment(params.momentId);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete moment" },
      { status: 500 }
    );
  }
}
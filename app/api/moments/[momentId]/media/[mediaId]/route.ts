import { NextResponse } from "next/server";

import { detachMediaFromMoment, updateMomentMediaOrder } from "@/lib/supabase/media";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ momentId: string; mediaId: string }> }
) {
  try {
    const { momentId, mediaId } = await params;
    const body = await request.json();
    const orderIndex = Number(body?.orderIndex);

    if (!Number.isFinite(orderIndex)) {
      return NextResponse.json(
        { error: "orderIndex must be a number." },
        { status: 400 }
      );
    }

    await updateMomentMediaOrder(momentId, mediaId, orderIndex);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update media order",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ momentId: string; mediaId: string }> }
) {
  try {
    const { momentId, mediaId } = await params;
    await detachMediaFromMoment(momentId, mediaId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete media",
      },
      { status: 500 }
    );
  }
}

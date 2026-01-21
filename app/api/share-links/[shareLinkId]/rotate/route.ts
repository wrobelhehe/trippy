import { NextResponse } from "next/server";

import { rotateShareLink } from "@/lib/share/share-links";

export async function POST(
  _request: Request,
  { params }: { params: { shareLinkId: string } }
) {
  try {
    const result = await rotateShareLink(params.shareLinkId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rotate share link" },
      { status: 500 }
    );
  }
}
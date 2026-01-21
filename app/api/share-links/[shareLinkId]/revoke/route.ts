import { NextResponse } from "next/server";

import { revokeShareLink } from "@/lib/share/share-links";

export async function POST(
  _request: Request,
  { params }: { params: { shareLinkId: string } }
) {
  try {
    await revokeShareLink(params.shareLinkId);
    return NextResponse.json({ revoked: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to revoke share link" },
      { status: 500 }
    );
  }
}
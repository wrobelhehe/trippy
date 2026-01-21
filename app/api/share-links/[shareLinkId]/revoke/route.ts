import { NextResponse } from "next/server";

import { revokeShareLink } from "@/lib/share/share-links";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ shareLinkId: string }> }
) {
  try {
    const { shareLinkId } = await params;
    await revokeShareLink(shareLinkId);
    return NextResponse.json({ revoked: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to revoke share link" },
      { status: 500 }
    );
  }
}

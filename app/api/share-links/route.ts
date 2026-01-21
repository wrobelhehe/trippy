import { NextResponse } from "next/server";

import { createShareLink } from "@/lib/share/share-links";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scope = body?.scope;

    if (scope !== "trip" && scope !== "profile") {
      return NextResponse.json(
        { error: "Invalid scope." },
        { status: 400 }
      );
    }

    if (scope === "trip" && !body?.tripId) {
      return NextResponse.json(
        { error: "tripId is required for trip shares." },
        { status: 400 }
      );
    }

    const result = await createShareLink({
      scope,
      tripId: body.tripId ?? null,
      privacyOverrides: body.privacyOverrides ?? {},
      expiresAt: body.expiresAt ?? null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create share link" },
      { status: 500 }
    );
  }
}
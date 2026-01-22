import { NextResponse } from "next/server";

import {
  getTripHighlights,
  saveTripHighlights,
} from "@/lib/supabase/highlights";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const highlights = await getTripHighlights(tripId);
    return NextResponse.json({ highlights });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load highlights",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const body = await request.json();
    const highlights = await saveTripHighlights(tripId, body?.highlights ?? []);
    return NextResponse.json({ highlights });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save highlights",
      },
      { status: 500 }
    );
  }
}

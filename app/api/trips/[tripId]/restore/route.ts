import { NextResponse } from "next/server";

import { restoreTrip } from "@/lib/supabase/trips";

export async function POST(
  _request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    await restoreTrip(params.tripId);
    return NextResponse.json({ restored: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to restore trip" },
      { status: 500 }
    );
  }
}
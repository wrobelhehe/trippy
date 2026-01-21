import { NextResponse } from "next/server";

import { restoreTrip } from "@/lib/supabase/trips";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    await restoreTrip(tripId);
    return NextResponse.json({ restored: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to restore trip" },
      { status: 500 }
    );
  }
}

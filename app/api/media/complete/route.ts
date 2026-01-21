import { NextResponse } from "next/server";

import {
  attachMediaToMoment,
  attachMediaToTrip,
  createMedia,
} from "@/lib/supabase/media";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.storagePath || !body?.mediaType) {
      return NextResponse.json(
        { error: "storagePath and mediaType are required." },
        { status: 400 }
      );
    }

    const media = await createMedia({
      mediaType: body.mediaType,
      storageBucket: "user-media",
      storagePath: body.storagePath,
      thumbPath: body.thumbPath ?? null,
      width: body.width ?? null,
      height: body.height ?? null,
      durationSeconds: body.durationSeconds ?? null,
      sizeBytes: body.sizeBytes ?? null,
    });

    if (body.tripId) {
      await attachMediaToTrip(body.tripId, media.id);
    }

    if (body.momentId) {
      await attachMediaToMoment(body.momentId, media.id);
    }

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to finalize media" },
      { status: 500 }
    );
  }
}
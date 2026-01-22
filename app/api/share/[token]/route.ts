import { NextResponse } from "next/server";

import { checkShareRateLimit } from "@/lib/share/rate-limit";
import { getSharePayload } from "@/lib/share/serializer";

export const dynamic = "force-dynamic";

function getClientKey(token: string, headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  const forwardedHost = headers.get("x-forwarded-host");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "unknown";
  return `${ip}:${forwardedHost ?? "share"}:${token}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Missing share token." }, { status: 400 });
    }

    const limit = checkShareRateLimit(getClientKey(token, request.headers));

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfter ?? 60),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const payload = await getSharePayload(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Share link not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load share payload",
      },
      { status: 500 }
    );
  }
}

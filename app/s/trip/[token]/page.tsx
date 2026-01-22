import { headers } from "next/headers";

import { ShareErrorState } from "@/components/share/ShareErrorState";
import { ShareTripView } from "@/components/share/ShareTripView";
import type { ShareTripPayload } from "@/lib/share/serializer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchSharePayload(token: string) {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const fallback = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const baseUrl = host ? `${protocol}://${host}` : fallback;

  const response = await fetch(`${baseUrl}/api/share/${token}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ShareTripPayload;
}

export default async function ShareTripPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = await fetchSharePayload(token);

  if (!payload || payload.scope !== "trip") {
    return (
      <div className="min-h-screen bg-[color:var(--sand)] px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <ShareErrorState />
        </div>
      </div>
    );
  }

  return <ShareTripView payload={payload} />;
}

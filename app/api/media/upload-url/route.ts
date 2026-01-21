import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const fileName = String(body?.fileName ?? "");
    const contentType = String(body?.contentType ?? "");

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required." },
        { status: 400 }
      );
    }

    const extension = fileName.split(".").pop() ?? "";
    const path = `${data.user.id}/${crypto.randomUUID()}.${extension}`;

    const { data: signed, error } = await supabase.storage
      .from("user-media")
      .createSignedUploadUrl(path, {
        contentType: contentType || undefined,
      });

    if (error || !signed) {
      return NextResponse.json(
        { error: error?.message ?? "Unable to create upload URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path,
      uploadUrl: signed.signedUrl,
      token: signed.token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
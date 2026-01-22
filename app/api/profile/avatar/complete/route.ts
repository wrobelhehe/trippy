import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const storagePath = String(body?.storagePath ?? "");

    if (!storagePath) {
      return NextResponse.json(
        { error: "storagePath is required." },
        { status: 400 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("profile-avatars")
      .getPublicUrl(storagePath);

    if (!publicUrl?.publicUrl) {
      return NextResponse.json(
        { error: "Unable to generate avatar URL." },
        { status: 500 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl.publicUrl })
      .eq("id", data.user.id)
      .select("avatar_url")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ avatar_url: profile.avatar_url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update avatar" },
      { status: 500 }
    );
  }
}

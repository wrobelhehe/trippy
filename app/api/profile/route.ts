import { NextResponse } from "next/server";

import { updateProfile } from "@/lib/supabase/profile";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const firstNameRaw =
      typeof body?.firstName === "string" ? body.firstName.trim() : undefined;
    const lastNameRaw =
      typeof body?.lastName === "string" ? body.lastName.trim() : undefined;
    const birthDateRaw =
      typeof body?.birthDate === "string" ? body.birthDate.trim() : undefined;
    const bioRaw = typeof body?.bio === "string" ? body.bio.trim() : undefined;

    const updates: Record<string, string | null> = {};
    const hasNameUpdate =
      firstNameRaw !== undefined || lastNameRaw !== undefined;

    if (hasNameUpdate) {
      if (!firstNameRaw || !lastNameRaw) {
        return NextResponse.json(
          { error: "First and last name are required." },
          { status: 400 }
        );
      }
      updates.first_name = firstNameRaw;
      updates.last_name = lastNameRaw;
      updates.display_name = `${firstNameRaw} ${lastNameRaw}`.trim();
    }

    if (birthDateRaw !== undefined) {
      if (birthDateRaw && !datePattern.test(birthDateRaw)) {
        return NextResponse.json(
          { error: "Birth date must be in YYYY-MM-DD format." },
          { status: 400 }
        );
      }
      updates.birth_date = birthDateRaw || null;
    }

    if (bioRaw !== undefined) {
      updates.bio = bioRaw || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No updates provided." },
        { status: 400 }
      );
    }

    const profile = await updateProfile(updates);
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile update failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

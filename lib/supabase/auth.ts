"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const DEFAULT_REDIRECT = "/dashboard";

async function getOrigin() {
  const headerList = await headers();
  return headerList.get("origin") ?? "http://localhost:3000";
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? DEFAULT_REDIRECT);
  const safeRedirectTo =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : DEFAULT_REDIRECT;

  if (!email || !password) {
    redirect("/sign-in?error=Missing+email+or+password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(safeRedirectTo);
}

export async function signInWithGoogle(formData?: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const redirectTo = String(formData?.get("redirectTo") ?? DEFAULT_REDIRECT);
  const safeRedirectTo =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : DEFAULT_REDIRECT;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        safeRedirectTo
      )}`,
    },
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect("/sign-in?error=Unable+to+start+Google+sign-in");
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const origin = await getOrigin();

  if (!email || !password) {
    redirect("/sign-up?error=Missing+email+or+password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/verify?status=check-email&email=${encodeURIComponent(email)}`);
}

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const type = String(formData.get("type") ?? "signup");

  if (!email || !token) {
    redirect("/verify?error=Missing+verification+details");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: type === "recovery" ? "recovery" : "signup",
  });

  if (error) {
    redirect(`/verify?error=${encodeURIComponent(error.message)}`);
  }

  redirect(DEFAULT_REDIRECT);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const origin = await getOrigin();

  if (!email) {
    redirect("/forgot-password?error=Email+is+required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/forgot-password?status=sent&email=${encodeURIComponent(email)}`);
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    redirect("/reset-password?error=Password+is+required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(DEFAULT_REDIRECT);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

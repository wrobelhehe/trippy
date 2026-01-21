import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const DEFAULT_REDIRECT = "/dashboard";

function getOrigin() {
  return headers().get("origin") ?? "http://localhost:3000";
}

export async function signInWithEmail(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? DEFAULT_REDIRECT);

  if (!email || !password) {
    redirect("/sign-in?error=Missing+email+or+password");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function signInWithGoogle() {
  "use server";

  const supabase = createClient();
  const origin = getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
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
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const origin = getOrigin();

  if (!email || !password) {
    redirect("/sign-up?error=Missing+email+or+password");
  }

  const supabase = createClient();
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
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const type = String(formData.get("type") ?? "signup");

  if (!email || !token) {
    redirect("/verify?error=Missing+verification+details");
  }

  const supabase = createClient();
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
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const origin = getOrigin();

  if (!email) {
    redirect("/forgot-password?error=Email+is+required");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/verify?status=recovery-sent&email=${encodeURIComponent(email)}`);
}

export async function updatePassword(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");

  if (!password) {
    redirect("/reset-password?error=Password+is+required");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(DEFAULT_REDIRECT);
}

export async function signOut() {
  "use server";

  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
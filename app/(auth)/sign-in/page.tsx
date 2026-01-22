import { LoginForm } from "@/components/auth/LoginForm";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectedFrom?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error
    ? decodeURIComponent(params.error.replace(/\+/g, " "))
    : null;

  return (
    <LoginForm
      errorMessage={errorMessage}
      redirectTo={params?.redirectedFrom ?? "/dashboard"}
      onEmailSignIn={signInWithEmail}
      onGoogleSignIn={signInWithGoogle}
    />
  );
}

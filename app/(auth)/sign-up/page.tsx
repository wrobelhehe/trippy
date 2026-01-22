import { SignupForm } from "@/components/auth/SignupForm";
import { signInWithGoogle, signUpWithEmail } from "@/lib/supabase/auth";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error
    ? decodeURIComponent(params.error.replace(/\+/g, " "))
    : null;

  return (
    <SignupForm
      errorMessage={errorMessage}
      onSignUp={signUpWithEmail}
      onGoogleSignIn={signInWithGoogle}
    />
  );
}

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "@/lib/supabase/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error
    ? decodeURIComponent(params.error.replace(/\+/g, " "))
    : null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const hasSession = Boolean(data.session);

  return (
    <ResetPasswordForm
      errorMessage={errorMessage}
      isValid={hasSession}
      onUpdatePassword={updatePassword}
    />
  );
}

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error
    ? decodeURIComponent(params.error.replace(/\+/g, " "))
    : null;
  const statusMessage =
    params?.status === "sent"
      ? "Email sent. Check your inbox for the recovery link."
      : null;

  return (
    <ForgotPasswordForm errorMessage={errorMessage} statusMessage={statusMessage} />
  );
}

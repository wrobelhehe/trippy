import { VerifyForm } from "@/components/auth/VerifyForm";

const statusCopy: Record<string, string> = {
  "check-email":
    "Check your inbox and click the confirmation link to finish signing up.",
  "recovery-sent": "We sent a recovery link. You can also paste the code here.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string; email?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error
    ? decodeURIComponent(params.error.replace(/\+/g, " "))
    : null;
  const statusMessage = params?.status
    ? statusCopy[params.status] ?? "Enter the code from your email."
    : "Enter the code from your email.";
  const defaultType = params?.status === "recovery-sent" ? "recovery" : "signup";
  const showCode = params?.status !== "check-email";

  return (
    <VerifyForm
      errorMessage={errorMessage}
      statusMessage={statusMessage}
      email={params?.email ?? ""}
      defaultType={defaultType}
      showCode={showCode}
    />
  );
}

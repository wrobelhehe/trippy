import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/supabase/auth";

export function ForgotPasswordForm({
  errorMessage,
  statusMessage,
}: {
  errorMessage?: string | null;
  statusMessage?: string | null;
}) {
  return (
    <form action={requestPasswordReset} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Recover access
          </p>
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <FieldDescription>
            We will email a secure recovery link.
          </FieldDescription>
        </div>
        {statusMessage ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
            {statusMessage}
          </div>
        ) : null}
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Button type="submit" className="w-full">
          Send recovery link
        </Button>
      </FieldGroup>
      <FieldDescription className="text-center">
        Remembered your password?{" "}
        <Link className="underline underline-offset-4" href="/sign-in">
          Back to sign in
        </Link>
      </FieldDescription>
    </form>
  );
}

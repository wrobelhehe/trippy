"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
type ResetPasswordFormProps = {
  errorMessage?: string | null;
  isValid?: boolean;
  onUpdatePassword: (formData: FormData) => void | Promise<void>;
};

export function ResetPasswordForm({
  errorMessage,
  isValid = true,
  onUpdatePassword,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isValid) {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Reset link invalid
            </p>
            <h1 className="text-2xl font-semibold">Request a new link</h1>
            <FieldDescription>
              This recovery link is missing or expired. Generate a new one to
              continue.
            </FieldDescription>
          </div>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </FieldGroup>
        <FieldDescription className="text-center">
          <Link className="underline underline-offset-4" href="/sign-in">
            Back to sign in
          </Link>
        </FieldDescription>
      </div>
    );
  }

  return (
    <form action={onUpdatePassword} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Secure your album
          </p>
          <h1 className="text-2xl font-semibold">Choose a new password</h1>
          <FieldDescription>
            Set a fresh password for your Trippy account.
          </FieldDescription>
        </div>
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FieldDescription>Use at least 8 characters.</FieldDescription>
        </Field>
        <Button type="submit" className="w-full">
          Update password
        </Button>
      </FieldGroup>
      <FieldDescription className="text-center">
        <Link className="underline underline-offset-4" href="/sign-in">
          Back to sign in
        </Link>
      </FieldDescription>
    </form>
  );
}

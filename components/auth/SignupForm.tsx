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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
type SignupFormProps = {
  errorMessage?: string | null;
  onSignUp: (formData: FormData) => void | Promise<void>;
  onGoogleSignIn: (formData: FormData) => void | Promise<void>;
};

export function SignupForm({
  errorMessage,
  onSignUp,
  onGoogleSignIn,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    if (password && confirmPassword && password !== confirmPassword) {
      event.preventDefault();
      setClientError("Passwords do not match.");
    }
  };

  return (
    <form action={onSignUp} className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Start your archive
          </p>
          <h1 className="text-2xl font-semibold">Create a Trippy account</h1>
          <FieldDescription>
            Store trips, stories, and share links in one place.
          </FieldDescription>
        </div>
        {clientError ? <FieldError>{clientError}</FieldError> : null}
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="pr-10"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (clientError) {
                  setClientError(null)
                }
              }}
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
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              className="pr-10"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                if (clientError) {
                  setClientError(null)
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </Field>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </FieldGroup>
      <FieldSeparator>Or continue with</FieldSeparator>
      <input type="hidden" name="redirectTo" value="/dashboard" />
      <Button variant="outline" type="submit" formAction={onGoogleSignIn}>
        Continue with Google
      </Button>
      <FieldDescription className="text-center">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/sign-in">
          Sign in
        </Link>
      </FieldDescription>
      <FieldDescription className="text-center text-xs">
        By creating an account, you agree to the{" "}
        <Link href="/terms">Terms</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </form>
  );
}

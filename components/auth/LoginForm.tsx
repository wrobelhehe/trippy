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
type LoginFormProps = {
  errorMessage?: string | null;
  redirectTo?: string;
  onEmailSignIn: (formData: FormData) => void | Promise<void>;
  onGoogleSignIn: (formData: FormData) => void | Promise<void>;
};

export function LoginForm({
  errorMessage,
  redirectTo,
  onEmailSignIn,
  onGoogleSignIn,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={onEmailSignIn} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="text-2xl font-semibold">Sign in to Trippy</h1>
          <FieldDescription>
            Return to your memory album and private shares.
          </FieldDescription>
        </div>
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
          <FieldDescription>
            Use the password you created. Minimum 8 characters.
          </FieldDescription>
        </Field>
        <Input
          type="hidden"
          name="redirectTo"
          value={redirectTo ?? "/dashboard"}
          className="hidden"
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </FieldGroup>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Button variant="outline" type="submit" formAction={onGoogleSignIn}>
        Continue with Google
      </Button>
      <FieldDescription className="text-center">
        New here?{" "}
        <Link className="underline underline-offset-4" href="/sign-up">
          Create an account
        </Link>
      </FieldDescription>
    </form>
  );
}

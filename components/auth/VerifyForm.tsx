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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOtp } from "@/lib/supabase/auth";

export function VerifyForm({
  errorMessage,
  statusMessage,
  email,
  defaultType = "signup",
  showCode = true,
}: {
  errorMessage?: string | null;
  statusMessage: string;
  email?: string | null;
  defaultType?: "signup" | "recovery";
  showCode?: boolean;
}) {
  if (!showCode) {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Verify access
            </p>
            <h1 className="text-2xl font-semibold">Confirm your email</h1>
            <FieldDescription>{statusMessage}</FieldDescription>
          </div>
          {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={email ?? ""}
              readOnly
              className="bg-muted/40"
            />
          </Field>
          <Button asChild className="w-full">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </FieldGroup>
        <FieldDescription className="text-center">
          Didn’t receive the email? Check spam or request a new link from sign
          in.
        </FieldDescription>
      </div>
    );
  }

  return (
    <form action={verifyOtp} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Verify access
          </p>
          <h1 className="text-2xl font-semibold">Confirm your email</h1>
          <FieldDescription>{statusMessage}</FieldDescription>
        </div>
        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={email ?? ""}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="token">Verification code</FieldLabel>
          <InputOTP id="token" name="token" maxLength={6} required>
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Input type="hidden" name="type" value={defaultType} className="hidden" />
        <Button type="submit" className="w-full">
          Verify and continue
        </Button>
      </FieldGroup>
      <FieldDescription className="text-center">
        Need to try again?{" "}
        <Link className="underline underline-offset-4" href="/sign-in">
          Back to sign in
        </Link>
      </FieldDescription>
    </form>
  );
}

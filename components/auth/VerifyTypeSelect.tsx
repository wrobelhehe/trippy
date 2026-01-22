"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VerifyTypeSelect({
  defaultValue = "signup",
}: {
  defaultValue?: "signup" | "recovery";
}) {
  const [value, setValue] = useState<"signup" | "recovery">(defaultValue);

  return (
    <div className="space-y-2">
      <Label htmlFor="type">Flow type</Label>
      <Select value={value} onValueChange={(nextValue) => setValue(nextValue as typeof value)}>
        <SelectTrigger id="type" className="w-full">
          <SelectValue placeholder="Select flow" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="signup">Email verification</SelectItem>
          <SelectItem value="recovery">Password recovery</SelectItem>
        </SelectContent>
      </Select>
      <Input type="hidden" name="type" value={value} className="hidden" />
    </div>
  );
}

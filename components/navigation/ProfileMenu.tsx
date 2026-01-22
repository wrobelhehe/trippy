"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Settings, UserRound } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Profile & sharing", href: "/profile", icon: Settings },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

export function ProfileMenu({
  userEmail,
  userName,
  userAvatarUrl,
  trigger,
}: {
  userEmail: string;
  userName?: string;
  userAvatarUrl?: string | null;
  trigger?: React.ReactElement;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initials = useMemo(() => {
    if (userName) {
      const parts = userName.split(" ").filter(Boolean);
      const letters = parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
      if (letters) return letters;
    }
    if (!userEmail) return "ME";
    const [namePart] = userEmail.split("@");
    if (!namePart) return "ME";
    const letters = namePart.replace(/[^a-zA-Z0-9]/g, "");
    return letters.slice(0, 2).toUpperCase() || "ME";
  }, [userEmail, userName]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-10 w-10 rounded-full border border-white/10 bg-white/5"
      />
    );
  }

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
      aria-label="Open profile menu"
    >
      <Avatar className="h-8 w-8">
        {userAvatarUrl ? (
          <AvatarImage src={userAvatarUrl} alt={userName ?? userEmail} />
        ) : null}
        <AvatarFallback className="bg-transparent text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger ?? defaultTrigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <UserRound className="size-4 text-white/70" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Signed in
            </p>
            <p className="text-sm font-medium text-foreground">
              {userName ?? userEmail}
            </p>
            {userName ? (
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.href}
              onSelect={(event) => {
                event.preventDefault();
                router.push(item.href);
              }}
              className="gap-2"
            >
              <Icon className="size-4 text-white/70" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

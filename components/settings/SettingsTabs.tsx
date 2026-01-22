"use client";

import { useId, useMemo, useState } from "react";
import { Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Profile } from "@/lib/supabase/profile";
import { type ShareLinkItem } from "@/components/share/ShareLinkList";
import { ShareLinksPanel } from "@/components/share/ShareLinksPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker, formatDateInputValue } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { Textarea } from "@/components/ui/textarea";

type SettingsTabsProps = {
  profile: Profile | null;
  profileLinks: ShareLinkItem[];
};

const MAX_AVATAR_SIZE_MB = 5;

function toDisplayName(profile: Profile | null) {
  if (!profile) return "Traveler";
  const names = [profile.first_name, profile.last_name]
    .map((value) => value?.trim())
    .filter(Boolean);
  if (names.length) return names.join(" ");
  if (profile.display_name) return profile.display_name;
  return "Traveler";
}

function toInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "ME";
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase());
  return initials.join("") || "ME";
}

function parseBirthDate(value?: string | null) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function ProfileDetailsForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    parseBirthDate(profile?.birth_date)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    const formData = new FormData(event.currentTarget);

    const payload = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      birthDate: birthDate ? formatDateInputValue(birthDate) : "",
      bio: String(formData.get("bio") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to update profile.");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Personal details</CardTitle>
        <CardDescription>
          Keep your profile accurate so trip memories feel personal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          ) : null}
          {saved ? (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
              Profile saved. Your changes are live.
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={profile?.first_name ?? ""}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={profile?.last_name ?? ""}
                autoComplete="family-name"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth date (optional)</Label>
              <DatePicker
                id="birthDate"
                name="birthDate"
                value={birthDate}
                onChange={setBirthDate}
                placeholder="Select a date"
                buttonClassName="bg-[color:var(--panel-2)]/80 border-white/10"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-9 text-xs uppercase tracking-[0.2em] text-muted-foreground"
              onClick={() => setBirthDate(undefined)}
            >
              Clear date
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio ?? ""}
              placeholder="A short line about how you collect memories."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save profile"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Your name is required to unlock the app.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AvatarPanel({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const inputId = useId();

  const displayName = useMemo(() => toDisplayName(profile), [profile]);
  const initials = useMemo(() => toInitials(displayName), [displayName]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file.");
      }
      if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
        throw new Error(`Avatar must be under ${MAX_AVATAR_SIZE_MB}MB.`);
      }

      const uploadResponse = await fetch("/api/profile/avatar/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        const payload = await uploadResponse.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to start upload.");
      }

      const uploadPayload = (await uploadResponse.json()) as {
        uploadUrl: string;
        path: string;
      };

      const putResponse = await fetch(uploadPayload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!putResponse.ok) {
        throw new Error("Upload failed.");
      }

      const completeResponse = await fetch("/api/profile/avatar/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath: uploadPayload.path,
        }),
      });

      if (!completeResponse.ok) {
        const payload = await completeResponse.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to finalize upload.");
      }

      const updated = (await completeResponse.json()) as { avatar_url: string | null };
      setAvatarUrl(updated.avatar_url ?? null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleUpload(file);
    event.target.value = "";
  };

  return (
    <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Profile avatar</CardTitle>
        <CardDescription>
          Upload a square image so your memories feel more human.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.35),transparent_70%)] opacity-70" />
            <Avatar className="relative size-20 border border-white/10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-[color:var(--panel-2)] text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--lagoon)]">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground">{displayName}</p>
            <p>PNG or JPG. Keep it under {MAX_AVATAR_SIZE_MB}MB.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild disabled={loading}>
            <Label htmlFor={inputId} className="cursor-pointer">
              <span className="flex items-center gap-2">
                <UploadCloud className="size-4" />
                {loading ? "Uploading..." : "Upload avatar"}
              </span>
            </Label>
          </Button>
          <Input
            id={inputId}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileHighlight({ profile }: { profile: Profile | null }) {
  const displayName = toDisplayName(profile);
  const initials = toInitials(displayName);
  const hasBio = Boolean(profile?.bio);

  return (
    <Card className="border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Profile vibe</CardTitle>
        <CardDescription>
          This is how your profile reads to guests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-3)]/80 px-3 py-3">
          <Avatar className="size-12 border border-white/10">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-[color:var(--panel)] text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--lagoon)]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {hasBio ? profile?.bio : "Add a bio to personalize your share link."}
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-[color:var(--panel-3)]/70 px-4 py-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <span>Profile readiness</span>
            <span className="text-[color:var(--lagoon)]">Active</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[85%] rounded-full bg-[linear-gradient(90deg,#3bd3c7,#f3a15f)]" />
          </div>
          <p className="text-xs text-muted-foreground">
            Complete profiles get 2x more engagement on shared links.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsTabs({ profile, profileLinks }: SettingsTabsProps) {
  const displayName = toDisplayName(profile);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--panel-2)]/80 px-6 py-6 shadow-xl backdrop-blur md:px-10 md:py-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-8 size-56 rounded-full bg-[radial-gradient(circle,rgba(59,211,199,0.35),transparent_70%)]" />
          <div className="absolute -bottom-32 left-0 size-64 rounded-full bg-[radial-gradient(circle,rgba(243,161,95,0.35),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,15,20,0.1),rgba(11,15,20,0.6))]" />
        </div>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Profile
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Shape your traveler identity
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Keep your profile polished and choose exactly what guests see
                when they open a shared link.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-muted-foreground shadow-[0_0_40px_rgba(59,211,199,0.2)]">
            <Sparkles className="size-4 text-[color:var(--lagoon)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Current profile
              </p>
              <p className="text-sm text-foreground">{displayName}</p>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-[color:var(--panel-3)]/80 p-1 text-sm">
          <TabsTrigger value="profile" className="rounded-xl">
            Profile
          </TabsTrigger>
          <TabsTrigger value="sharing" className="rounded-xl">
            Share links
          </TabsTrigger>
        </TabsList>
        <TabsContents className="space-y-6">
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <ProfileDetailsForm profile={profile} />
              <div className="space-y-6">
                <AvatarPanel profile={profile} />
                <ProfileHighlight profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Profile sharing</CardTitle>
                <CardDescription>
                  Control who can see your profile and manage active share links.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShareLinksPanel scope="profile" links={profileLinks} />
              </CardContent>
            </Card>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}

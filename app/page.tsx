import Link from "next/link"
import {
  ArrowRight,
  Compass,
  CreditCard,
  Image,
  LayoutDashboard,
  MapPinned,
  Share2,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const primaryFeatures = [
  {
    title: "Dashboard overview",
    description: "See your memory globe, key stats, and latest highlights.",
    href: "/dashboard",
    badge: "Core",
    icon: LayoutDashboard,
    ctaLabel: "Open dashboard",
  },
  {
    title: "Trips & moments",
    description: "Create journeys, add diary moments, and attach media.",
    href: "/trips",
    badge: "Core",
    icon: MapPinned,
    ctaLabel: "Open trips",
  },
  {
    title: "Share links",
    description: "Generate secure, redacted links for trips or profiles.",
    href: "/profile",
    badge: "Share",
    icon: Share2,
    ctaLabel: "Open profile sharing",
  },
  {
    title: "Guest viewing",
    description: "Open shared links with safe, redacted guest pages.",
    href: "/s/trip/:token",
    badge: "Public",
    icon: Image,
    ctaLabel: "Create a share link",
    ctaHref: "/profile",
  },
  {
    title: "Billing control",
    description: "Upgrade, manage plan, and view entitlements.",
    href: "/billing",
    badge: "Plan",
    icon: CreditCard,
    ctaLabel: "Open billing",
  },
]

const steps = [
  {
    title: "Capture the trip",
    description: "Create a trip, add moments, and upload photos.",
  },
  {
    title: "Curate the story",
    description: "Highlight key moments and polish the gallery.",
  },
  {
    title: "Share with a link",
    description: "Generate secure links that respect your privacy defaults.",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[color:var(--sand)] text-[color:var(--ink)]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-25%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_var(--lagoon)_0%,_transparent_70%)] opacity-50" />
          <div className="absolute right-[-10%] top-[20%] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_center,_var(--sunrise)_0%,_transparent_70%)] opacity-35" />
          <div className="absolute left-[-5%] top-[60%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_var(--ember)_0%,_transparent_70%)] opacity-25" />
          <div className="absolute inset-0 opacity-[0.12] mix-blend-screen [background-image:radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.08)_1px,_transparent_0)] [background-size:18px_18px]" />
        </div>

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[color:var(--panel)] text-[color:var(--lagoon)] shadow-lg shadow-black/40 ring-1 ring-white/10">
              <Compass className="size-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Trippy
              </p>
              <p className="text-lg font-semibold">Memory Album</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-[color:var(--lagoon)] text-black hover:bg-[color:var(--lagoon)]/90"
            >
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </header>

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-8 md:pb-24 md:pt-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border border-white/10 bg-white/10 text-white hover:bg-white/15">
                  Private by default
                </Badge>
                <Badge className="border border-white/10 bg-white/10 text-white hover:bg-white/15">
                  Share via link
                </Badge>
                <Badge className="border border-white/10 bg-white/10 text-white hover:bg-white/15">
                  Supabase + Stripe ready
                </Badge>
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                A travel memory album that feels like a personal dossier,
                not a feed.
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                Capture past trips with intentional moments, curate share links
                that respect privacy, and invite guests through secure links.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-[color:var(--lagoon)] px-6 text-base text-black shadow-[0_22px_50px_rgba(0,0,0,0.4)] ring-1 ring-white/10 hover:bg-[color:var(--lagoon)]/90"
                >
                  <Link href="/sign-up">
                    Start your first trip <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/20 text-white/80 hover:text-white"
                >
                  <Link href="/sign-in?redirectedFrom=/dashboard">
                    Sign in to preview
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Card className="border border-white/10 bg-[color:var(--panel)]/90 shadow-xl backdrop-blur">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-lg">Archive preview</CardTitle>
                  <CardDescription className="text-sm text-white/60">
                    A glimpse at your globe, highlights, and share links in one
                    view.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)] p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Trips
                      </p>
                      <p className="mt-2 text-2xl font-semibold">12</p>
                      <p className="text-xs text-white/60">Across 7 countries</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)] p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Moments
                      </p>
                      <p className="mt-2 text-2xl font-semibold">38</p>
                      <p className="text-xs text-white/60">Highlighted stories</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-3)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Share links</p>
                      <Badge className="border border-white/10 bg-white/10 text-white">
                        Private
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/60">
                      {["Trip links", "Profile links", "Revocable"].map(
                        (label) => (
                          <div
                            key={label}
                            className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/20 bg-[color:var(--panel-2)]/70 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
                          >
                            {label}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 90 + 120}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-base uppercase tracking-[0.2em] text-white/50">
                    Step {index + 1}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-white">
                    {step.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[color:var(--panel)]/90 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Explore what’s live now</h2>
              <p className="text-sm text-white/60">
                Every module below is already implemented and ready to use.
              </p>
            </div>
            <Button variant="outline" asChild className="border-white/20 text-white/80 hover:text-white">
              <Link href="/sign-in">Sign in to your workspace</Link>
            </Button>
          </div>
          <Separator className="bg-white/10" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {primaryFeatures.map((feature) => {
              const Icon = feature.icon
              const isTokenRoute = feature.href.includes(":token")
              const linkHref = feature.ctaHref ?? feature.href
              const linkLabel = feature.ctaLabel ?? "Open"

              return (
                <Card
                  key={feature.title}
                  className="group border border-white/10 bg-[color:var(--panel-2)]/85 shadow-sm transition hover:shadow-lg"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--panel-3)] text-[color:var(--lagoon)] ring-1 ring-white/10">
                        <Icon className="size-5" />
                      </div>
                      <Badge className="border border-white/10 bg-white/10 text-white hover:bg-white/15">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm text-white/60">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isTokenRoute ? (
                      <div className="space-y-2">
                        <p className="text-xs text-white/60">
                          Create a share link in Settings, then open your guest
                          URL.
                        </p>
                        <Link
                          href={linkHref}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--lagoon)] transition group-hover:text-white"
                        >
                          {linkLabel} <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={linkHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--lagoon)] transition group-hover:text-white"
                      >
                        {linkLabel} <ArrowRight className="size-4" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Privacy-first by design</CardTitle>
              <CardDescription className="text-sm text-white/60">
                Redaction defaults, token hashing, and Supabase RLS keep your
                memories yours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 text-[color:var(--lagoon)]" />
                <p>Share links can rotate or revoke instantly.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 text-[color:var(--lagoon)]" />
                <p>Guest views only expose allowed fields.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 text-[color:var(--lagoon)]" />
                <p>Audit logs track share link activity.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Ready for upgrades</CardTitle>
              <CardDescription className="text-sm text-white/60">
                Stripe-powered billing and entitlements are already wired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>
                Premium members unlock expanded AI assistance and upcoming
                creator tools as they ship.
              </p>
              <Button
                variant="outline"
                asChild
                className="border-white/20 text-white/80 hover:text-white"
              >
                <Link href="/billing">Manage billing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[color:var(--panel-3)]/85">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>Trippy Memory Album · Built for stories that deserve texture.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href="/sign-up">Create account</Link>
            </Button>
            <Link href="/sign-in" className="hover:text-white">
              Sign in
            </Link>
            <Link href="/profile" className="hover:text-white">
              Share settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

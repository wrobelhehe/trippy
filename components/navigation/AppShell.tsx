"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sparkles } from "@/components/animate-ui/icons/sparkles"
import { AppBackdrop } from "@/components/layout/AppBackdrop"
import { AppSidebar } from "@/components/navigation/AppSidebar"
import { ProfileMenu } from "@/components/navigation/ProfileMenu"
import { RealtimeRefresh } from "@/components/realtime/RealtimeRefresh"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppShell({
  children,
  userEmail,
  userId,
  userName,
  userAvatarUrl,
  signOutAction,
}: {
  children: React.ReactNode
  userEmail: string
  userId?: string | null
  userName?: string
  userAvatarUrl?: string | null
  signOutAction: (formData: FormData) => void | Promise<void>
}) {
  const pathname = usePathname()
  const headerConfig = [
    {
      prefix: "/dashboard",
      kicker: "Your Archive",
      title: "Welcome back",
      label: "Dashboard",
    },
    {
      prefix: "/globe",
      kicker: "Atlas",
      title: "Memory globe",
      label: "Globe",
    },
    {
      prefix: "/trips",
      kicker: "Trips",
      title: "Your journeys",
      label: "Trips",
    },
    {
      prefix: "/profile",
      kicker: "Profile",
      title: "Profile & sharing",
      label: "Profile",
    },
    {
      prefix: "/billing",
      kicker: "Billing",
      title: "Plan and invoices",
      label: "Billing",
    },
  ]
  const header = headerConfig.find((item) => pathname?.startsWith(item.prefix))

  return (
    <SidebarProvider
      defaultOpen
      className="bg-[color:var(--sand)] text-[color:var(--ink)]"
    >
      <RealtimeRefresh userId={userId} />
      <AppSidebar
        userEmail={userEmail}
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        signOutAction={signOutAction}
      />
      <SidebarInset className="relative bg-[color:var(--sand)]">
        <AppBackdrop />
        <header className="relative flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-[color:var(--panel-3)]/80 px-4 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur md:px-8">
          <div className="flex flex-1 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="hidden md:block data-[orientation=vertical]:h-4"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <Sparkles
                    size={12}
                    className="text-[color:var(--lagoon)]"
                    animateOnHover
                  />
                  <span>{header?.kicker ?? "Trippy"}</span>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                  <p className="text-lg font-semibold leading-none">
                    {header?.title ?? "Memory Album"}
                  </p>
                  <Breadcrumb className="hidden md:block">
                    <BreadcrumbList className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/70">
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/dashboard">Trippy</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {header?.label ?? "Dashboard"}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
            </div>
            <ProfileMenu
              userEmail={userEmail}
              userName={userName}
              userAvatarUrl={userAvatarUrl}
            />
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import { MapPin } from "@/components/animate-ui/icons/map-pin"
import { Sparkles } from "@/components/animate-ui/icons/sparkles"
import { Star } from "@/components/animate-ui/icons/star"
import { ProfileMenu } from "@/components/navigation/ProfileMenu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Star },
  { href: "/globe", label: "Globe", icon: Sparkles },
  { href: "/trips", label: "Trips", icon: MapPin },
]

export function AppSidebar({
  userEmail,
  userName,
  userAvatarUrl,
  signOutAction,
}: {
  userEmail: string
  userName?: string
  userAvatarUrl?: string | null
  signOutAction: (formData: FormData) => void | Promise<void>
}) {
  const pathname = usePathname()
  const displayName = userName || userEmail || "Unknown"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "ME"

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[linear-gradient(180deg,#0b0f14,#10151d)]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="gap-3 group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--lagoon)]/20 text-[color:var(--lagoon)] group-data-[collapsible=icon]:size-8">
                  <Sparkles size={16} animateOnHover />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Trippy
                  </p>
                  <p className="truncate text-sm font-semibold">Memory Album</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 group-data-[collapsible=icon]:hidden">
          <Badge className="border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.24em] text-white/80">
            Free plan
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon size={16} animateOnHover />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="group-data-[collapsible=icon]:hidden">
          <ProfileMenu
            userEmail={userEmail}
            userName={userName}
            userAvatarUrl={userAvatarUrl}
            trigger={
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-[color:var(--panel-3)]/70 px-3 py-2 text-left text-xs text-muted-foreground transition hover:border-white/20 hover:bg-[color:var(--panel-3)]"
                aria-label="Open profile menu"
              >
                <Avatar className="size-8 border border-white/10">
                  {userAvatarUrl ? (
                    <AvatarImage src={userAvatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-transparent text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="truncate text-sm text-foreground">
                    {displayName}
                  </p>
                </div>
              </button>
            }
          />
        </div>
        <form action={signOutAction} className="group-data-[collapsible=icon]:hidden">
          <Button variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
        <form action={signOutAction} className="hidden group-data-[collapsible=icon]:block">
          <SidebarMenuButton type="submit" tooltip="Sign out">
            <LogOut />
            <span>Sign out</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

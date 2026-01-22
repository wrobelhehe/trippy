"use client"

import { useRouter } from "next/navigation"

import { ShareLinkForm } from "@/components/share/ShareLinkForm"
import { ShareLinkList, type ShareLinkItem } from "@/components/share/ShareLinkList"

export function ShareLinksPanel({
  scope,
  tripId,
  links,
}: {
  scope: "trip" | "profile"
  tripId?: string
  links: ShareLinkItem[]
}) {
  const router = useRouter()

  const refresh = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <ShareLinkForm scope={scope} tripId={tripId} onCreated={refresh} />
      <ShareLinkList links={links} onChange={refresh} />
    </div>
  )
}

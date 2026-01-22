import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  actionHref?: string
  action?: ReactNode
  size?: "sm" | "md"
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  action,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-white/10 bg-[color:var(--panel-3)]/80 text-sm text-muted-foreground",
        size === "sm" ? "p-4" : "p-6",
        className
      )}
    >
      <div className="flex flex-col items-start gap-3">
        {Icon ? (
          <div className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70">
            <Icon className="size-4" />
          </div>
        ) : null}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action ? (
          action
        ) : actionLabel && actionHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

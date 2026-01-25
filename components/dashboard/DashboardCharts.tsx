"use client"

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"

import { Shine } from "@/components/animate-ui/primitives/effects/shine"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const tripsChartConfig = {
  trips: {
    label: "Trips",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const storyChartConfig = {
  stories: {
    label: "Stories",
    color: "var(--chart-2)",
  },
  media: {
    label: "Media",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

type TripsByMonth = { month: string; trips: number }

type StoryChartDatum = {
  mode: "stories" | "media"
  value: number
  fill: string
}

export function DashboardCharts({
  tripsByMonth,
  storyChartData,
  hasTrips,
  className,
  tripCardClassName,
  storyCardClassName,
}: {
  tripsByMonth: TripsByMonth[]
  storyChartData: StoryChartDatum[]
  hasTrips: boolean
  className?: string
  tripCardClassName?: string
  storyCardClassName?: string
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <Shine asChild color="rgba(59,211,199,0.35)" enableOnHover opacity={0.22}>
        <Card
          className={cn(
            "flex h-full flex-col border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur",
            tripCardClassName
          )}
        >
          <CardHeader>
            <CardTitle className="text-lg">Trip cadence</CardTitle>
            <CardDescription>Last six months of entries added.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-1 items-center py-3">
          {hasTrips ? (
            <ChartContainer
              config={tripsChartConfig}
              className="h-full min-h-[180px] w-full"
            >
                <BarChart accessibilityLayer data={tripsByMonth}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="trips" fill="var(--color-trips)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Add your first trip to see trends.
              </div>
            )}
          </CardContent>
        </Card>
      </Shine>

      <Shine asChild color="rgba(243,161,95,0.3)" enableOnHover opacity={0.2}>
        <Card
          className={cn(
            "flex h-full flex-col border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur",
            storyCardClassName
          )}
        >
          <CardHeader>
            <CardTitle className="text-lg">Story mix</CardTitle>
            <CardDescription>Balance between stories and media.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-1 items-center py-3">
          {hasTrips ? (
            <ChartContainer
              config={storyChartConfig}
              className="h-full min-h-[180px] w-full"
            >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="mode" hideLabel />}
                  />
                  <Pie data={storyChartData} dataKey="value" nameKey="mode" />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="mode" />}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Story mix appears once trips exist.
              </div>
            )}
          </CardContent>
        </Card>
      </Shine>
    </div>
  )
}

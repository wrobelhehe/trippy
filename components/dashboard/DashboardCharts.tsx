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

const privacyChartConfig = {
  private: {
    label: "Private",
    color: "var(--chart-2)",
  },
  link: {
    label: "Link",
    color: "var(--chart-4)",
  },
  public: {
    label: "Public",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

type TripsByMonth = { month: string; trips: number }

type PrivacyChartDatum = {
  mode: "private" | "link" | "public"
  value: number
  fill: string
}

export function TripCadenceCard({
  tripsByMonth,
  hasTrips,
  className,
}: {
  tripsByMonth: TripsByMonth[]
  hasTrips: boolean
  className?: string
}) {
  return (
    <Shine asChild color="rgba(59,211,199,0.35)" enableOnHover opacity={0.22}>
      <Card
        className={cn(
          "flex h-full flex-col border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur",
          className
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
  )
}

export function PrivacyMixCard({
  privacyChartData,
  hasTrips,
  className,
}: {
  privacyChartData: PrivacyChartDatum[]
  hasTrips: boolean
  className?: string
}) {
  return (
    <Shine asChild color="rgba(243,161,95,0.3)" enableOnHover opacity={0.2}>
      <Card
        className={cn(
          "flex h-full flex-col border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur",
          className
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg">Privacy mix</CardTitle>
          <CardDescription>How your trips are currently shared.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center py-3">
          {hasTrips ? (
            <ChartContainer
              config={privacyChartConfig}
              className="h-full min-h-[180px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="mode" hideLabel />}
                />
                <Pie data={privacyChartData} dataKey="value" nameKey="mode" />
                <ChartLegend content={<ChartLegendContent nameKey="mode" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Privacy breakdown will appear once trips exist.
            </div>
          )}
        </CardContent>
      </Card>
    </Shine>
  )
}

export function DashboardCharts({
  tripsByMonth,
  privacyChartData,
  hasTrips,
  className,
  tripCardClassName,
  privacyCardClassName,
}: {
  tripsByMonth: TripsByMonth[]
  privacyChartData: PrivacyChartDatum[]
  hasTrips: boolean
  className?: string
  tripCardClassName?: string
  privacyCardClassName?: string
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <TripCadenceCard
        tripsByMonth={tripsByMonth}
        hasTrips={hasTrips}
        className={tripCardClassName}
      />
      <PrivacyMixCard
        privacyChartData={privacyChartData}
        hasTrips={hasTrips}
        className={privacyCardClassName}
      />
    </div>
  )
}

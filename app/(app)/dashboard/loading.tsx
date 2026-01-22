import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={`stat-${index}`}
            className="border border-white/10 bg-[color:var(--panel)]/85 shadow-md backdrop-blur"
          >
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border border-white/10 bg-[color:var(--panel)]/90 shadow-lg backdrop-blur">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <Card className="border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg backdrop-blur">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-[color:var(--panel-2)]/85 shadow-lg backdrop-blur">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={`chart-${index}`}
            className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur"
          >
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-52 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

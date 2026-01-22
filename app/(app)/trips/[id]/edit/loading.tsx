import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripDetailEditLoading() {
  return (
    <div className="space-y-6">
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full rounded-3xl" />
        </CardContent>
      </Card>

      <div className="rounded-[32px] border border-white/10 bg-[color:var(--panel)]/85 p-6 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`tag-${index}`} className="h-6 w-20" />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={`info-${index}`} className="h-16 w-full" />
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`stat-${index}`}
              className="border border-white/10 bg-[color:var(--panel-2)]/80"
            >
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={`panel-${index}`}
            className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur"
          >
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

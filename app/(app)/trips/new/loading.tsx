import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewTripLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-[color:var(--panel-2)]/80 shadow-lg backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`recent-${index}`} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

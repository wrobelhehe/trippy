import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobeLoading() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:items-stretch">
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 py-0 shadow-lg backdrop-blur">
        <CardContent className="h-full px-0 py-0">
          <Skeleton className="h-[60vh] min-h-[420px] w-full rounded-3xl lg:h-full" />
        </CardContent>
      </Card>
      <Card className="border border-white/10 bg-[color:var(--panel)]/85 shadow-lg backdrop-blur lg:h-full">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-9 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`globe-trip-${index}`} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

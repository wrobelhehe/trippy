export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            T
          </div>
          <span>Trippy Memory Album</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-[color:var(--panel-3)] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,211,199,0.16),_transparent_55%),radial-gradient(circle_at_30%_85%,_rgba(243,161,95,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),transparent_40%,rgba(0,0,0,0.2))]" />
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f3ef] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,230,0.9),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(190,219,255,0.55),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-28 right-10 h-72 w-72 rounded-full bg-[#ffd7b1]/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] left-[-120px] h-80 w-80 rounded-full bg-[#b7d0ff]/50 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-6 text-sm">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-white/60 bg-white/70 text-lg font-semibold shadow-sm">
              T
            </span>
            <div className="leading-tight">
              <p className="text-base font-semibold">Trippy</p>
              <p className="text-xs text-muted-foreground">Memories, not plans.</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs text-muted-foreground md:flex">
            <span>Privacy-first albums</span>
            <span>Share with intention</span>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
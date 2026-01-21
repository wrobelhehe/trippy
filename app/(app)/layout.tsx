import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trips", label: "Trips" },
  { href: "/share-studio", label: "Share Studio" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="hidden w-64 flex-col gap-6 border-r border-black/5 bg-white/70 px-6 py-8 backdrop-blur md:flex">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Trippy
            </p>
            <p className="text-lg font-semibold">Memory Album</p>
          </div>
          <nav className="flex flex-1 flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 transition hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator />
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>Signed in as</p>
            <p className="truncate text-sm text-foreground">
              {data.user?.email ?? "Unknown"}
            </p>
          </div>
          <form action={signOut}>
            <Button variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-black/5 bg-white/70 px-6 py-4 backdrop-blur md:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Your Archive
              </p>
              <p className="text-lg font-semibold">Welcome back</p>
            </div>
            <form action={signOut} className="md:hidden">
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </header>
          <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
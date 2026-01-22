import {
  createServerClient,
  type CookieMethodsServer,
  type SetAllCookies,
} from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const cookieStore = await cookies();

  type CookiesToSet = Parameters<SetAllCookies>[0];
  const cookieMethods = {
    getAll() {
      return cookieStore.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      }));
    },
    setAll(cookiesToSet: CookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Ignored: set may be called from Server Components.
        }
      });
    },
  } satisfies CookieMethodsServer;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration.");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

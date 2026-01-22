import {
  createServerClient,
  type CookieMethodsServer,
  type SetAllCookies,
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function updateSession(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  type CookiesToSet = Parameters<SetAllCookies>[0];
  const cookieMethods = {
    getAll() {
      return request.cookies.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      }));
    },
    setAll(cookiesToSet: CookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set({ name, value, ...options });
      });
    },
  } satisfies CookieMethodsServer;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
  });

  const { data } = await supabase.auth.getUser();
  if (process.env.AUTH_DEBUG === "1") {
    const rawCookieHeader = request.headers.get("cookie") ?? "";
    const rawCookieNames = rawCookieHeader
      .split(";")
      .map((part) => part.split("=")[0]?.trim())
      .filter(Boolean);

    console.info("[auth-middleware] session check", {
      path: request.nextUrl.pathname,
      hasUser: Boolean(data.user),
      cookieNames: request.cookies.getAll().map((cookie) => cookie.name),
      rawCookieNames,
    });
  }

  return { response, user: data.user };
}

import {
  createServerClient,
  type CookieMethodsServer,
  type SetAllCookies,
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const authDebug = process.env.AUTH_DEBUG === "1";

function logAuthDebug(message: string, data?: Record<string, unknown>) {
  if (!authDebug) return;
  if (data) {
    console.info(`[auth-callback] ${message}`, data);
    return;
  }
  console.info(`[auth-callback] ${message}`);
}

export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/sign-in?error=missing-auth-config", request.url));
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  logAuthDebug("Callback received", {
    hasCode: Boolean(code),
    next,
    path: requestUrl.pathname,
  });

  if (!code) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  type CookiesToSet = Parameters<SetAllCookies>[0];
  const cookieMethods = {
    getAll() {
      return request.cookies.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      }));
    },
    setAll(cookiesToSet: CookiesToSet) {
      if (authDebug) {
        logAuthDebug("Setting auth cookies", {
          names: cookiesToSet.map((cookie) => cookie.name),
        });
      }
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set({ name, value, ...options });
      });
    },
  } satisfies CookieMethodsServer;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieMethods,
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    logAuthDebug("exchangeCodeForSession error", { message: error.message });
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  logAuthDebug("Session exchange succeeded");
  return response;
}

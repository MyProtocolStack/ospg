import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const url = request.nextUrl.pathname;

  // If Supabase isn't configured (preview before env vars set), let everything through.
  // Marketing pages still work, auth-required pages will fail at the page level
  // instead of crashing the entire site at the middleware layer.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return response;
  }

  const isProtected =
    url.startsWith("/dashboard") ||
    url.startsWith("/onboarding") ||
    url.startsWith("/admin");

  // Build a Supabase client that mutates the response cookies for session refresh.
  let mutableResponse = response;
  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          mutableResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            mutableResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtected && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (e) {
    // Don't crash the site if Supabase is unreachable.
    // Protected routes will fall through to their own error handling.
    console.error("middleware supabase error:", e);
  }

  return mutableResponse;
}

export const config = {
  matcher: ["/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)"],
};

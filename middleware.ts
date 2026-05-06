import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Skip auth check on public routes
  const url = request.nextUrl.pathname;
  const isPublic =
    url === "/" ||
    url.startsWith("/_next") ||
    url.startsWith("/api/public") ||
    url === "/login" ||
    url === "/signup" ||
    url === "/auth" ||
    url.startsWith("/auth/") ||
    url.startsWith("/services") ||
    url.startsWith("/courses") ||
    url.startsWith("/pricing") ||
    url.startsWith("/about") ||
    url.startsWith("/founders") ||
    url.startsWith("/contact") ||
    url.startsWith("/legal") ||
    url.startsWith("/blog") ||
    url.startsWith("/walkthrough");

  // Refresh session for ALL routes (so cookies stay current)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate /dashboard, /shield-ai, /pilot, /courses (paid), /admin
  const isProtected =
    url.startsWith("/dashboard") ||
    url.startsWith("/shield-ai") ||
    url.startsWith("/pilot") ||
    url.startsWith("/admin");

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)"],
};

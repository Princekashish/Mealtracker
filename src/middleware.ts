// middleware.ts (auth-aware redirects)
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") || "";

  // Detect if user has an auth cookie
  const hasAuthCookie =
    cookieHeader.includes("my_auth_cookie=") ||
    /(?:next-auth\.session-token|next-auth.session-token|token|session|auth)=/.test(
      cookieHeader
    );

  // 1️⃣ PROTECT DASHBOARD SUBPATHS — if no auth, redirect to /login
  if (pathname.startsWith("/dashboard/")) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const publicPages = ["/", "/login"];
  if (publicPages.includes(pathname) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Default: allow access
  return NextResponse.next();
}

// Apply middleware to dashboard and root/public routes
export const config = {
  matcher: ["/", "/login", "/sign-in", "/dashboard/:path*"],
};

// middleware.ts (Edge-safe, cookie-only)
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";

  // If no cookies at all -> not logged in
  if (!cookieHeader) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Replace 'my_auth_cookie' with the exact cookie your auth sets if you know it.
  // For NextAuth use: "next-auth.session-token" (or "next-auth.callback-url" depending on config).
  const hasAuthCookie =
    cookieHeader.includes("my_auth_cookie=") ||
    /(?:next-auth\.session-token|next-auth.session-token|token|session|auth)=/.test(cookieHeader);

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // best-effort allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path+"],
};

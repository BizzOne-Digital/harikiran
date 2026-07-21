import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicAdminPaths = ["/admin/login"];

function nextWithAdminFlag(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-route", "1");
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * Edge-safe cookie presence check only.
 * Full session validation happens in admin layouts via requireSession() (Node).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isPublic = publicAdminPaths.some((p) => pathname.startsWith(p));

  if (isPublic) {
    if (sessionCookie && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return nextWithAdminFlag(request);
  }

  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return nextWithAdminFlag(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};

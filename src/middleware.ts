import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/auth";

const publicAdminPaths = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (publicAdminPaths.some((p) => pathname.startsWith(p))) {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (session?.user && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const session = await getAuth().api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

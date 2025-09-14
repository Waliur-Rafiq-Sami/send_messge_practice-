import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl.clone();

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");

  const isDashboardPage = url.pathname.startsWith("/dashboard");

  // If logged in and trying to access auth pages -> redirect to /dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in and trying to access dashboard -> redirect to /sign-in
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in/:path*", "/sign-up/:path*", "/verify/:path*", "/dashboard/:path*"],
};

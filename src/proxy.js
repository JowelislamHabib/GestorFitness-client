import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    if (session) {
      const role = session.user?.role || "user";
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    return;
  }

  const publicRoutes = ["/classes", "/forums"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = session?.user?.role || "user";

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/dashboard/trainer") && role !== "trainer" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/dashboard/user") && role !== "user" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/classes/:path*",
    "/forum/:path*",
    "/login",
    "/register",
  ],
};
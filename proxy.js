import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  //  PUBLIC ROUTES (NO LOGIN REQUIRED)
  const publicRoutes = ['/classes', '/forum', '/login', '/register'];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // LOGIN / REGISTER GUARD (LOGGED IN USER BLOCK)
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(
      new URL(`/dashboard/${session.user.role}`, request.url),
    );
  }

  // NOT LOGGED IN → ONLY PUBLIC ROUTES ALLOWED
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = session?.user?.role;

  // ROLE PROTECTION
  if (pathname.startsWith('/dashboard/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (pathname.startsWith('/dashboard/trainer')) {
    if (role !== 'trainer' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (pathname.startsWith('/dashboard/user')) {
    if (role !== 'user' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/classes/:path*',
    '/forum/:path*',
    '/login',
    '/register',
  ],
};
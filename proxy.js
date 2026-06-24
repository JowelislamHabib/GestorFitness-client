import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/classes', '/forums', '/login', '/register'];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(
      new URL(`/dashboard/${session.user.role}`, request.url),
    );
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = session?.user?.role;

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

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
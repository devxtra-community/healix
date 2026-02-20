import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/admin/login'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');

  const accessToken = req.cookies.get(
    isAdminRoute ? 'adminAccessToken' : 'accessToken',
  )?.value;

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(isAdminRoute ? '/admin/login' : '/login', req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/addresses/:path*',
  ],
};

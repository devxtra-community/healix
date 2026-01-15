import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/admin/login'];

// Helper
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');

  // USE ACCESS TOKEN
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
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*'],
};

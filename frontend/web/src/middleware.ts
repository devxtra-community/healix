import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/register', '/admin/login'];

// Helper to check if a path is public
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');

  // Get the correct cookie based on the route type
  const accessToken = req.cookies.get(
    isAdminRoute ? 'adminAccessToken' : 'accessToken',
  )?.value;

  // If not authenticated, redirect to appropriate login
  if (!accessToken) {
    return NextResponse.redirect(
      new URL(isAdminRoute ? '/admin/login' : '/login', req.url),
    );
  }

  // Optional: prevent logged-in users from visiting the other section
  if (isAdminRoute && req.cookies.get('accessToken')) {
    // Regular user trying to access admin page
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isAdminRoute && req.cookies.get('adminAccessToken')) {
    // Admin trying to access user pages
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
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

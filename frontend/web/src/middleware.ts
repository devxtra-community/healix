import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const isAdmin = pathname.startsWith('/admin');

  const refreshToken = req.cookies.get(
    isAdmin ? 'adminRefreshToken' : '`refreshToken`',
  )?.value;

  if (!refreshToken) {
    return NextResponse.redirect(
      new URL(isAdmin ? '/admin/login' : '/login', req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images).*)'],
};

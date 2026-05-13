import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['superadmin', 'admin', 'cs', 'editor', 'marketing'];

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdmin     = pathname.startsWith('/admin');
  const isDashboard = pathname.startsWith('/dashboard');

  if (!isAdmin && !isDashboard) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete('token');
    return res;
  }

  const exp = payload.exp as number | undefined;
  const now = Date.now() / 1000;

  if (exp && now > exp) {
    // Admin: redirect immediately — admin layout will handle refresh on next load
    // Dashboard: let client-side JS handle refresh (tryRefreshToken in layout)
    if (isAdmin) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('token');
      return res;
    }
    // For dashboard, pass through — the layout's checkAndRefresh will handle it
  }

  // Admin-only: enforce role
  if (isAdmin) {
    const role = (payload.role as string) ?? '';
    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};

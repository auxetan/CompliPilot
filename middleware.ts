import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

/** Routes that do not require authentication. */
const PUBLIC_ROUTES = ['/', '/pricing', '/about', '/blog', '/auth/callback'];

/** Prefixes for public route groups. */
const PUBLIC_PREFIXES = ['/(marketing)', '/blog/'];

/** Auth routes — redirect to /dashboard if already logged in. */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email'];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Next.js middleware — handles session refresh and route protection.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const { response, user } = await createMiddlewareClient(request);

  // Public routes — allow through
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Auth routes — redirect to dashboard if already logged in
  if (isAuthRoute(pathname)) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Protected routes — redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Check if user has an organization — if not, redirect to onboarding
  const orgId = user.app_metadata?.org_id as string | undefined;
  if (!orgId && pathname !== '/onboarding') {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/|fonts/).*)',
  ],
};

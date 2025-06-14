import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  // Add other public paths as needed
  '/images',
  '/favicon.ico',
];

// Check if the path matches any public path
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => {
    if (publicPath === '/') {
      return path === '/';
    }
    return path.startsWith(publicPath);
  });
};

// For development purposes - always bypass auth checks
export async function middleware(request: NextRequest) {
  // Simply allow all requests to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that don't require auth (handled inside the API routes)
     * 2. Static files (/_next/, /images/, etc.)
     * 3. favicon.ico, manifest.json
     */
    '/((?!_next/|images/|favicon.ico|manifest.json|api/auth/login|api/auth/register|api/auth/logout).*)',
  ],
};

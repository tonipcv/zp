// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Check if user has active trial
async function hasAccess(token: any) {
  console.log('hasAccess - Checking access for token:', JSON.stringify(token || 'No token'));
  
  // Special case for unlimited user
  if (token?.email === 'xppsalvador@gmail.com') {
    console.log('hasAccess - Special unlimited user detected');
    return true;
  }
  
  // Check if user has active trial based on token data
  if (token?.trialActivated) {
    console.log('hasAccess - User has active trial');
    return true;
  }
  
  console.log('hasAccess - User has no access');
  return false;
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  
  // Normalize pathname to lowercase for consistent matching
  const normalizedPath = pathname.toLowerCase();

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token details:', JSON.stringify({
    exists: !!token,
    id: token?.id || null,
    trialActivated: token?.trialActivated || false,
    trialStartDate: token?.trialStartDate || null,
    trialEndDate: token?.trialEndDate || null,
    credits: token?.credits || 0,
    maxCredits: token?.maxCredits || 0
  }));

  // API routes for creating instances or agents - block for free users
  if (normalizedPath.startsWith('/api/whatsapp/instance/create') || 
      normalizedPath.startsWith('/api/ai-agent/create')) {
    const hasAccessRights = await hasAccess(token);
    if (!hasAccessRights) {
      console.log('Middleware - Free user attempting to create instance/agent');
      return new NextResponse(JSON.stringify({ error: 'Subscription required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(normalizedPath)) {
    // If logged in, redirect to home
    if (token) {
      console.log('Middleware - Logged in user trying to access public route');
      return NextResponse.redirect(new URL('/whatsapp', request.url));
    }
    return NextResponse.next();
  }

  // If not logged in, redirect to login
  if (!token && normalizedPath !== '/login') {
    console.log('Middleware - User not logged in, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Force token refresh for testing
  if (normalizedPath === '/force-refresh' && token?.id) {
    console.log('Middleware - Force refreshing token');
    const userData = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { credits: true, maxCredits: true, trialActivated: true, trialStartDate: true, trialEndDate: true }
    });
    
    console.log('Middleware - Forced user data refresh:', JSON.stringify(userData));
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if user has access (premium or has credits)
  const hasAccessRights = await hasAccess(token);
  
  // If user has access, redirect plans page to WhatsApp
  if (hasAccessRights && (normalizedPath === '/plans' || normalizedPath === '/planos')) {
    console.log('Middleware - User with credits redirected from plans to WhatsApp');
    return NextResponse.redirect(new URL('/whatsapp', request.url));
  }
  
  // Always allow access to plans page for users without access
  if (normalizedPath === '/planos' || normalizedPath === '/plans') {
    return NextResponse.next();
  }
  
  // Redirect root (/) to WhatsApp
  if (normalizedPath === '/') {
    console.log('Middleware - Root path detected, redirecting to WhatsApp');
    // If user has access, redirect to WhatsApp, otherwise to plans
    if (hasAccessRights) {
      console.log('Middleware - User has access, redirecting to WhatsApp');
      return NextResponse.redirect(new URL('/whatsapp', request.url));
    } else {
      console.log('Middleware - User has no access, redirecting to plans');
      return NextResponse.redirect(new URL('/plans', request.url));
    }
  }
  
  // Check access for all other pages except profile
  if (normalizedPath !== '/profile') {
    if (!hasAccessRights) {
      console.log('Middleware - User without credits redirected to plans page');
      return NextResponse.redirect(new URL('/plans', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/planos',
    '/series-restrito/:path*',
    '/ia',
    '/IA',
    '/pedidos',
    '/whatsapp/:path*',
    '/ai-agent/:path*',
    '/profile',
    '/',
    '/api/whatsapp/instance/create',
    '/api/ai-agent/create',
  ],
};

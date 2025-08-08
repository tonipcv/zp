// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Check if user has premium access
async function hasPremiumAccess(token: any) {
  // Special case for unlimited user
  if (token?.email === 'xppsalvador@gmail.com') {
    return true;
  }
  
  // Check if user has premium flag
  return !!token?.isPremium;
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  
  // Normalize pathname to lowercase for consistent matching
  const normalizedPath = pathname.toLowerCase();

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token:', token ? 'Existe' : 'Não existe');

  // API routes for creating instances or agents - block for free users
  if (normalizedPath.startsWith('/api/whatsapp/instance/create') || 
      normalizedPath.startsWith('/api/ai-agent/create')) {
    const isPremium = await hasPremiumAccess(token);
    if (!isPremium) {
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

  // Always allow access to plans page
  if (normalizedPath === '/planos') {
    return NextResponse.next();
  }
  
  // Redirect root (/) to WhatsApp
  if (normalizedPath === '/') {
    return NextResponse.redirect(new URL('/whatsapp', request.url));
  }
  
  // Check premium access for all other pages except profile and plans
  if (normalizedPath !== '/profile' && normalizedPath !== '/planos' && normalizedPath !== '/plans') {
    const isPremium = await hasPremiumAccess(token);
    if (!isPremium) {
      console.log('Middleware - Free user redirected to plans page');
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

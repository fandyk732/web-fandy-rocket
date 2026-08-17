import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil token/session admin dari cookies
  const adminToken = request.cookies.get('admin_session')?.value;

  // 1. Jika mencoba akses halaman admin (selain /admin/login) tapi BELUM login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Jika SUDAH login tapi malah buka halaman /admin/login
  if (pathname === '/admin/login' && adminToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin');

  // 1. Jika mencoba akses /admin tapi belum login -> lempar ke /admin/login
  if (isAdminPath && !isLoginPage && !authCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Jika sudah login tapi akses /admin/login -> lempar ke /admin/create
  if (isLoginPage && authCookie) {
    return NextResponse.redirect(new URL('/admin/create', request.url));
  }

  return NextResponse.next();
}

// 📌 Matcher ini WAJIB diisi biar file CSS, JS, Gambar, dan API tidak ke-block!
export const config = {
  matcher: [
    /*
     * Match semua request di bawah /admin/
     * KECUALI file internal Next.js (_next/static, _next/image, favicon.ico, dll)
     */
    '/admin/:path*',
  ],
};
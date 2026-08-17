import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Catatan: middleware jalan di Edge Runtime, yang nggak selalu punya akses
// penuh ke Node 'crypto' module tergantung platform hosting-nya. Verifikasi
// SIGNATURE token yang sesungguhnya (butuh HMAC) dilakukan di masing-masing
// API route lewat isAdminRequest() dari '@/lib/adminAuth', yang jalan di
// Node runtime penuh. Middleware ini cuma pengecekan cepat "ada token
// berbentuk benar" buat redirect UX halaman — bukan satu-satunya lapisan
// keamanan. Proteksi yang SEBENARNYA ada di level API route.
function looksLikeValidTokenShape(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, signature] = token.split('.');
  if (!expiryStr || !signature) return false;
  const expiry = Number(expiryStr);
  return Number.isFinite(expiry) && Date.now() <= expiry;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get('admin_session')?.value;
  const hasValidShape = looksLikeValidTokenShape(adminToken);

  // 1. Jika mencoba akses halaman admin (selain /admin/login) tapi BELUM login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!hasValidShape) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Jika SUDAH login tapi malah buka halaman /admin/login
  if (pathname === '/admin/login' && hasValidShape) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
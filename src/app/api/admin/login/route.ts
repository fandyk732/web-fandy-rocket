import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    // 🔒 Token yang di-sign (HMAC), bukan string statis 'authenticated'.
    // Nggak bisa dipalsuin cuma dengan nambahin cookie manual lewat DevTools —
    // harus tau ADMIN_PASSWORD buat ngasilin signature yang valid.
    response.cookies.set('admin_session', createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // Berlaku 1 hari
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false, message: 'Password salah!' }, { status: 401 });
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Login Berhasil' });

      response.cookies.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 Hari
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Password salah!' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Format request tidak valid' },
      { status: 400 }
    );
  }
}
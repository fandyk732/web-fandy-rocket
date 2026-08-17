import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    // Set Cookie Session
    response.cookies.set('admin_session', 'authenticated', {
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
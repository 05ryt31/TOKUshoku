// /app/api/auth/store/login/route.ts
/**
 * ◆店舗アカウント用ログインAPI◆
 *
 * [POST] /api/auth/store/login
 * リクエストボディ: { email: string, password: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';



export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    const supabase = createServerSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error('Store login error:', error);
      return NextResponse.json(
        { message: error?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { user } = data;
    const { access_token, token_type, expires_in } = data.session;
    const response = NextResponse.json({
      status: 'success',
      user,
      token_type,
      expires_in,
    });
    response.cookies.set({
      name: 'store_token',
      value: access_token,
      httpOnly: true,
      path: '/',
      secure: false,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Store login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

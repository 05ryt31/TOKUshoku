/**
 * /app/api/auth/login/route.ts
 * 
 * ログインエンドポイント
 * "POST /api/auth/login" で{email, password}を受け取り、
 * Supabse Auth の　signInWithPassword() メソッドを利用してログインを行う
 */


import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";
import { access } from "fs";




export async function POST(request: NextRequest) {
  try {
    // リクエストボディから email と password を取得
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Supabase Auth のsignInWithPassword()メソッドを利用してログイン
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      // 認証失敗時
      return NextResponse.json({ message: error?.message || 'Invalid credentials' }, { status: 401 });
    }

    // supabase認証後のsessionにトークンが入っている
    const {user} = data;
    const { access_token, token_type, expires_in } = data.session;

    //Cookie へせっと
    //cookie.set()が使えるのはNextResponse　なので、一度レスポンスを変数に格納して設定します。
    const response = NextResponse.json({
      status: 'success',
      user,
      access_token,
      token_type,
      expires_in,
    }, { status: 200 });
    //Cookieにトークンを保存（httpOnly推奨）
    // pathや同一オリジンの場合のsecure/sameSite 属性を適宜設定
    response.cookies.set({
      name: 'token',
      value: access_token,
      httpOnly: true,
      path: '/', 
      secure: false, // 本番環境では secure を true に
      sameSite: 'lax', // CSRF対策のため、SameSite属性を設定
    })

    return response;

    
    
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
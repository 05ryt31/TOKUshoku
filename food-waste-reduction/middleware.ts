// /app/middleware/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import supabase from '@/lib/supabase';

// 公開ページ（認証不要）のパス一覧
const PUBLIC_PATHS = [
  '/',
  '/auth/user/login',
  '/auth/user/signup',
  '/auth/store/signup',
  '/auth/user/forgotpassword',      // パスワードリセット用画面
  '/auth/user/forgotpassword/reset', // パスワードリセット用画面
  '/auth/user/logout',
  '/auth/store/login',
  'auth/store/logout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js内部の静的ファイルやAPIルートは対象外
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 公開ページの場合は認証チェックをスキップ
  if (PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Cookieから認証トークンを取得（※サーバーサイドで管理する場合）
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.error('Token not found in cookies');
    // トークンがなければログインページへリダイレクト
    const loginUrl = new URL('/auth/user/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Supabaseでトークンを検証
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    console.error('Invalid token:', error);
    // 無効なトークンの場合はCookieを削除し、ログインページへリダイレクト
    const response = NextResponse.redirect(new URL('/auth/user/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  // 認証済みの場合はそのままリクエストを通す
  return NextResponse.next();
}

// middleware の適用対象パスを定義
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { el } from 'date-fns/locale';

// 公開ページ（認証不要）のパス一覧
const PUBLIC_PATHS = [
  '/',
  '/auth/user/login',
  '/auth/user/signup',
  '/auth/store/signup',
  '/auth/user/forgotpassword',      
  '/auth/user/forgotpassword/reset', 
  '/auth/user/logout',
  '/auth/store/login',
  '/auth/store/logout',
];

// 店舗用パス
const STORE_PATHS = ['/admin', '/admin/store'];
// ユーザー用パス
const USER_PATHS = ['/user'];

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
  if (PUBLIC_PATHS.some(publicPath => pathname.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Cookieから認証トークンを取得
  const isStorePath = STORE_PATHS.some(path => pathname.startsWith(path));
  const isUserPath = USER_PATHS.some(path => pathname.startsWith(path));
  let token;
  if (isStorePath) {
    token = request.cookies.get('store_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/store/login', request.url));
    }
  } else if (isUserPath) {
    token = request.cookies.get('user_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/user/login', request.url));
    }
  }



  

  // Supabaseでトークンを検証
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    console.error('Invalid token:', error);
    
    // 無効なトークンの場合はCookieを削除し、適切なログインページへリダイレクト
    const response = STORE_PATHS.some(path => pathname.startsWith(path))
      ? NextResponse.redirect(new URL('/auth/store/login', request.url))
      : NextResponse.redirect(new URL('/auth/user/login', request.url));
      
    response.cookies.delete(isStorePath ?'store_token' : 'user_token');
    return response;
  }

  // 認証済みの場合はそのままリクエストを通す
  return NextResponse.next();
}

// middleware の適用対象パスを定義
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
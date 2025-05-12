// lib/supabase.ts
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export function createServerSupabase() {
  // 店舗ログイン用トークンを最初に確認
  const storeToken = cookies().get('store_token')?.value;
  // ユーザーログイン用トークン
  const userToken = cookies().get('user_token')?.value;
  // 標準のSupabaseトークン（フォールバック）
  const access = cookies().get('sb-access-token')?.value;
  
  // 優先順位：store_token > user_token > sb-access-token
  const token = storeToken || userToken || access;
  const refresh = cookies().get('sb-refresh-token')?.value;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

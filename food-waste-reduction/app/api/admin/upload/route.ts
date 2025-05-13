// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // 認証チェック
  const cookieStore = cookies();
  const storeToken = cookieStore.get('store_token')?.value;
  
  if (!storeToken) {
    return NextResponse.json({ error: "認証されていません" }, { status: 401 });
  }
  
  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  
  if (authErr || !user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    
    if (!file || !folder) {
      return NextResponse.json({ error: "ファイルまたはフォルダが指定されていません" }, { status: 400 });
    }
    
    // ファイル名をユニークにする
    const filePath = `${folder}/${crypto.randomUUID()}.jpg`;
    
    // ストレージにアップロード
    const { data, error } = await supabase.storage
      .from("store-assets")
      .upload(filePath, file, { upsert: true });
    
    if (error) {
      console.error("アップロードエラー:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 公開URLを取得
    const { data: url } = supabase.storage.from("store-assets").getPublicUrl(data.path);
    return NextResponse.json({ url: url.publicUrl });
  } catch (error: any) {
    console.error("アップロードエラー:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
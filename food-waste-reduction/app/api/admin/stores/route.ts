import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import  { createServerSupabase } from "@/lib/supabase";

/*────────────────────────
   GET  (一覧 = 1行)          
────────────────────────*/
export async function GET() {
  const cookiesStore = cookies();
  const storeToken = cookiesStore.get("store_token")?.value;
  if (!storeToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServerSupabase();
  /* 1) 認証 */
  

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = user.id;
  console.log("store_id", uid);

  /* 2) 既存行を探す */
  const { data: stores, count, error: selErr } = await supabase
    .from("stores")
    .select("*", { count: "exact" }) // ← count を取得
    .eq("store_id", uid);

  console.error("error", selErr); 
  console.log("stores", stores);

  if (selErr) {
    return NextResponse.json({ error: selErr.message }, { status: 500 });
  }
  if (!stores || stores.length === 0) {
    return NextResponse.json({ error: "store not found" }, { status: 404 });
  }
  if (count && count > 1) {
    return NextResponse.json({ error: "duplicate store rows" }, { status: 400 });
  }
  
  const store = stores[0];
  

  

  /* 4) 行があった場合 */
  return NextResponse.json([store]);        // ← 常に配列で返す
}

/*────────────────────────
   PUT  (更新はほぼそのまま)
────────────────────────*/
export async function PUT(req: NextRequest) {
  const cookiesStore = cookies();
  const storeToken = cookiesStore.get("store_token")?.value;
  if (!storeToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServerSupabase();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uid     = user.id;
  const payload = await req.json();

  const { data, error: upErr } = await supabase
    .from('stores')
    .upsert(
      {
        store_id:      uid,                 // ← RLS を通すキー
        name:          payload.name,
        email:         payload.email,
        phone:         payload.phoneNumber,
        postal_code:   payload.postalCode,
        prefecture:    payload.prefecture,
        city:          payload.city,
        street_address:payload.streetAddress,
        business_hours:payload.businessHours,
        open_time:     payload.open_time  ?? 10,
        close_time:    payload.close_time ?? 20,
        logo_url:      payload.logoUrl  ?? null,
        image_url:     payload.imageUrl ?? null,
        description:   payload.description,
        sns:           payload.sns,
      },
      { onConflict: 'store_id' }           // ← store_id が同じなら UPDATE
    )
    .select()
    .single();

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }
  return NextResponse.json(data);
}
  
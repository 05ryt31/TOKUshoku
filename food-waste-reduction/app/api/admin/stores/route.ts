// app/api/admin/stores/route.ts
import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // 単一店舗取得
    const { data: store, error } = await supabase
      .from("stores")
      .select("*")
      .eq("store_id", id)
      .single();

    if (error || !store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(store);
  } else {
    // 全店舗一覧取得
    const { data: stores, error } = await supabase
      .from("stores")
      .select("*");
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(stores);
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing store id" },
      { status: 400 }
    );
  }

  const storeData = await req.json();
  const { data, error } = await supabase
    .from("stores")
    .update({
      name: storeData.name,
      email: storeData.email,
      phone: storeData.phoneNumber,
      postal_code: storeData.postalCode,
      prefecture: storeData.prefecture,
      city: storeData.city,
      street_address: storeData.streetAddress,
      business_hours: storeData.businessHours,
      latitude: storeData.latitude,
      longitude: storeData.longitude,
      google_map_place_id: storeData.googleMapPlaceId,
      // 必要なら他フィールドも追加
    })
    .eq("store_id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
  return NextResponse.json(data);
}

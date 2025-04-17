import { NextResponse, NextRequest } from "next/server";
import supabase from "@/lib/supabase";

// ユーザー情報取得 API (GET /api/user)
export async function GET(req: NextRequest) {
  try {
    // Supabase からセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // users テーブルからユーザー情報を取得
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      points: user.points || 0,
      stamps: user.stamps || 0,
      phoneNumber: user.phone,
      postalCode: user.postal_code,
      prefecture: user.prefecture,
      city: user.city,
      streetAddress: user.street_address,
    });
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

// ユーザー情報更新 API (PUT /api/user)
export async function PUT(req: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userData = await req.json();

    // ユーザー情報を更新
    const { data, error } = await supabase
      .from("users")
      .update({
        name: userData.name,
        phone: userData.phoneNumber,
        postal_code: userData.postalCode,
        prefecture: userData.prefecture,
        city: userData.city,
        street_address: userData.streetAddress,
        ...(userData.email ? { email: userData.email } : {}),
      })
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Failed to update user data:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = data[0];
    return NextResponse.json({
      id: updatedUser.user_id,
      name: updatedUser.name,
      email: updatedUser.email,
      points: updatedUser.points || 0,
      stamps: updatedUser.stamps || 0,
      phoneNumber: updatedUser.phone,
      postalCode: updatedUser.postal_code,
      prefecture: updatedUser.prefecture,
      city: updatedUser.city,
      streetAddress: updatedUser.street_address,
    });
  } catch (error) {
    console.error("Failed to update user data:", error);
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 });
  }
}

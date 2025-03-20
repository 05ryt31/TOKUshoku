import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 商品一覧取得API (GET)
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "サーバーエラー", error }, { status: 500 });
  }
}

// 商品登録API（POST）
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, imageUrl, price, discounted_price, start_time, end_time } = body
    
    // Convert price and discounted_price to numbers
    const priceNumber = Number(price);
    const discountedPriceNumber = Number(discounted_price);

    // Convert start_time and end_time to Date objects
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    
    // バリデーション
    if (!name || typeof priceNumber !== "number" || typeof discountedPriceNumber !== "number") {
      console.error("Invalid data:", { name, description, imageUrl, priceNumber, discountedPriceNumber, startTime, endTime });
      return NextResponse.json({ message: "無効なデータです" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price: priceNumber,
        discounted_price: discountedPriceNumber,
        start_time: startTime,
        end_time: endTime,
      },
    });
    return NextResponse.json({ message: "商品を登録しました", product: newProduct }, { status: 201 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "サーバーエラー", error }, { status: 500 });
  }
}

// app/api/products/upload/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { mkdir } from 'fs/promises'

const prisma = new PrismaClient()

// ファイルアップロード用のAPIエンドポイント
export async function POST(request: Request) {
  console.log("リクエスト受信")
  try {
    // multipart/form-dataを処理するためにFormDataを使用
    const formData = await request.formData()
    
    // フォームから各フィールドを取得
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const discounted_price = Number(formData.get('discounted_price'))
    const start_time = formData.get('start_time') as string
    const end_time = formData.get('end_time') as string
    
    console.log("FormDataから取得した値:", {
      name, description, price, discounted_price, start_time, end_time,
      formData: Object.fromEntries(formData.entries())
    })
    
    // 画像ファイルを取得
    const imageFile = formData.get('image') as File

    // 必須フィールドのバリデーション
    if (!name || !imageFile || typeof price !== 'number' || typeof discounted_price !== 'number') {
      return NextResponse.json(
        { message: "必須フィールドが不足しています" },
        { status: 400 }
      )
    }

    // ファイルタイプの確認
    const contentType = imageFile.type
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { message: "画像ファイルのみアップロードできます" },
        { status: 400 }
      )
    }

    // ファイルサイズの確認 (10MB制限)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "ファイルサイズが大きすぎます (最大10MB)" },
        { status: 400 }
      )
    }

    // ファイル保存先のディレクトリ確認・作成
    const publicUploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(publicUploadDir, { recursive: true })
    } catch (error) {
      console.error("ディレクトリ作成エラー:", error)
    }

    // ファイル名を一意にするために現在時刻を追加
    const timestamp = Date.now()
    // 元のファイル名から拡張子を取得
    const originalName = imageFile.name
    const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    
    // 許可する拡張子のリスト
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { message: "許可されていないファイル形式です" },
        { status: 400 }
      )
    }
    
    // 安全なファイル名を生成
    const sanitizedName = originalName
      .split('.')[0]
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
    const fileName = `${sanitizedName}-${timestamp}.${fileExt}`
    
    // 保存先のパス
    const filePath = join(publicUploadDir, fileName)
    
    // ファイルをバイナリとして読み込み
    const fileArrayBuffer = await imageFile.arrayBuffer()
    const fileBuffer = Buffer.from(fileArrayBuffer)
    
    // ファイルをサーバーに保存
    await writeFile(filePath, fileBuffer)
    
    // データベースに保存するイメージURL (Next.jsの公開ディレクトリからの相対パス)
    const imageUrl = `/uploads/${fileName}`
    
    // データの型を確認して変換
    console.log("保存データの確認:", {
      name,
      description,
      imageUrl,
      price: typeof price,
      price_value: price,
      discounted_price: typeof discounted_price,
      discounted_price_value: discounted_price,
      start_time: typeof start_time,
      start_time_value: start_time,
      end_time: typeof end_time,
      end_time_value: end_time
    })
    
    // データベースに商品情報を保存
    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        description: String(description),
        imageUrl: String(imageUrl),
        price: Number(price),
        discounted_price: Number(discounted_price),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
      },
    })
    
    return NextResponse.json(
      { 
        message: "商品を登録しました", 
        product: newProduct 
      }, 
      { status: 201 }
    )
    
  } catch (error) {
    console.error("商品登録エラー:", error)
    return NextResponse.json(
      { message: "サーバーエラー", error }, 
      { status: 500 }
    )
  }
}
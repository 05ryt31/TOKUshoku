// app/products/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // 実際のアプリケーションでは、ここでAPIからお気に入り状態を取得します
    const checkFavoriteStatus = async () => {
      // モックの非同期処理
      await new Promise((resolve) => setTimeout(resolve, 100))
      setIsFavorite(Math.random() < 0.5) // ランダムな初期状態
    }
    checkFavoriteStatus()
  }, [])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // ここでお気に入り状態を保存するAPIを呼び出します
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt={`商品 ${params.id} の画像`}
              className="w-full rounded-lg shadow-lg"
            />
            <Badge className="absolute top-4 right-4 bg-red-500">30%OFF</Badge>
          </div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">商品名 {params.id}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={`${isFavorite ? "text-red-500" : "text-gray-500"}`}
              >
                <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-2xl font-bold text-red-600">¥300</p>
              <p className="line-through text-lg text-muted-foreground">¥500</p>
            </div>
            <p className="text-muted-foreground mb-6">
              この商品は環境に配慮した製造方法で作られており、賞味期限が近いため特別価格で提供しています。
              美味しさはそのままに、食品ロス削減に貢献できる商品です。
            </p>
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                asChild
              >
                <Link href={`/products/${params.id}/purchase`}>予約する</Link>
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h2 className="font-bold mb-2">商品情報</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>原産地: 日本</li>
                <li>内容量: 100g</li>
                <li>消費期限: 2024年3月1日</li>
                <li>保存方法: 冷蔵保存</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


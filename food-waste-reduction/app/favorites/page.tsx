"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"

interface Product {
  id: number
  name: string
  image: string
  originalPrice: number
  discountedPrice: number
}

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])

  useEffect(() => {
    // 実際のアプリケーションでは、ここでAPIからお気に入り商品を取得します
    const mockFavorites: Product[] = [
      {
        id: 1,
        name: "有機野菜セット",
        image: "/vegetables.jpg?height=200&width=300",
        originalPrice: 1500,
        discountedPrice: 1200,
      },
      {
        id: 2,
        name: "地元産フルーツミックス",
        image: "/fruit.jpeg",
        originalPrice: 2000,
        discountedPrice: 1600,
      },
      {
        id: 3,
        name: "手作りパン詰め合わせ",
        image: "/bread.jpeg?height=200&width=300",
        originalPrice: 1000,
        discountedPrice: 800,
      },
    ]
    setFavoriteProducts(mockFavorites)
  }, [])

  const handleFavoriteToggle = (id: number) => {
    // お気に入りページでは、ハートボタンをクリックすると商品を削除します
    setFavoriteProducts((prevFavorites) => prevFavorites.filter((product) => product.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">お気に入り商品</h1>
        {favoriteProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                initialFavorite={true} // お気に入りページでは常にtrueに設定
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">お気に入りの商品はまだありません。</p>
        )}
      </div>
    </div>
  )
}


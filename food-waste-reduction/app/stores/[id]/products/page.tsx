// app/stores/[id]/products/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProductCard from "@/components/product-card"

interface Product {
  id: number
  name: string
  image: string
  originalPrice: number
  discountedPrice: number
}

export default function StoreProductsPage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // In a real application, fetch products for this store from an API
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "有機野菜セット",
        image: "/placeholder.svg?height=200&width=300",
        originalPrice: 1500,
        discountedPrice: 1200,
      },
      {
        id: 2,
        name: "地元産フルーツミックス",
        image: "/placeholder.svg?height=200&width=300",
        originalPrice: 2000,
        discountedPrice: 1600,
      },
      {
        id: 3,
        name: "手作りパン詰め合わせ",
        image: "/placeholder.svg?height=200&width=300",
        originalPrice: 1000,
        discountedPrice: 800,
      },
    ]
    setProducts(mockProducts)
  }, [])

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <Link
          href={`/stores/${params.id}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          店舗詳細に戻る
        </Link>
        <h1 className="text-3xl font-bold mb-8">店舗の商品一覧</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
              viewDetailsButton={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


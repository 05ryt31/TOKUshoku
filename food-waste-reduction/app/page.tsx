"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Leaf, Camera, TrendingDown, Users, Store, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product-card"
import { Product } from "@prisma/client"

export default function Home() {
  const featuresRef = useRef<HTMLElement>(null)
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFavoriteToggle = (id: number) => {
    setFavoriteProducts((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((productId) => productId !== id)
        : [...prevFavorites, id],
    )
  }

  const products = [
    {
      id: 1,
      name: "有機野菜セット",
      image: "vegetables.jpg?height=200&width=300",
      originalPrice: 1500,
      discountedPrice: 1200,
    },
    {
      id: 2,
      name: "地元産フルーツミックス",
      image: "fruit.jpeg?height=200&width=300",
      originalPrice: 2000,
      discountedPrice: 1600,
    },
    {
      id: 3,
      name: "手作りパン詰め合わせ",
      image: "bread.jpeg?height=200&width=300",
      originalPrice: 1000,
      discountedPrice: 800,
    },
    {
      id: 4,
      name: "季節の魚介類セット",
      image: "fish.jpeg?height=200&width=300",
      originalPrice: 2500,
      discountedPrice: 2000,
    },
  ]

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-green-500" />,
      title: "レシートをスキャン",
      description: "個々に向けたおすすめ商品をご提案",
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-500" />,
      title: "近くのお得を発見！！",
      description: "マップ機能で様々なお店を見つけることが可能",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "お気に入りのお店を保存",
      description: "あなたの特別なお店がすぐわかるように",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                  地球にやさしい買い物を
                </Badge>
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  食品ロスを減らす、<br />
                  <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">
                    新しい
                  </span>
                  買い物のカタチ！
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  毎年約600万トン出る食料廃棄。<br />「まだ食べられる食料を救いたい」という思いを繋ぐ場です。
                </p>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    asChild
                  >
                    <Link href="/auth/user/signup">今すぐ始める</Link>
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    asChild
                  >
                    <Link href="/auth/store/signup">店舗として始める</Link>
                  </Button>
                  <Button size="lg" variant="outline" onClick={scrollToFeatures}>
                    詳しく見る
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20" />
                <img
                  src="/3.png?height=300&width=450"
                  alt="食品ロス削減イメージ"
                  className="rounded-lg shadow-2xl relative z-10 w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section ref={featuresRef} className="py-20 container">
          <h2 className="text-3xl font-bold text-center mb-12">3つの便利な機能!</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((step, i) => (
              <Card key={i} className="relative group hover:shadow-lg transition-all">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
                  {i + 1}
                </div>
                <CardHeader>
                  <div className="mb-4 p-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg w-fit group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 本日のお得な商品セクション */}
        <section className="py-20 bg-gradient-to-b from-white to-orange-50">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 p-2 rounded-lg">
                <TrendingDown className="h-6 w-6" />
              </span>
              本日のお得な商品
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountedPrice}
                  initialFavorite={favoriteProducts.includes(product.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            <Badge className="mt-12 mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              環境保護に向けて
            </Badge>
            <h2 className="text-3xl font-bold mb-6">私たちの取り組み</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              食品ロスの削減を通じて環境保護への貢献を目標としています。<br />
              「もったいない」を減らすために、ご協力ください！
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    MISSION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  国内で出る年間約600万トンの食品ロスを削減することを目指しています。
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-600" />
                    VISION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  企業の「届かない」とユーザーの「見つけたい」が出会う場所をご提供。
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    VALUE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  食品ロスをお得に、便利に解決し、環境を守ります。
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

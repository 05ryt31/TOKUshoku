"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: number
  name: string
  image: string
  originalPrice: number
  discountedPrice: number
  initialFavorite?: boolean
  onFavoriteToggle?: (id: number, isFavorite: boolean) => void
}

export default function ProductCard({
  id,
  name,
  image,
  originalPrice,
  discountedPrice,
  initialFavorite = false,
  onFavoriteToggle,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  useEffect(() => {
    setIsFavorite(initialFavorite)
  }, [initialFavorite])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    if (onFavoriteToggle) {
      onFavoriteToggle(id, newFavoriteState)
    }
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
        <Badge className="absolute top-2 right-2 bg-red-500">
          {Math.round((1 - discountedPrice / originalPrice) * 100)}%OFF
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 left-2 bg-white/80 hover:bg-white ${isFavorite ? "text-red-500" : "text-gray-500"}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-current" : "text-gray-500"}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <p className="font-bold mb-2 hover:text-primary">{name}</p>
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <p className="line-through text-sm text-muted-foreground">¥{originalPrice.toLocaleString()}</p>
            <p className="text-lg font-bold text-red-600">¥{discountedPrice.toLocaleString()}</p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            asChild
          >
            <Link href={`/products/${id}/purchase`}>予約する</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


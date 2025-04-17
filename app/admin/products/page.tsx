// app/admin/products/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Navigation from "@/app/components/navigation"

interface Product {
  id: number;
  name: string;
  price: number;
  discounted_price: number;
  start_time: string;
  end_time: string;
}

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
    <Navigation isAdmin={true} />
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto py-10 ">
        <h1 className="text-2xl font-bold mb-5">商品管理</h1>
        <div className="flex justify-between items-center mb-6 ">
          <div className="relative w-64 ">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="商品を検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> 新規商品追加
            </Link>
          </Button>
        </div>
        <Table className="w-full bg-white rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>価格</TableHead>
              <TableHead>割引価格</TableHead>
              <TableHead>受取可能時間</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>¥{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.discounted_price}</TableCell>
                <TableCell>
                  {new Date(product.start_time).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(",", "").replace(" ", "-")}
                  ~
                  {new Date(product.end_time).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(",", "").replace(" ", "-")}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>編集</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </section>
    </>
  )
}


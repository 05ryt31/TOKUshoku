// app/api/reciepts/[id]/page.tsx
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PurchasedProduct {
  id: number
  name: string
  price: number
  quantity: number
}

export default function ReceiptDetailPage({ params }: { params: { id: string } }) {
  // In a real application, fetch this data from an API
  const purchasedProducts: PurchasedProduct[] = [
    { id: 1, name: "有機野菜セット", price: 1200, quantity: 1 },
    { id: 2, name: "地元産フルーツミックス", price: 1600, quantity: 1 },
    { id: 3, name: "手作りパン詰め合わせ", price: 800, quantity: 2 },
  ]

  const total = purchasedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Link href="/receipts" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          レシート一覧に戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>レシート詳細 (ID: {params.id})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">数量: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">¥{(product.price * product.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">合計</p>
                  <p className="font-bold text-lg">¥{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


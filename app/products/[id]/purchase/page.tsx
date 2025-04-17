// app/products/[id]/purchase/page.tsx
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PurchasePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Link
          href={`/products/${params.id}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          商品ページに戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>購入確認</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="/vegetables.jpg?height=100&width=100"
                alt={`商品 ${params.id} の画像`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-bold">商品名 有機野菜セット</h2>
                <p className="text-lg font-bold text-red-600">¥1200</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">受け取り店舗</h3>
              <p className="text-muted-foreground">エコフード マルシェ 渋谷店</p>
              <p className="text-muted-foreground">東京都渋谷区渋谷1-1-1</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">受け取り可能時間</h3>
              <p className="text-muted-foreground">2024年2月23日 10:00 - 20:00</p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              size="lg"
              asChild
            >
              <Link href={`/products/${params.id}/map`}>購入を確定する</Link>
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              購入を確定すると、店舗への案内マップが表示されます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


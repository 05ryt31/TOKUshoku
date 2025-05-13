// app/stores/[id]/page.tsx
import Link from "next/link"
import { ArrowLeft, Store, MapPin, Phone, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  // この部分は実際のデータフェッチロジックに置き換える必要があります
  const store = {
    id: params.id,
    name: `エコフード マルシェ 店舗${params.id}`,
    address: "東京都渋谷区渋谷1-1-1",
    phone: "03-1234-5678",
    hours: "9:00-22:00",
    description:
      "当店は、食品ロス削減に取り組む地域密着型のスーパーマーケットです。新鮮な地元の食材と、賞味期限が近い商品を特別価格で提供しています。",
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <Link href="/favorites" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          お気に入り一覧に戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Store className="h-6 w-6 text-green-600" />
                {store.name}
              </span>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>{store.description}</p>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{store.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{store.hours}</span>
              </div>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">ここに地図が表示されます</p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              asChild
            >
              <Link href={`/stores/${params.id}/products`}>この店舗の商品を見る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


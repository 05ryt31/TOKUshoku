import Navigation from "@/app/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Store, BarChart } from "lucide-react"

export default function AdminPage() {
  return (
    <>
      {/* 管理者用ナビゲーション */}
      <Navigation isAdmin={true} />
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container py-12">
          
            <h2 className="text-3xl font-bold mb-8">管理者ダッシュボード</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    商品管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">商品の追加、編集、削除を行います。</p>
                  <Button className="w-full" asChild>
                    <Link href="/admin/products">商品一覧を見る</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    店舗プロフィール編集
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">店舗情報の管理や変更を行います。</p>
                  <Button className="w-full" asChild>
                    <Link href="/admin/stores">店舗情報を見る</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    売上レポート
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">売上データや食品ロス削減の効果を確認します。</p>
                  <Button className="w-full" asChild>
                    <Link href="/admin/reports">レポートを見る</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    取引一覧
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">取引の一覧を表示します。</p>
                  <Button className="w-full" asChild>
                    <Link href="/admin/transactions">取引一覧を見る</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
        </div>
      </section>
    </>
  )
}

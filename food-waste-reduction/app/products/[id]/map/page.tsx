// page.tsx
// app/products/[id]/map/page.tsx
"use client"; // クライアントコンポーネント

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

// GoogleMapComponent を遅延ロード（SSRを無効化）
const GoogleMapComponent = dynamic(() => import("./GoogleMapComponent"), {
  ssr: false,
  loading: () => <p>マップを読み込み中...</p>, // ローディング表示を追加
});

export default function MapPage() {
  const params = useParams();
  const productId = params?.id as string || "1"; // `params.id` がない場合のデフォルト値を設定

  const address = `東京都渋谷区渋谷1-1-${productId}`; // ID に応じて住所を変化させる

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          ホームに戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>店舗への案内</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Maps を埋め込む */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <GoogleMapComponent address={address} />
            </div>

            <div>
              <h3 className="font-bold mb-2">受け取り店舗</h3>
              <p className="text-muted-foreground">{address}</p> {/* 住所を表示 */}
            </div>
            <div>
              <h3 className="font-bold mb-2">受け取り可能時間</h3>
              <p className="text-muted-foreground">2024年2月23日 10:00 - 20:00</p>
            </div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              size="lg"
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="mr-2 h-4 w-4" />
                ナビゲーションを開始
              </a>
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ナビゲーションを開始すると、お使いの端末の地図アプリが起動します。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
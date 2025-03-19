"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StampCard from "@/components/stamp-card"
import Navigation from "@/app/components/navigation"

export default function MyPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/auth/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) {
    return null // or a loading spinner
  }

  const user = {
    name: "山田 太郎",
    email: "yamada@example.com",
    points: 150,
    stamps: 7,
  }

  return (
    <>
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">マイページ</h1>
            <Button variant="outline" asChild>
              <Link href="/mypage/edit">
                <Edit className="mr-2 h-4 w-4" />
                プロフィール編集
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー情報</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>名前:</strong> {user.name}
                </p>
                <p>
                  <strong>メールアドレス:</strong> {user.email}
                </p>
                <p>
                  <strong>ポイント:</strong> {user.points}pt
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>スタンプカード</CardTitle>
              </CardHeader>
              <CardContent>
                <StampCard stamps={user.stamps} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>最近の購入履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">商品名 {i + 1}</p>
                        <p className="text-sm text-muted-foreground">2024年2月{23 - i}日</p>
                      </div>
                    </div>
                    <p className="font-bold">¥300</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}


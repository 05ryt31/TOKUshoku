"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StampCard from "@/components/stamp-card";
import Navigation from "@/app/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  id: string;
  name: string;
  email: string;
  points: number;
  stamps: number;
  phoneNumber?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  streetAddress?: string;
}

interface PurchaseHistory {
  id: string;
  productName: string;
  date: string;
  price: number;
}

export default function MyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUserData(data);
        // --- 模擬データ（実際はバックエンドから取得） ---
        setPurchases([
          { id: "1", productName: "野菜セット", date: "2024年2月23日", price: 300 },
          { id: "2", productName: "フルーツセット", date: "2024年2月22日", price: 400 },
          { id: "3", productName: "パンセット", date: "2024年2月21日", price: 250 },
        ]);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/auth/user/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/auth/user/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background py-12">
          <div className="container max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>ユーザー情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>スタンプカード</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!userData) return null;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">マイページ</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 border-none"
                asChild
              >
                <Link href="/user/mypage/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  プロフィール編集
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー情報</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>名前:</strong> {userData.name}
                </p>
                <p>
                  <strong>メールアドレス:</strong> {userData.email}
                </p>
                <p>
                  <strong>ポイント:</strong> {userData.points}pt
                </p>
                {userData.phoneNumber && (
                  <p>
                    <strong>電話番号:</strong> {userData.phoneNumber}
                  </p>
                )}
                {userData.postalCode && userData.prefecture && (
                  <p>
                    <strong>住所:</strong> 〒{userData.postalCode} {userData.prefecture} {userData.city} {userData.streetAddress}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>スタンプカード</CardTitle>
              </CardHeader>
              <CardContent>
                <StampCard stamps={userData.stamps} />
              </CardContent>
            </Card>
          </div>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>最近の購入履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <li key={purchase.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{purchase.productName}</p>
                          <p className="text-sm text-muted-foreground">{purchase.date}</p>
                        </div>
                      </div>
                      <p className="font-bold">¥{purchase.price}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">購入履歴はありません</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

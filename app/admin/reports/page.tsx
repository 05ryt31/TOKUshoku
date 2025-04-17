// app/admin/reports/page.tsx
"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/app/components/navigation"

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("今週")

  // This data would typically come from an API call
  const reportData = {
    totalSales: 1250000,
    totalOrders: 500,
    averageOrderValue: 2500,
    foodWasteReduction: 750,
  }

  return (
    <>
      <Navigation isAdmin={true} />
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">売上レポート</h1>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="今日">今日</SelectItem>
                  <SelectItem value="今週">今週</SelectItem>
                  <SelectItem value="今月">今月</SelectItem>
                  <SelectItem value="今年">今年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総売上</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{reportData.totalSales.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">注文数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均注文金額</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{reportData.averageOrderValue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">食品ロス削減量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.foodWasteReduction}kg</div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">グラフ表示</h2>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">ここに売上推移などのグラフが表示されます</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


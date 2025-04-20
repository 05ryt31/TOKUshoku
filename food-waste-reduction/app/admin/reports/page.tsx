// app/admin/reports/page.tsx
"use client"

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/app/components/navigation"
import SalesChart from "@/app/components/SalesChart" // SalesChartをインポート

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("今週")


  const reportData = {
    totalSales: 1250000,
    totalOrders: 500,
    averageOrderValue: 2500,
    foodWasteReduction: 750,
  }


  const [salesData, setSalesData] = useState<
  { date: string; totalSales: number; totalOrders: number }[]
>([]);

useEffect(() => {
  if (period === "今日") {
    setSalesData([
      { date: "9:00", totalSales: 20000, totalOrders: 5 },
      { date: "12:00", totalSales: 50000, totalOrders: 10 },
      { date: "15:00", totalSales: 80000, totalOrders: 12 },
      { date: "18:00", totalSales: 100000, totalOrders: 15 },
    ])
  } else if (period === "今週") {
    setSalesData([
      { date: "4/1", totalSales: 200000, totalOrders: 50 },
      { date: "4/2", totalSales: 300000, totalOrders: 70 },
      { date: "4/3", totalSales: 250000, totalOrders: 60 },
      { date: "4/4", totalSales: 350000, totalOrders: 80 },
    ])
  } else if (period === "今月") {
    setSalesData([
      { date: "4/1", totalSales: 100000, totalOrders: 30 },
      { date: "4/5", totalSales: 150000, totalOrders: 40 },
      { date: "4/10", totalSales: 200000, totalOrders: 60 },
      { date: "4/15", totalSales: 180000, totalOrders: 55 },
      { date: "4/20", totalSales: 220000, totalOrders: 70 },
      { date: "4/25", totalSales: 250000, totalOrders: 80 },
    ])
  } else if (period === "今年") {
    setSalesData([
      { date: "1月", totalSales: 500000, totalOrders: 120 },
      { date: "2月", totalSales: 600000, totalOrders: 130 },
      { date: "3月", totalSales: 750000, totalOrders: 150 },
      { date: "4月", totalSales: 800000, totalOrders: 170 },
    ])
  }
}, [period])

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

          {/* グラフ表示エリア */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">売上グラフ</h2>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
             <SalesChart salesData={salesData} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// app/admin/products/new/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/app/components/navigation"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css" 

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    let payload: any = {};
    const formData = new FormData(event.currentTarget)
    for (var [key, value] of formData.entries()) { 
      payload[key] = value
    }

    if (selectedDate && startTime && endTime) {
      const dateString = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const startDateTime = new Date(`${dateString}T${startTime}:00Z`);
      const endDateTime = new Date(`${dateString}T${endTime}:00Z`);
  
      // Check if the start time is before the end time
      if (startDateTime >= endDateTime) {
        alert("終了時間は開始時間より遅く設定してください。");
        setIsLoading(false);
        return;
      }
  
    payload["start_time"] = new Date(`${dateString}T${startTime}:00Z`).toISOString()
    payload["end_time"] = new Date(`${dateString}T${endTime}:00Z`).toISOString()
    }

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  
    if (!res.ok) {
      console.log(res);
      throw new Error("Failed to add product");
    }
    setIsLoading(false)
    router.push("/admin/products")
  }

  return (
    <>
      <Navigation isAdmin={true} />
      <div className="container mx-auto py-10">
        <Link href="/admin/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          商品一覧に戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>新規商品登録</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">商品名</Label>
                <Input id="name" name='name' required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">商品説明</Label>
                <Textarea id="description" name='description' required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">定価</Label>
                  <Input id="price" name='price' type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discounted_price">割引価格</Label>
                  <Input id="discounted_price" name="discounted_price" type="number" min="0" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">受取可能時間</Label>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">開始時間</Label>
                  <Input 
                    id="start_time" 
                    name="start_time" 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">終了時間</Label>
                  <Input 
                    id="end_time" 
                    name="end_time" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} >
                {isLoading ? "登録中..." : "商品を登録"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


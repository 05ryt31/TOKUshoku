"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // ファイルが画像かどうか確認
      if (!file.type.match('image.*')) {
        alert('画像ファイルを選択してください')
        return
      }
      
      // 10MBを超えるファイルはサイズが大きすぎる警告
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます（10MB以下にしてください）')
        return
      }
      
      setImageFile(file)
      
      // 画像プレビューを作成
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.onerror = () => {
        alert('プレビューの読み込みに失敗しました')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(event.currentTarget)

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

        formData.set("start_time", new Date(`${dateString}T${startTime}:00Z`).toISOString())
        formData.set("end_time", new Date(`${dateString}T${endTime}:00Z`).toISOString())
      }
      
      // 画像ファイルをFormDataに追加
      if (imageFile) {
        formData.set("image", imageFile)
      } else {
        alert("商品画像を選択してください")
        setIsLoading(false)
        return
      }
      
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.message || "商品の登録に失敗しました")
      }
      
      router.push("/admin/products")
    } catch (error) {
      console.error("提出エラー:", error)
      alert("エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
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
              <div className="space-y-2">
                <Label htmlFor="image">商品画像</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      画像を選択
                    </Button>
                  </div>

                  {/* 画像プレビュー */}
                  {imagePreview && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-full max-w-md bg-slate-50 p-2 rounded-lg shadow-sm">
                        <div className="aspect-video flex items-center justify-center overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="プレビュー" 
                            className="rounded-md border border-gray-200 object-contain max-h-full max-w-full"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg' // エラー時のフォールバック画像
                              alert('画像の表示に問題が発生しました。別の画像を選択してください。')
                            }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {imageFile?.name}
                          </p>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setImageFile(null)
                              setImagePreview(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            削除
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
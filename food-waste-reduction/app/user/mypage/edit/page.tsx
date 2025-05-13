"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // フォームフィールドの状態
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [prefecture, setPrefecture] = useState("")
  const [city, setCity] = useState("")
  const [streetAddress, setStreetAddress] = useState("")

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login')
            return
          }
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setName(data.name || "")
        setEmail(data.email || "")
        setPhoneNumber(data.phoneNumber || "")
        setPostalCode(data.postalCode || "")
        setPrefecture(data.prefecture || "")
        setCity(data.city || "")
        setStreetAddress(data.streetAddress || "")
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, postalCode, prefecture, city, streetAddress }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: "プロフィールを更新しました",
        description: "変更が正常に保存されました。",
        duration: 3000,
      })
      
      router.push('/user/mypage')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "エラーが発生しました",
        description: "プロフィールの更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl">
          <div className="mb-6 h-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Link href="/user/mypage" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          マイページに戻る
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>プロフィール編集</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">名前</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">電話番号</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="postalCode">郵便番号</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="prefecture">都道府県</Label>
                <Input id="prefecture" value={prefecture} onChange={(e) => setPrefecture(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">市区町村</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="streetAddress">番地・建物名</Label>
                <Input id="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "更新中..." : "更新する"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



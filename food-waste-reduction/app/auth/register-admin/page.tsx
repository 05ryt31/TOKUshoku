"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminRegisterPage() {
  const [adminName, setAdminName] = useState("")
  const [storeName, setStoreName] = useState("")
  const [storeAddress, setStoreAddress] = useState("")
  const [storePhone, setStorePhone] = useState("")
  const [storeEmail, setStoreEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      adminName,
      storeName,
      storeAddress,
      storePhone,
      storeEmail,
    }

    console.log("申請内容:", formData)

    // 仮API
    await new Promise((res) => setTimeout(res, 1000))
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
      <CardHeader>
  <CardTitle className="text-2xl text-center">管理者 新規申請</CardTitle>
  {!submitted && (
    <CardDescription className="text-center">
      お店の情報と管理者名を入力してください
    </CardDescription>
  )}
</CardHeader>

        <CardContent>
          {submitted ? (
            <div className="text-center text-green-600 space-y-4">
              <p>申請を受け付けました！</p>
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                ログイン画面に戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adminName">管理者のお名前</Label>
                <Input
                  id="adminName"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeName">お店のお名前</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">お店の場所</Label>
                <Input
                  id="storeAddress"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">お店の電話番号</Label>
                <Input
                  id="storePhone"
                  type="tel"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">お店のメールアドレス</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                新規申請する
              </Button>
              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
                  ログインに戻る
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

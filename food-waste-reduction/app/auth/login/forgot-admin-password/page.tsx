// /app/auth/login/forgot-password-admin/page-admin.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordAdminPage() {
  const [email, setEmail] = useState("")
  const [adminId, setAdminId] = useState("")

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Requesting password reset for admin:", email)

    // Simulate API call for sending reset link
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate email sent
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">管理者用パスワードをお忘れですか？</CardTitle>
          <CardDescription className="text-center">
            管理者IDと登録されたメールアドレスを入力してください。
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-sm text-green-600">パスワードリセットリンクを送信しました！</p>
              <Link href="/auth/login" className="text-blue-600 hover:underline">ログイン画面に戻る</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adminId">管理者ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="admin123"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              >
                リセットリンクを送信
              </Button>
              <div className="text-center space-y-2">
                <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
                  ログイン画面に戻る
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

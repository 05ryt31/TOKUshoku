// app/auth/login/forgot-password/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // This would typically be an API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "認証コードを送信しました",
      description: "入力されたメールアドレスに認証コードを送信しました。メールをご確認ください。",
    })

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              ログインに戻る
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">パスワードをお忘れの方</CardTitle>
          <CardDescription>
            登録したメールアドレスを入力してください。パスワードリセットの認証コードをお送りします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "送信中..." : "認証コードを送信"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


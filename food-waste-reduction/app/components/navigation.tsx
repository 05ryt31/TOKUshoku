"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Leaf, Store, Users, User, Heart, Package, Receipt } from "lucide-react"

interface NavigationProps {
  isAdmin?: boolean
}

export default function Navigation({ isAdmin = false }: NavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("authToken")
      setIsLoggedIn(!!token)
    }

    checkLoginStatus()
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  return isAdmin ? (
    <header className="bg-gradient-to-r from-green-50 to-blue-50 border-b sticky top-0 backdrop-blur-md z-50 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/admin" className="flex items-center gap-2">
        <img src="/hackathon-Photoroom.png" alt="Hackathon" className="w-9 h-auto" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
          TOKUshoku 管理画面
          </h1>
        </Link>
      </div>
    </header>
  ) : (
    <header className="bg-gradient-to-r from-green-50 to-blue-50 border-b sticky top-0 backdrop-blur-md z-50 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/hackathon-Photoroom.png" alt="Hackathon" className="w-9 h-auto" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
          TOKUshoku
          </h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/receipts"
            className="text-sm font-medium hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-green-100"
          >
            <Receipt className="h-4 w-4" />
            レシート
          </Link>
          <Link
            href="/stores"
            className="text-sm font-medium hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-green-100"
          >
            <Store className="h-4 w-4" />
            店舗検索
          </Link>
          <Link
            href="/favorites"
            className="text-sm font-medium hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-green-100"
          >
            <Heart className="h-4 w-4" />
            お気に入り
          </Link>
          {isLoggedIn ? (
            <Link
              href="/mypage"
              className="text-sm font-medium hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-green-100"
            >
              <User className="h-4 w-4" />
              マイページ
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-green-100"
            >
              <Users className="h-4 w-4" />
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

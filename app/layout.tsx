// app/layout.tsx
import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import NavigationWrapper from "@/app/components/NavigationWrapper" // 先ほど作成したコンポーネント

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TOKUshoku - 食品ロス削減でお得に買い物",
  description:
    "食品ロス削減に貢献しながら、賢くお買い物ができるプラットフォーム",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* クライアント側で条件分岐した NavigationWrapper を使う */}
        <NavigationWrapper />
        {children}
      </body>
    </html>
  )
}

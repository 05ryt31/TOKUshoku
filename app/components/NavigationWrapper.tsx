// app/components/NavigationWrapper.tsx
"use client"

import { usePathname } from "next/navigation"
import Navigation from "@/app/components/navigation"

export default function NavigationWrapper() {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")
  
  // /admin 配下の場合はナビゲーションを表示しない
  return !isAdminRoute ? <Navigation /> : null
}

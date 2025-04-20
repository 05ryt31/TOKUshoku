// page.tsx
// app/stores/page.tsx
"use client";
import dynamic from "next/dynamic";

// NearbyStores を遅延ロード（SSRを無効化）
const NearbyStores = dynamic(() => import("./NearbyStores"), {
  ssr: false,
  loading: () => <p>マップを読み込み中...</p>,
});

export default function MapPage() {
  return <NearbyStores />;
}
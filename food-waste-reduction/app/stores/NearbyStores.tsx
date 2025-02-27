// NearbyStores.tsx

"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { storeData } from "./storesData";
import { Button } from "@/components/ui/button"; // ShadCNのボタンコンポーネント（無い場合は<button>でOK）

const NAVBAR_HEIGHT = 60;

const containerStyle = {
  width: "100vw",
  height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
  position: "absolute",
  top: `${NAVBAR_HEIGHT}px`,
  left: "0",
};

const defaultCenter = { lat: 35.6895, lng: 139.6917 };

export default function NearbyStores() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDiscountStores, setShowDiscountStores] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? "",
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError("位置情報の取得が許可されていません。ブラウザの設定を確認してください。");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setError("デバイスの位置情報が利用できません。");
          } else if (error.code === error.TIMEOUT) {
            setError("位置情報の取得に時間がかかりすぎました。もう一度お試しください。");
          } else {
            setError("現在地を取得できませんでした。");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  if (!isLoaded) return <p>マップを読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredStores = showDiscountStores
    ? storeData.filter((store) => store.hasDiscount)
    : storeData;

  return (
    <div>
      {/* 🔹 変更点: ボタンの位置を「右」に調整（left-4 → right-4） */}
      <div className="absolute top-16 right-16 z-10">
        <Button
          onClick={() => setShowDiscountStores(!showDiscountStores)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-center h-10 min-h-[40px] leading-normal pt-4"
        >
          {showDiscountStores ? "全店舗を表示" : "割引商品のある店舗を表示"}
        </Button>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={14}>
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="12" fill="#4285F4" stroke="white" stroke-width="3"/>
                  </svg>
                `),
              scaledSize: isLoaded ? new window.google.maps.Size(50, 50) : undefined,
              anchor: isLoaded ? new window.google.maps.Point(25, 25) : undefined,
            }}
          />
        )}

        {filteredStores.map((store, index) => (
          <Marker
            key={index}
            position={{ lat: store.lat, lng: store.lng }}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
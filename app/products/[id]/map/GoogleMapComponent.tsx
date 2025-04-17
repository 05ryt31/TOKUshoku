// GoogleMapComponent.tsx
// app/products/[id]/map/GoogleMapComponent.tsx
"use client"; // クライアントコンポーネント

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function GoogleMapComponent({ address }: { address: string }) {
  const [center, setCenter] = useState({ lat: 35.6895, lng: 139.6917 }); // 初期値: 東京
  const [markerPosition, setMarkerPosition] = useState(center); // マーカーの位置
  const [error, setError] = useState<string | null>(null); // エラー処理

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Google Maps API をロード
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? "", // APIキーが存在しない場合、空文字を渡す
  });

  useEffect(() => {
    if (!address || !apiKey) {
      setError("Google Maps API キーが設定されていません。");
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCenter({ lat: location.lat, lng: location.lng });
          setMarkerPosition({ lat: location.lat, lng: location.lng });
        } else {
          setError(`Google Maps API のレスポンスエラー: ${data.status}`);
        }
      } catch (err) {
        setError("Google Maps API のリクエストに失敗しました。");
      }
    };

    fetchCoordinates();
  }, [address, apiKey]);

  if (!isLoaded) return <p>マップを読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={markerPosition} />
    </GoogleMap>
  );
}
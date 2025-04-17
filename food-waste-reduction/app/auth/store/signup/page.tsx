
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function StoreSignUpPage() {
  const router = useRouter();
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    prefecture: "",
    city: "",
    streetAddress: "",
    businessHours: "",
  });

  const [location, setLocation] = useState({
    latitude: 35.6812,      // 初期位置(例: 東京駅)
    longitude: 139.7671,
    googleMapPlaceId: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const mapContainerStyle = { width: "100%", height: "300px" };
  const center = { lat: location.latitude, lng: location.longitude };

  // フォーム入力を制御
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // マップ上のクリックで緯度経度を取得
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
        googleMapPlaceId: `place_${Date.now()}`,
      });
    }
  };

  // サインアップAPI呼び出し
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("/api/auth/store/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: {
          postalCode: formData.postalCode,
          prefecture: formData.prefecture,
          city: formData.city,
          streetAddress: formData.streetAddress,
        },
        business_hours: formData.businessHours,
        latitude: location.latitude,
        longitude: location.longitude,
        google_map_place_id: location.googleMapPlaceId,
      });

      if (response.status === 200) {
        setMessageType("success");
        setMessage("店舗登録が成功しました。ログインしてください。");
        // 登録後にログイン画面へ遷移
        router.push("/auth/store/login");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setMessageType("error");
        setMessage(err.response.data.message || "店舗登録に失敗しました。");
      } else {
        setMessageType("error");
        setMessage("店舗登録に失敗しました。");
      }
      console.error("Store signup error:", err);
    }
  };

  return (
    <FormWrapper
      title="店舗サインアップ"
      description="店舗アカウントを作成して、店舗向けのサービスを利用開始します。"
      message={message}
      messageType={messageType}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* メール & パスワード */}
        <div>
          <label htmlFor="email" className="block mb-1">メールアドレス</label>
          <input
            id="email"
            type="email"
            className="border w-full p-2"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">パスワード</label>
          <input
            id="password"
            type="password"
            className="border w-full p-2"
            value={formData.password}
            onChange={handleFormChange}
            required
          />
        </div>
        {/* 店舗情報 */}
        <div>
          <label htmlFor="name" className="block mb-1">店舗名</label>
          <input
            id="name"
            type="text"
            className="border w-full p-2"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1">電話番号</label>
          <input
            id="phoneNumber"
            type="text"
            className="border w-full p-2"
            value={formData.phoneNumber}
            onChange={handleFormChange}
            required
          />
        </div>
        {/* 住所 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block mb-1">郵便番号</label>
            <input
              id="postalCode"
              type="text"
              className="border w-full p-2"
              value={formData.postalCode}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label htmlFor="prefecture" className="block mb-1">都道府県</label>
            <input
              id="prefecture"
              type="text"
              className="border w-full p-2"
              value={formData.prefecture}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="city" className="block mb-1">市区町村</label>
          <input
            id="city"
            type="text"
            className="border w-full p-2"
            value={formData.city}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="streetAddress" className="block mb-1">それ以降の住所</label>
          <input
            id="streetAddress"
            type="text"
            className="border w-full p-2"
            value={formData.streetAddress}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <label htmlFor="businessHours" className="block mb-1">営業時間</label>
          <input
            id="businessHours"
            type="text"
            className="border w-full p-2"
            placeholder="例: 9:00-18:00"
            value={formData.businessHours}
            onChange={handleFormChange}
            required
          />
        </div>
        {/* 地図 */}
        <div>
          <label className="block mb-1">店舗位置（マップをクリックして指定）</label>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            onLoad={() => setGoogleMapsLoaded(true)}
          >
            {googleMapsLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={{ lat: location.latitude, lng: location.longitude }} />
              </GoogleMap>
            )}
          </LoadScript>
        </div>
        <button
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          type="submit"
        >
          店舗登録
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        すでにアカウントをお持ちですか？{" "}
        <Link href="/auth/store/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </div>
    </FormWrapper>
  );
}

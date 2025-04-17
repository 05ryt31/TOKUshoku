
// app/admin/stores/page.tsx
"use client"


import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Navigation from "@/app/components/navigation"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "/Users/yua_tsuchihashi/Documents/GitHub/Hackathon/food-waste-reduction/app/utils/cropImage"  // 修正
import { Dialog } from "@headlessui/react"

export default function StoreProfileEditPage() {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [hours, setHours] = useState("10:00 - 20:00")
  const [sns, setSNS] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("")
  
  const [prefecture, setPrefecture] = useState('')
  const [city, setCity] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [openTime, setOpenTime] = useState("10")  // 開店時間
  const [closeTime, setCloseTime] = useState("20")  // 閉店時間

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
    // ロゴ画像も同じ関数で管理したいため、処理を別の関数で分けます
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 電話番号のフォーマットを自動的に整える（例： 03-1234-5678）
    const formattedValue = value
      .replace(/\D/g, "")  // 数字以外の文字を削除
      .replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3")  // 3桁-4桁-4桁にフォーマット
    setPhone(formattedValue);
  }

  const handleSave = () => {
    console.log({ name, prefecture, city, addressLine, phone, hours, sns, description, imageFile })
    alert("保存しました！")
  }

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [showCropModal, setShowCropModal] = useState(false)

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoPreviewUrl(url)
      setShowCropModal(true)
    }
  }

  const handleCropDone = async () => {
    if (!logoPreviewUrl || !croppedAreaPixels) return
    const croppedImage = await getCroppedImg(logoPreviewUrl, croppedAreaPixels)
    const blob = await fetch(croppedImage).then(res => res.blob())
    const file = new File([blob], "cropped_logo.jpg", { type: "image/jpeg" })
    setLogoFile(file)
    setLogoPreviewUrl(croppedImage)
    setShowCropModal(false)
  }

  const handleDeleteLogo = () => {
    setLogoFile(null)
    setLogoPreviewUrl("")
  }

  return (
    <>
      <Navigation isAdmin={true} />
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto max-w-xl py-10 space-y-6">
          <h1 className="text-2xl font-bold mb-4">店舗プロフィール編集</h1>

          <div className="space-y-2">
            <label className="font-semibold">店舗名</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-semibold">店舗ロゴをアップロード</label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                ファイルを選択
              </label>
              <span className="text-gray-600 text-sm">
                {logoFile ? logoFile.name : "選択されていません"}
              </span>
              {logoPreviewUrl && (
                <button
                  onClick={handleDeleteLogo}
                  className="text-red-500 text-sm underline ml-2"
                >
                  削除
                </button>
              )}
            </div>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            {logoPreviewUrl && (
              <div className="w-32 h-32 mt-3 overflow-hidden rounded-md border">
                <img
                  src={logoPreviewUrl}
                  alt="店舗ロゴ"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <Dialog open={showCropModal} onClose={() => setShowCropModal(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
              <Dialog.Panel className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
                <Dialog.Title className="text-lg font-bold mb-2">ロゴを切り抜く</Dialog.Title>
                <div className="relative w-full h-64 bg-gray-100">
                  <Cropper
                    image={logoPreviewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button onClick={() => setShowCropModal(false)} className="px-4 py-2 text-gray-600 hover:underline">
                    キャンセル
                  </button>
                  <button
                    onClick={handleCropDone}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md"
                  >
                    切り抜いて保存
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

          <div className="space-y-2">
            <label className="font-semibold">電話番号</label>
            <Input
              value={phone}
              onChange={handlePhoneChange}
              placeholder="例: 0312345678"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold">住所</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="prefecture" className="block text-sm">都道府県</label>
                <Input
                  id="prefecture"
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  placeholder="例: 東京都"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="city" className="block text-sm">市区町村</label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="例: 渋谷区"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="addressLine" className="block text-sm">番地</label>
              <Input
                id="addressLine"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="例: 渋谷1-1-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold">営業時間</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="open-time" className="block text-sm">開店時間</label>
                <select
                  id="open-time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={String(hour).padStart(2, "0")}>
                      {String(hour).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="close-time" className="block text-sm">閉店時間</label>
                <select
                  id="close-time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  {[...Array(24).keys()].map((hour) => (
                    <option key={hour} value={String(hour).padStart(2, "0")}>
                      {String(hour).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold">SNSリンク</label>
            <Input
              value={sns}
              onChange={(e) => setSNS(e.target.value)}
              placeholder="SNSリンクを入力"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold">店舗説明</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="店舗の紹介文"
            />
          </div>
          <div className="space-y-2">
            <label className="font-semibold">店舗写真をアップロード</label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                ファイルを選択
              </label>
              <span className="text-gray-600 text-sm">
                {imageFile ? imageFile.name : "選択されていません"}
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <img src={previewUrl} alt="店舗写真" className="rounded-md mt-3 w-full max-h-60 object-cover border" />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </section>
    </>
  )
}

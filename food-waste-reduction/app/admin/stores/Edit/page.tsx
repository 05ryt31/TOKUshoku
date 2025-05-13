// app/admin/stores/Edit/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/app/components/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { getCroppedImg } from "@/app/utils/cropImage";

type StoreData = {
  name: string;
  email: string;
  phone: string;
  postal_code: string;
  prefecture: string;
  city: string;
  street_address: string;
  business_hours: string;
  description: string;
  sns: string;
  open_time: number;
  close_time: number;
  logo_url?: string;
  image_url?: string;
};

export default function StoreEditPage() {
  const router = useRouter();
  const id = useSearchParams().get("id");          // undefined = 新規
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreData>({
    name: "", email: "", phone: "",
    postal_code: "", prefecture: "",
    city: "", street_address: "",
    business_hours: "", description: "",
    sns: "", open_time: 10, close_time: 20,
  });

  // ---------- 画像用ステート ----------
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>();
  const [openCrop, setOpenCrop] = useState(false);

  // ---------- 初期表示 ----------
  useEffect(() => {
    if (isEdit && id) {
      const fetchStore = async () => {
        try {
          const res = await fetch(`/api/admin/stores?id=${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error('Failed to fetch store data');
          const data = await res.json();
          
          // 配列として返ってくる場合は最初の要素を使用
          const storeData = Array.isArray(data) ? data[0] : data;
          
          setForm({
            name: storeData.name || '',
            email: storeData.email || '',
            phone: storeData.phone || '',
            postal_code: storeData.postal_code || '',
            prefecture: storeData.prefecture || '',
            city: storeData.city || '',
            street_address: storeData.street_address || '',
            business_hours: storeData.business_hours || '',
            description: storeData.description || '',
            sns: storeData.sns || '',
            open_time: storeData.open_time || 10,
            close_time: storeData.close_time || 20,
            logo_url: storeData.logo_url,
            image_url: storeData.image_url
          });
          if (storeData.logo_url) setLogoPreview(storeData.logo_url);
          if (storeData.image_url) setImagePreview(storeData.image_url);
        } catch (error) {
          console.error('Error fetching store:', error);
          alert('店舗データの取得に失敗しました');
        } finally {
          setLoading(false);
        }
      };
      fetchStore();
    } else {
      setLoading(false); // 新規作成の場合はローディング停止
    }
  }, [id, isEdit]);

  // ---------- ハンドラ ----------
  const handle = (k: keyof StoreData, v: any) => setForm(f => ({ ...f, [k]: v }));
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const fmt = raw.replace(/^(\d{2,4})(\d{2,4})(\d{3,4})$/, "$1-$2-$3");
    handle("phone", fmt);
  };

  // ロゴアップロード → Cropper 起動
  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setOpenCrop(true);
  };

  const onCropDone = async () => {
    if (!logoPreview || !croppedAreaPixels) return;
    const croppedDataUrl = await getCroppedImg(logoPreview, croppedAreaPixels);
    const blob = await fetch(croppedDataUrl).then(r => r.blob());
    const file = new File([blob], "logo.jpg", { type: "image/jpeg" });
    setLogoFile(file);
    setLogoPreview(croppedDataUrl);
    setOpenCrop(false);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------- 保存 ----------
  const uploadImage = async (file: File, folder: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'  // Cookieを送信
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "アップロードに失敗しました");
      }
      
      const data = await response.json();
      console.log("アップロード成功:", data);
      return data.url;
    } catch (error) {
      console.error("アップロードエラー:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // APIの期待するパラメータ名に合わせて変換
      const payload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phone,
        postalCode: form.postal_code,
        prefecture: form.prefecture, 
        city: form.city,
        streetAddress: form.street_address,
        businessHours: form.business_hours,
        description: form.description,
        sns: form.sns,
        open_time: form.open_time,
        close_time: form.close_time,
        logoUrl: form.logo_url,
        imageUrl: form.image_url,
      };

      // Storage へアップロード
      if (logoFile) payload.logoUrl = await uploadImage(logoFile, "logos");
      console.log("logoUrl", payload.logoUrl);
      if (imageFile) payload.imageUrl = await uploadImage(imageFile, "photos");
      console.log("imageUrl", payload.imageUrl);

      const method =  "PUT" ;
      const endpoint = `/api/admin/stores`;
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Cookieを含める
        body: JSON.stringify(payload),
      });
      console.log("response", res);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "保存に失敗しました");
      }

      router.push("/admin/stores");
    } catch (err: any) {
      console.error("Save error:", err);
      alert("保存失敗: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- JSX ----------
  if (loading) return <p className="p-10">読み込み中…</p>;

  return (
    <>
      <Navigation isAdmin />
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto max-w-xl space-y-6">
          <h1 className="text-2xl font-bold">{isEdit ? "店舗情報編集" : "新規店舗作成"}</h1>

          {/* 店舗名 */}
          <div className="space-y-2">
            <label className="font-semibold">店舗名</label>
            <Input value={form.name} onChange={e => handle("name", e.target.value)} />
          </div>

          {/* ロゴ */}
          <div className="space-y-2">
            <label className="font-semibold">店舗ロゴ</label>
            <div className="flex items-center gap-4">
              <label htmlFor="logo" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
                ファイルを選択
              </label>
              <input id="logo" type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
              {logoPreview && <img src={logoPreview} alt="logo" className="w-16 h-16 object-cover rounded-md" />}
            </div>
          </div>

          {/* メールアドレス */}
          <div className="space-y-2">
            <label className="font-semibold">メールアドレス</label>
            <Input 
              type="email" 
              value={form.email} 
              onChange={e => handle("email", e.target.value)} 
              placeholder="example@mail.com" 
            />
          </div>

          {/* 電話番号 */}
          <div className="space-y-2">
            <label className="font-semibold">電話番号</label>
            <Input value={form.phone} onChange={handlePhone} placeholder="03-1234-5678" />
          </div>

          {/* 住所 */}
          <div className="space-y-2">
            <label className="font-semibold">住所</label>
            <div className="flex gap-2">
              <Input placeholder="郵便番号" value={form.postal_code} onChange={e => handle("postal_code", e.target.value)} className="w-32" />
              <Input placeholder="都道府県" value={form.prefecture} onChange={e => handle("prefecture", e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Input placeholder="市区町村" value={form.city} onChange={e => handle("city", e.target.value)} className="w-1/2" />
              <Input placeholder="番地" value={form.street_address} onChange={e => handle("street_address", e.target.value)} className="flex-1" />
            </div>
          </div>

          {/* 営業時間 */}
          <div className="space-y-2">
            <label className="font-semibold">営業時間</label>
            <div className="flex gap-4">
              {[["open_time", form.open_time], ["close_time", form.close_time]].map(([k, v]) => (
                <select 
                  key={k} 
                  value={v as number}
                  onChange={e => handle(k as keyof StoreData, parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 border rounded-md"
                >
                  {Array.from({ length: 24 }, (_, h) => (
                    <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* SNS & 説明 */}
          <div className="space-y-2">
            <label className="font-semibold">SNSリンク</label>
            <Input value={form.sns} onChange={e => handle("sns", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="font-semibold">店舗説明</label>
            <Textarea rows={4} value={form.description} onChange={e => handle("description", e.target.value)} />
          </div>

          {/* 店舗写真 */}
          <div className="space-y-2">
            <label className="font-semibold">店舗写真</label>
            <div>
              <label htmlFor="photo" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
                ファイルを選択
              </label>
              <input id="photo" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              {imagePreview && <img src={imagePreview} alt="store" className="mt-2 w-full h-40 object-cover rounded-md" />}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>{saving ? "保存中…" : "保存"}</Button>
          </div>
        </div>
      </section>

      {/* Cropper モーダル */}
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg p-4 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-2">ロゴを切り抜く</DialogTitle>
            <div className="relative w-full h-64 bg-gray-100">
              <Cropper
                image={logoPreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea: any, croppedAreaPixels: any) => 
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setOpenCrop(false)}>キャンセル</Button>
              <Button onClick={onCropDone}>保存</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
// app/admin/stores/Edit/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/app/components/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type StoreData = {
  store_id?: string
  name: string
  email: string
  phone: string
  postal_code: string
  prefecture: string
  city: string
  street_address: string
  business_hours: string
  latitude?: number
  longitude?: number
  google_map_place_id?: string
}

export default function StoreEditPage() {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get("id") || ""

  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<StoreData>({
    name: "",
    email: "",
    phone: "",
    postal_code: "",
    prefecture: "",
    city: "",
    street_address: "",
    business_hours: "",
    latitude: undefined,
    longitude: undefined,
    google_map_place_id: "",
  })

  // fetch existing store
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetch(`/api/admin/stores?id=${id}`)
      .then((res) => res.json())
      .then((data: StoreData) => {
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          postal_code: data.postal_code,
          prefecture: data.prefecture,
          city: data.city,
          street_address: data.street_address,
          business_hours: data.business_hours,
          latitude: data.latitude,
          longitude: data.longitude,
          google_map_place_id: data.google_map_place_id,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (key: keyof StoreData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const url = id ? `/api/admin/stores?id=${id}` : `/api/admin/stores`
    const method = id ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      router.push("/admin/stores")
    } else {
      const err = await res.json()
      alert("保存に失敗しました: " + err.error)
    }
  }

  return (
    <>
      <Navigation isAdmin={true} />
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto max-w-md space-y-6">
          <h1 className="text-2xl font-bold">
            {id ? "店舗情報編集" : "新規店舗作成"}
          </h1>

          {loading ? (
            <p>読み込み中…</p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="font-semibold">店舗名</label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold">メール</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold">電話番号</label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="font-semibold">郵便番号</label>
                  <Input
                    value={form.postal_code}
                    onChange={(e) =>
                      handleChange("postal_code", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-semibold">都道府県</label>
                  <Input
                    value={form.prefecture}
                    onChange={(e) =>
                      handleChange("prefecture", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold">市区町村・番地</label>
                <Input
                  value={`${form.city} ${form.street_address}`}
                  onChange={(e) => {
                    const [c, ...rest] = e.target.value.split(" ")
                    handleChange("city", c)
                    handleChange("street_address", rest.join(" "))
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold">営業時間</label>
                <Input
                  value={form.business_hours}
                  onChange={(e) =>
                    handleChange("business_hours", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="font-semibold">緯度</label>
                  <Input
                    type="number"
                    value={form.latitude ?? ""}
                    onChange={(e) =>
                      handleChange("latitude", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-semibold">経度</label>
                  <Input
                    type="number"
                    value={form.longitude ?? ""}
                    onChange={(e) =>
                      handleChange("longitude", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold">Google Maps Place ID</label>
                <Input
                  value={form.google_map_place_id}
                  onChange={(e) =>
                    handleChange("google_map_place_id", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold">店舗説明</label>
                <Textarea
                  rows={4}
                  value={form.business_hours}
                  onChange={(e) =>
                    handleChange("business_hours", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "保存中…" : "保存する"}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

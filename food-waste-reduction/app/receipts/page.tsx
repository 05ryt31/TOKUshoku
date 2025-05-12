// app/receipts/page.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Upload, Camera, Receipt, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ReceiptsPage() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // スキャン履歴として、バックエンドから返ってきた JSON を保持する配列
  const [scanHistory, setScanHistory] = useState<any[]>([])

  // ファイル選択時にプレビュー用の URL を作成
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  // 画像保存ボタン押下時、Python バックエンドへ画像を送信し、結果を取得してスキャン履歴に追加する
  const handleSave = async () => {
    if (!selectedFile) {
      console.error("ファイルが選択されていません")
      return
    }
    setIsLoading(true) // ローディング開始
  
    const formData = new FormData()
    formData.append("file", selectedFile)
    try {
      const res = await fetch("/receipts/api", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const result = await res.json()
        console.log("Pythonバックエンドからの結果:", result)
        // 取得した JSON を先頭に追加
        setScanHistory((prev) => [result, ...prev])
      } else {
        console.error("Pythonバックエンドへの送信失敗")
      }
      // （必要ならここで 2000ms のディレイを入れる場合）
      // await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("保存中にエラーが発生", error)
    }
    setIsLoading(false) // ローディング終了
  }
  
  const [loading, setLoading] = useState(false);

  // APIを呼び出してJSONをDBに保存
  const handleSaveToDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/import-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("エラー:", error);
      alert("データのインポートに失敗しました");
    }
    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">レシートスキャン</h1>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>スキャンのコツ</AlertTitle>
          <AlertDescription>
            レシート全体が写るように撮影してください。明るい場所での撮影をおすすめします。
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                カメラでスキャン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full h-40 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600">
                <Camera className="h-8 w-8 mb-2" />
                <span>カメラを起動</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                画像をアップロード
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  ドラッグ＆ドロップ、またはクリックしてアップロード
                </p>
              </div>
              {/* 隠しファイル入力 */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
              />
            </CardContent>
          </Card>
        </div>

        {/* アップロードした画像のプレビューと保存ボタン */}
        {previewUrl && (
          <Card className="mb-8">
          <CardHeader>
            <CardTitle>アップロードした画像のプレビュー</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="アップロード画像"
              className="max-w-full h-auto mb-4"
            />
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-500 text-white rounded-md py-7 px-8 text-lg font-bold"
            >
              {isLoading ? "処理中..." : "画像を保存して処理を実行"}
            </Button>
          </CardContent>
        </Card>
        )}

        {/* スキャン履歴 */}
        <button
          onClick={handleSaveToDatabase}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "保存中..." : "保存してパーソナライズ"}
        </button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              スキャン履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">まだスキャン履歴はありません</p>
              ) : (
                scanHistory.map((entry, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-md shadow">
                  <p className="font-bold mb-2">
                    買い物一覧({new Date().toLocaleDateString("ja-JP")})
                  </p>
                  <pre className="text-sm text-blue-600 font-semibold tracking-wide whitespace-pre-wrap">
                    {Array.isArray(entry.ocr_result)
                      ? entry.ocr_result.join("\n")
                      : entry.ocr_result}
                  </pre>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// app/receipts/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    // リクエストボディから formData を取得
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 });
    }

    // アップロードされたファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // プロジェクトルート直下の "backend/image" フォルダに保存する
    const uploadDir = path.join(process.cwd(), "backend/image");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // TS 側で決定した画像ファイルの名称を利用（例：アップロードされたファイル名）
    const tempPath = path.join(uploadDir, file.name);
    fs.writeFileSync(tempPath, buffer);

    // プロジェクトルートにある Python スクリプト（例: recommend.py）のパスを生成
    const scriptPath = path.join(process.cwd(), "backend/recommend.py");

    // Python スクリプトを実行し、画像ファイルのパスを引数として渡す
    return new Promise((resolve) => {
      exec(`python ${scriptPath} "${tempPath}"`, { encoding: "utf8" }, (error, stdout, stderr) => {
        console.log("stdout:", stdout);

        // 使用後、一時ファイル（画像）を削除（不要ならこの処理はコメントアウト）
        fs.unlink(tempPath, (err) => {
          if (err) console.error("一時ファイル削除エラー:", err);
        });

        if (error) {
          console.error("Python 実行エラー:", error);
          return resolve(
            NextResponse.json({ error: "画像処理中にエラーが発生しました" }, { status: 500 })
          );
        }

        try {
          // Python の標準出力（stdout）を JSON としてパース
          const resultJson = JSON.parse(stdout);

          // 画像ファイル名から拡張子を取り除き、JSON ファイル名を生成
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const jsonFilePath = path.join(uploadDir, baseName + ".json");

          // JSON を整形して新たなファイルに保存（UTF-8 エンコーディング）
          fs.writeFileSync(jsonFilePath, JSON.stringify(resultJson, null, 2), "utf8");

          // Python の出力結果（JSON オブジェクト）を API レスポンスとして返す
          resolve(NextResponse.json(resultJson));
        } catch (jsonError) {
          console.error("JSON parse エラー:", jsonError);
          resolve(
            NextResponse.json({ error: "Python の出力が正しい JSON ではありません" }, { status: 500 })
          );
        }
      });
    });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

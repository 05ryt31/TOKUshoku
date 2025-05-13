// app/api/import-json/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // `backend/image/` ディレクトリ内の JSON ファイルを取得
    const dirPath = path.join(process.cwd(), 'backend', 'image');
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
      return NextResponse.json({ error: 'JSONファイルが見つかりません' }, { status: 404 });
    }

    let savedItems = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const scanData = JSON.parse(fileData);
    
      if (!scanData || typeof scanData !== 'object') {
        console.warn(`無効な JSON データをスキップ: ${file}`);
        continue;
      }
    
      // ファイル名（拡張子除く）を id として利用
      const jsonId = path.basename(file, '.json');
    
      // すでに同じ id (jsonId) のデータが存在するか確認
      const existingItem = await prisma.item.findUnique({
        where: { id: jsonId },
      });
    
      if (existingItem) {
        console.warn(`ID "${jsonId}" が既に存在するため、ファイル "${file}" はスキップします。`);
        continue;
      }
    
      // JSONデータを `name` フィールドに保存（id は jsonId を利用）
      const savedItem = await prisma.item.create({
        data: {
          id: jsonId, // 数値ではなく JSON のファイル名を ID として設定
          name: JSON.stringify(scanData),
        },
      });
    
      savedItems.push(savedItem);
    }
    


    // Item テーブルのデータを取得
    const allItems = await prisma.item.findMany();

    // Product の `id` と `name` を取得
    const allProducts = await prisma.product.findMany({
      select: { id: true, name: true }, // `id` と `name` のみ取得
    });

    // `products.json` を作成 (Python スクリプト用)
    const productsPath = path.join(process.cwd(), 'backend', 'products.json');
    const combinedData = { products: allProducts, items: allItems };
    fs.writeFileSync(productsPath, JSON.stringify(combinedData, null, 2), 'utf-8');

    console.log("📦 Product テーブルのデータを Python に送信:");
    allProducts.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}`);
    });

    // Python スクリプトを実行
    const scriptPath = path.join(process.cwd(), 'backend', 'sort.py');
    const pythonProcess = spawn('python', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`🐍 Python 出力: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`🐍 Python エラー: ${data}`);
    });

    return NextResponse.json({
      message: '商品がパーソナライズされました',
      savedItems,
    }, { status: 200 });

  } catch (error) {
    console.error('データのインポートエラー:', error);
    return NextResponse.json({ error: 'データのインポートに失敗しました' }, { status: 500 });
  }
}

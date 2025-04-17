# backend/sort.py
import json
import sys
from difflib import SequenceMatcher

def calculate_similarity(product_name, ocr_items):
    """
    product_name と OCR 結果のリスト ocr_items の中で、
    一番高い類似度を返す。
    """
    max_similarity = 0.0
    for ocr in ocr_items:
        similarity = SequenceMatcher(None, product_name, ocr).ratio()
        if similarity > max_similarity:
            max_similarity = similarity
    return max_similarity

def sort_items_by_similarity(sell_items, ocr_items):
    """
    sell_items 内の各商品の名前と OCR 結果リスト ocr_items との類似度を計算し、
    類似度の高い順に並び替えた結果を返す。
    """
    for item in sell_items:
        # 各 sell_item の名前と OCR 結果のリストとの最大類似度を計算
        item["similarity"] = calculate_similarity(item["name"], ocr_items)
    # 類似度が高い順に並び替え
    sorted_items = sorted(sell_items, key=lambda x: x["similarity"], reverse=True)
    # 不要な similarity キーは除いた上で返す
    return [{"id": item["id"], "name": item["name"]} for item in sorted_items]

# 例: products.json の内容を読み込み、sell_items と OCR 結果の抽出例
def print_product_data():
    """products.json を読み込んでコンソールに出力"""
    try:
        with open("backend/products.json", "r", encoding="utf-8") as f:
            data = json.load(f)  # `products.json` をロード

        # Windows の場合、コンソール出力のエンコーディング設定を変更
        sys.stdout.reconfigure(encoding="utf-8")

        print("📦 Python: 受け取ったデータ")
        
        print("\n✅ Products:")
        for product in data["products"]:
            print(f"ID: {product['id']}, Name: {product['name']}")

        # OCR 結果をまとめたリストを作成
        ocr_items = []
        print("\n✅ Items:")
        for item in data["items"]:
            print(f"ID: {item['id']}, OCR結果:")
            try:
                parsed_name = json.loads(item['name'])
                if "ocr_result" in parsed_name:
                    for ocr in parsed_name["ocr_result"]:
                        ocr_items.append(ocr)  # OCR 結果をリストに追加
                        print(f"  - {ocr}")
                else:
                    print(f"  ⚠️ 'ocr_result' キーが見つかりません: {parsed_name}")
            except json.JSONDecodeError:
                print(f"  ⚠️ JSONデコードエラー: {item['name']}")
        
        # 例として、products.json 内の products を売り商品と見なし、並び替えを実施
        sorted_products = sort_items_by_similarity(data["products"], ocr_items)
        print("\n✅ 類似度で並び替えた売り商品:")
        for prod in sorted_products:
            print(f"ID: {prod['id']}, Name: {prod['name']}")

         # 並び替えた結果を sort.json として保存
        with open("backend/sort.json", "w", encoding="utf-8") as outfile:
            json.dump(sorted_products, outfile, ensure_ascii=False, indent=4)
        print("\n✅ sort.json に保存しました。")
        
    except FileNotFoundError:
        print("❌ products.json が見つかりません")

if __name__ == "__main__":
    print_product_data()

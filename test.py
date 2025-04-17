import sys
from PIL import Image
print("画像情報を表示します")
if __name__ == "__main__":
    print("画像情報を表示します")
    if len(sys.argv) < 2:
        print("Usage: python test.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        with Image.open(image_path) as img:
            print(f"画像パス: {image_path}")
            print(f"フォーマット: {img.format}")
            print(f"サイズ: {img.size}")      # (width, height)
            print(f"モード: {img.mode}")
    except Exception as e:
        print("画像の読み込みに失敗しました:", e)

# Hackathon・食品ロス削減プラットフォーム

このプロジェクトは、**食品ロス削減を目的とした**  
『廃棄される寸前の商品を消費者が見つけられる』プラットフォームウェブサイトのファイルです。

## 🚀 利用方法

### 1. 消費者として登録する場合  
- 複数の機能を利用して商品を見つけられます：  
  - 🗺 **マップ機能**：自分の周辺のお店を探せます。  
  - ⭐ **おすすめ機能**：レシート（写真を撮る or アップロード）をもとに、システムが自動でおすすめ商品を表示します。  
  - 📋 **一覧機能**：すべての商品を順番に閲覧できます。  
- 気になる商品を選んで **予約** し、お店へ行って現地で支払いを行います。

### 2. お店として登録する場合  
- 廃棄寸前の商品を把握し、以下の情報を投稿します：  
  - **住所**  
  - **商品の写真**  
  - **回収時間**  
  - **価格**  
- 予約が入るのを待ち、回収に来た消費者に **現地会計** で対応します。


## How to set up? (Frontend)

### Step 1

### Node.js のインストール

Link: https://nodejs.org/ja/

---

### Step 2

インストールされているかの確認として、CLI で以下のコマンドを実行

```
node -v
```

`v22.xx.x`と表示されれば OK

また、npm のバージョンを確認する場合は、以下のコマンドを実行

```
npm --version
```

---

### Step 3

### npm のインストール

npm とは Node Package Manager の略  
npm のインストール

```
sudo npm install -g npm
```

windows

```
npm install -g npm
```

npm も`npm -v`でインストールができているか確認できる。

---

### Step 4

### local サーバーの立ち上げ

food-waste-reduction ディレクトリで次のコマンドを実行

```
npm run dev
```

立ち上げに成功すれば、localhost:3000 と表示されるので  
command を押しながらクリックするとブラウザに飛べたら完了


必要に応じて
```
npm install -D @tailwindcss/postcss
```

## How to use Database?

### Step 0

postgresqlのインストール
ここでパスワードの設定　(1)

sql shell(Windows)でデータベース作成
```
psql -U postgres

CREATE DATABASE mydatabase;
```

mydatabase (2)

.env 
DATABASE_URL="postgresql://postgres:<パスワード (1)>@localhost:5432/<mydatabase (2)>?schema=public"

### Step 1

### prismaパッケージのインストール

```
npm install prisma --save-dev
```

### Step 2

ディレクトリーの確認（prisma）

### マイグレーションの実行

以下のコマンドを実行、（新しくテーブル定義を追加、または変更した場合は変更内容を簡潔に書く）
```
npx prisma migrate dev --name <変更した内容>
```

### Step 3

### prisma generateの実行
#### What is it?

(1)Prismaクライアントの生成  
(2)TypeScriptの型情報の生成

を行なっている。
以下コマンドを実行
```
npx prisma generate
```

### Step 4

### prisma studioの立ち上げ

```
npx prisma studio
```
localhostが立ち上げられ、DBにアクセスできれば完了

## How to set up? (Backend)

## 🛠 動作確認

- Python 3.11.7

## 🚀 インストール

以下のコマンドを実行して、必要なパッケージをインストールしてください。

```sh
pip install requests rapidfuzz openai python-dotenv
```

## 📌 使い方 (Usage)

### 1. API キーの設定

このスクリプトは Azure OpenAI(OpenAI),Azure Computer Vision、GoogleMap を使用するため、　エンドポイントとAPIキー　を環境変数として設定するか、スクリプト内に直接記述する必要があります。

#### .env 環境変数として設定する場合:

```sh
#Azure Computer Vision用
OCR_SUBSCRIPTION_KEY="XXXX"
OCR_ENDPOINT="XXX.com"

# Azure OpenAI 用
OPENAI_ENDPOINT="YYY.com"
OPENAI_SUBSCRIPTION_KEY="YYYY"

#Google Map用
GOOGLEMAP_API_KEY="ZZZZZ"
```

## How to set up? (GoogleMap)
```sh
npm install @react-google-maps/api
```



# TOKUshoku MVP 詳細設計資料

## 📋 プロジェクト概要

**TOKUshoku**は、余剰食品を割引販売することで食品ロス削減と店舗・消費者双方のメリットを創出するプラットフォームです。

### MVPの焦点
- 店舗受け取り前提の割引商品注文フロー
- シンプルなアカウント管理 & 商品管理
- 決済や配達は非対応（現金や店舗独自決済に委任）

## 🎯 コア機能

```mermaid
graph TD
    A[TOKUshoku MVP] --> B[消費者向け機能]
    A --> C[店舗向け機能]
    A --> D[管理者向け機能]
    
    B --> B1[アカウント管理]
    B --> B2[商品検索・閲覧]
    B --> B3[注文予約機能]
    
    C --> C1[店舗アカウント管理]
    C --> C2[商品管理]
    C --> C3[注文管理]
    
    D --> D1[ユーザー管理]
    D --> D2[店舗管理]
    D --> D3[システム監視]
    
    B1 --> B1a[ユーザー登録・ログイン]
    B1 --> B1b[プロフィール編集]
    
    B2 --> B2a[割引商品一覧表示]
    B2 --> B2b[商品詳細閲覧]
    
    B3 --> B3a[店舗受け取り注文]
    B3 --> B3b[注文履歴確認]
    
    C1 --> C1a[店舗登録・ログイン]
    C1 --> C1b[店舗プロフィール編集]
    
    C2 --> C2a[商品登録]
    C2 --> C2b[商品情報編集・削除]
    
    C3 --> C3a[受注リスト確認]
    C3 --> C3b[注文承認・キャンセル]
    
    D1 --> D1a[ユーザー一覧閲覧]
    D1 --> D1b[アカウント凍結・削除]
    
    D2 --> D2a[店舗一覧閲覧]
    D2 --> D2b[店舗凍結・削除]
    
    D3 --> D3a[エラーログ確認]
    D3 --> D3b[注文数基礎統計]
```

### 消費者向けコア機能

| 機能 | 詳細 |
|------|------|
| **アカウント管理** | ・ユーザー登録、ログイン<br>・プロフィール編集（名前、住所、連絡先など） |
| **商品検索・閲覧** | ・割引商品（余剰食品）の一覧表示<br>・商品詳細（画像、価格、在庫、賞味期限）の閲覧 |
| **注文（予約）機能** | ・店舗受け取り型の注文作成<br>・注文履歴の確認（注文ステータスや受取状況） |

### 店舗向けコア機能

| 機能 | 詳細 |
|------|------|
| **店舗アカウント管理** | ・店舗登録、ログイン<br>・店舗プロフィール編集（住所、営業時間、連絡先） |
| **商品管理** | ・商品登録（通常商品 & 割引商品）<br>・商品情報の編集・削除 |
| **注文管理** | ・受注リストの確認<br>・注文の承認・キャンセル |

### 管理者向けコア機能

| 機能 | 詳細 |
|------|------|
| **ユーザー管理** | ・ユーザー一覧の閲覧<br>・アカウントの凍結・削除 |
| **店舗管理** | ・店舗の一覧閲覧<br>・店舗アカウントの凍結・削除 |
| **システム監視** | ・エラーログ閲覧<br>・注文数の基礎統計確認 |

> **注意**: MVPでは「実際に割引商品を出品でき、消費者が注文して店舗受け取りできる仕組み」が稼働していればOKとし、配達や高度なレポート機能などは後回しとします。

## 👤 ユーザーペルソナ

```mermaid
graph LR
    subgraph 消費者_山田花子[一般消費者: 山田花子 28歳]
        H1[節約志向]
        H2[環境問題に関心]
        H3[スマホアプリ活用]
    end
    
    subgraph 店舗_鈴木太郎[店舗オーナー: 鈴木太郎 45歳]
        O1[食品廃棄コスト削減]
        O2[新規顧客獲得]
        O3[業務効率化]
    end
    
    subgraph 管理者_田中一郎[管理者: 田中一郎]
        A1[システム稼働管理]
        A2[不正利用チェック]
        A3[サービス品質維持]
    end
```

### 一般消費者（山田花子）

**属性**: 28歳・会社員

**行動パターン・モチベーション**:
- 節約志向が高く、日々の買い物でお得に購入したい
- 環境問題・SDGsに関心があり、食品ロス削減に興味
- スマホアプリやWEBサービスを日常的に活用

**ペインポイント**:
- 割引商品は店頭に行かないと見つけにくい
- 安い商品の在庫や賞味期限が気になる

**ゴール**:
- 割引食品を気軽に予約し、店舗で受け取りたい
- 生活圏内でどの店舗が余剰食品を出しているか把握したい

### 店舗オーナー（鈴木太郎）

**属性**: 45歳・個人経営のカフェオーナー

**行動パターン・モチベーション**:
- 食品廃棄コストを削減したい
- 新規顧客獲得と売上最大化を目指す
- 在庫管理やメニュー更新の工数削減を望む

**ペインポイント**:
- 廃棄予定の食品を無駄にしたくない
- 在庫調整や割引販売の管理を効率化したい

**ゴール**:
- 廃棄コスト削減と売上アップの両立
- 簡単なUIでの商品登録・在庫管理

### 管理者（田中一郎）

**属性**: TOKUshokuのサービス管理者

**行動パターン・モチベーション**:
- システム全体の正常稼働維持
- 不正利用チェックとサービス品質維持

**ペインポイント**:
- 急増するユーザーへの対応と不正ユーザー管理
- トラブル・バグの迅速な発見と対処

**ゴール**:
- スムーズなユーザー体験の確保
- サービス全体の安定稼働と信頼性向上

## 📱 ユースケースとフロー

### 一般消費者（山田花子）のユースケース

```mermaid
sequenceDiagram
    actor 花子 as 山田花子
    participant App as TOKUshokuアプリ
    participant Server as サーバー
    participant Store as 店舗(鈴木太郎)
    
    花子->>App: アプリを開く
    App->>Server: 近隣の割引商品リクエスト
    Server-->>App: 商品リスト返却
    花子->>App: 商品を検索・閲覧
    花子->>App: 商品詳細確認
    花子->>App: 「今すぐ予約」ボタンタップ
    App->>Server: 予約リクエスト送信
    Server-->>Store: 注文通知
    Store-->>Server: 注文承認
    Server-->>App: 予約確定通知
    花子->>Store: 店舗訪問・予約番号提示
    Store->>花子: 商品引き渡し・決済
    Store->>Server: 注文完了報告
    Server-->>App: 注文ステータス更新（COMPLETED）
```

#### ユースケース: 割引食品の注文 → 店舗受け取り

1. **トップページ閲覧**
   - 花子はアプリを開き、トップページの割引商品一覧を確認
   - 近所の店舗の余剰食品を把握

2. **商品検索**
   - カテゴリ/キーワード検索、または現在地周辺の店舗表示
   - 気になる商品詳細をタップ

3. **商品詳細確認**
   - 画像、賞味期限、割引価格、受け取り可能時間を確認
   - 「今すぐ予約」ボタンを押す

4. **予約手続き**
   - 受け取り方法は「店舗受け取り」のみ（MVP段階）
   - 決済は店舗で現金支払い
   - 予約確定後、注文ステータスは「PENDING」に

5. **店舗受け取り**
   - 指定時間までに店舗へ行き、予約番号を提示
   - 現金精算後、商品受け取り
   - 注文ステータスが「COMPLETED」に更新

### 店舗オーナー（鈴木太郎）のユースケース

```mermaid
sequenceDiagram
    actor 太郎 as 鈴木太郎
    participant Web as 管理画面
    participant Server as サーバー
    participant Customer as 消費者(山田花子)
    
    太郎->>Web: ログイン
    太郎->>Web: 商品追加ボタンクリック
    太郎->>Web: 商品情報入力・画像アップロード
    Web->>Server: 商品情報保存
    Server-->>Web: 登録完了通知
    
    Customer->>Server: 注文リクエスト
    Server-->>Web: 新規注文通知
    太郎->>Web: 注文管理画面確認
    太郎->>Web: 注文承認（CONFIRMED）
    Web->>Server: ステータス更新
    
    Customer->>太郎: 店舗訪問・予約番号提示
    太郎->>Customer: 商品引き渡し・決済
    太郎->>Web: 受け渡し完了処理
    Web->>Server: ステータス更新（COMPLETED）
```

#### ユースケース: 余剰食品の割引登録 → 注文管理

1. **ログイン**
   - 太郎は店舗用アカウントで管理画面にログイン
   - ダッシュボードが表示される

2. **商品追加**
   - 「商品追加」ボタンを押し、商品情報を入力
   - 画像をアップロードし、登録完了

3. **注文管理画面の確認**
   - 新規注文は「PENDING」として表示
   - 詳細確認後、「CONFIRMED」にステータス更新

4. **受け取り処理**
   - ユーザーが店舗訪問し、予約番号を提示
   - 商品引き渡し、現金受領
   - 「COMPLETED」へステータス変更

### 管理者（田中一郎）のユースケース

```mermaid
sequenceDiagram
    actor 一郎 as 田中一郎
    participant Admin as 管理者画面
    participant Server as サーバー
    participant DB as データベース
    
    一郎->>Admin: 管理者ログイン
    Admin->>Server: ダッシュボードデータリクエスト
    Server->>DB: ユーザー/店舗/注文データ取得
    DB-->>Server: データ返却
    Server-->>Admin: ダッシュボード表示
    
    一郎->>Admin: ユーザー一覧確認
    一郎->>Admin: 不審アカウント確認・凍結処理
    Admin->>Server: アカウント凍結リクエスト
    Server->>DB: アカウントステータス更新
    
    一郎->>Admin: エラーログ・統計確認
    Admin->>Server: ログデータリクエスト
    Server-->>Admin: ログデータ表示
```

#### ユースケース: 不正対策と基本的なシステム監視

1. **管理者ダッシュボード閲覧**
   - 一郎は管理者アカウントでログイン
   - ダッシュボードでユーザー・店舗・注文状況を確認

2. **ユーザー管理**
   - 新規登録アカウントを確認
   - 不審アカウントは凍結処理

3. **ログ監視**
   - エラーログや注文数をグラフ・リスト形式で確認
   - 重大エラーは開発チームへ連絡

## 🔄 全体フロー

```mermaid
graph LR
    subgraph 消費者_花子[消費者: 山田花子]
        C1[商品検索]-->C2[注文予約]
        C2-->C4[店舗受け取り]
    end
    
    subgraph 店舗_太郎[店舗: 鈴木太郎]
        S1[商品登録]-->S2[注文承認]
        S2-->S3[来店対応]
    end
    
    subgraph 管理者_一郎[管理者: 田中一郎]
        A1[システム監視]
        A2[ユーザー/店舗管理]
        A3[不正アカウント処理]
    end
    
    C2-->S2
    S3-->C4
    A2-->C1
    A2-->S1
```

## 📅 スケジュール目安

| **フェーズ** | **期間** | **内容** |
|------------|---------|---------|
| 要件定義／設計 | 1〜2週間 | コア機能・データベース設計、UIモック作成 |
| 開発 | 4〜6週間 | フロント・バックエンド実装、単体テスト |
| テスト | 2週間 | 統合テスト、リグレッションテスト |
| リリース準備 | 1週間 | ステージング検証、本番リリース手順確認 |
| 運用開始 | 継続 | ユーザーフィードバック取得、改善サイクル実施 |

```mermaid
gantt
    title TOKUshoku MVP開発スケジュール
    dateFormat  YYYY-MM-DD
    section 要件・設計
    要件定義/設計         :a1, 2025-04-01, 14d
    section 開発
    フロントエンド開発     :a2, after a1, 28d
    バックエンド開発      :a3, after a1, 28d
    section テスト
    統合テスト          :a4, after a2, 14d
    section リリース
    リリース準備         :a5, after a4, 7d
    MVPローンチ         :milestone, after a5, 0d
    section 運用
    フィードバック収集     :a6, after a5, 30d
    機能改善           :a7, after a6, 30d
```

## 📊 データモデル概要図

```mermaid
erDiagram
    USER {
        int user_id PK
        string name
        string email
        string password
        string phone
        string address
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    STORE {
        int store_id PK
        string name
        string email
        string password
        string phone
        string address
        string business_hours
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    PRODUCT {
        int product_id PK
        int store_id FK
        string name
        string description
        decimal original_price
        decimal discount_price
        int stock
        datetime expiry_date
        string image_url
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    ORDER {
        int order_id PK
        int user_id FK
        int store_id FK
        datetime order_date
        string status
        datetime pickup_time
        decimal total_amount
        datetime created_at
        datetime updated_at
    }
    
    ORDER_ITEM {
        int order_item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
        datetime created_at
    }
    
    USER ||--o{ ORDER : places
    STORE ||--o{ PRODUCT : sells
    STORE ||--o{ ORDER : receives
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : included_in
```

## 🎯 MVPの達成条件

1. **消費者が**:
   - 割引商品を検索・閲覧できる
   - 予約注文を行い、店舗で受け取れる
   - 注文履歴を確認できる

2. **店舗が**:
   - 商品の登録・編集ができる
   - 注文を承認・管理できる
   - 受け取り完了処理ができる

3. **管理者が**:
   - アカウント管理を行える
   - 最低限のログ監視ができる

## 📌 まとめ

TOKUshoku MVPは、**食品ロス削減**という社会課題と**店舗経営効率化**、**消費者の節約ニーズ**を同時に満たすプラットフォームです。

MVPフェーズでは「**割引商品を出品し、予約して店舗受け取りする**」というコアフローを確実に実装し、食品ロス削減の第一歩を踏み出します。

今後の拡張機能（配送、高度な分析機能、ポイントシステムなど）はユーザーフィードバックを元に優先順位を決定して段階的に追加していきます。
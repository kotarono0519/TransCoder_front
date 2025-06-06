# TransCoder - コード翻訳ツール

開発者が学習目的でプログラミング言語間のコードを翻訳するための最小限のWebアプリケーションです。

## 特徴

- **2ペインレイアウト**: 横並びのコードエディタとビューア（レスポンシブデザイン）
- **Monaco Editor**: テーマをサポートするシンタックスハイライト
- **複数言語対応**: JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Rubyをサポート
- **自動検出**: ソース言語を自動で検出可能
- **コピー機能**: 翻訳されたコードを簡単にコピー
- **キーボードショートカット**: Cmd/Ctrl + Enterで素早く変換
- **トースト通知**: エラーや成功のフィードバック
- **ダークモード**: 全体を通したプロフェッショナルなダークテーマ

## 技術スタック

- **フレームワーク**: Nuxt 3 (Vue 3 `<script setup>`)
- **スタイリング**: Tailwind CSS
- **コードエディタ**: Monaco Editor
- **パッケージマネージャー**: npm/pnpm
- **テスト**: Vitest + Vue Test Utils

## クイックスタート

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envを編集してGemini APIキーを追加

# 開発サーバーを起動
npm run dev

# テストを実行
npm test

# 本番用にビルド
npm run build
```

アプリは `http://localhost:3000` で利用可能になります。

## セットアップ

1. **APIキーの取得**: [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセスして無料のAPIキーを取得します。
2. **環境変数の設定**: `.env`ファイルを作成し、APIキーを追加します:
   ```
   PALM_API_KEY=your_actual_api_key_here
   ```

## プロジェクト構成

```
├── components/           # Vueコンポーネント
│   ├── CodeEditor.vue   # Monacoベースのコードエディタ
│   ├── CodeViewer.vue   # 読み取り専用のコードビューア
│   └── LanguageSelect.vue # 言語選択ドロップダウン
├── composables/         # Vueコンポーザブル
│   └── useConvert.ts    # API連携ロジック
├── types/              # TypeScriptの型定義
│   └── index.ts        # 共通の型と定数
├── tests/              # ユニットテスト
├── plugins/            # Nuxtプラグイン
└── app.vue             # メインアプリケーションレイアウト
```

## API連携

このアプリは、`http://localhost:8000/convert` にあるバックエンドAPIが以下のインターフェースを持つことを想定しています:

**リクエスト:**
```json
{
  "source_language": "javascript",
  "target_language": "python", 
  "code": "console.log('Hello World')"
}
```

**レスポンス:**
```json
{
  "translated_code": "print('Hello World')"
}
```

## 使い方

1. 変換元の言語を選択します（または「自動検出」を使用）
2. 変換先の言語を選択します
3. 左のエディタにコードを記述または貼り付けます
4. 「変換」ボタンを押すか、Cmd/Ctrl + Enterを使用します
5. 右のパネルで翻訳されたコードを表示します
6. 「コピー」ボタンを使って結果をコピーします

## 開発

このアプリケーションは、TypeScriptを使用したVue 3のComposition APIパターンに従っています。コンポーネントは最小限で、特定の機能に焦点を当てて設計されています。`useConvert`コンポーザブルは、適切なエラーハンドリングとローディング状態で全てのAPI通信を処理します。

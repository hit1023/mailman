# mailman

[Resend](https://resend.com) を使ったシンプルなメール送信 REST API。  
Hono + OpenAPI で構築され、Docker で動作する。

## 機能

- `POST /send` — メール送信（HTML / テキスト対応、複数宛先可）
- `GET /settings` — 環境設定WebUI（Basic認証必須）
- `GET /health` — ヘルスチェック
- `GET /docs` — Scalar による API ドキュメント UI
- `GET /openapi.json` — OpenAPI 3.0 スペック

## 構成

```
src/
├── index.js          # エントリーポイント・ルート登録
├── lib/
│   └── envFile.js     # .env の読み書き
└── routes/
    ├── send.js         # POST /send
    ├── settingsPage.js # GET/POST /settings のHTML
    └── health.js       # GET /health
```

## 環境変数

`.env.example` をコピーして `.env` を作成する。

| 変数名 | 必須 | 説明 |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Resend の API キー |
| `DEFAULT_FROM` | — | 送信元アドレス（省略時: `noreply@yahoi.jp`）|
| `ADMIN_PASSWORD` | ✅ | `/settings` のBasic認証パスワード（ユーザー名は`admin`固定）|

## 起動

```bash
cp .env.example .env
# .env を編集して RESEND_API_KEY を設定

docker compose up -d
```

ポート `8765` で起動する。

## API

### POST /send

```json
{
  "to": "user@example.com",       // string or string[]
  "subject": "お知らせ",
  "html": "<p>本文</p>",          // html か text のどちらか（両方可）
  "text": "本文",
  "from": "noreply@yahoi.jp"      // 省略時は DEFAULT_FROM
}
```

**レスポンス (200)**

```json
{ "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

詳細は `http://localhost:8765/docs` を参照。

## 環境設定WebUI (`/settings`)

`.env` の値をブラウザから閲覧・編集できる。`admin` / `ADMIN_PASSWORD` のBasic認証で保護されている。

保存すると `.env` ファイルが書き換わるだけで、コンテナは自動再起動しない。反映するには
`docker compose restart`（または `run.sh` の「更新 & 再起動」）を実行する。

## 開発

```bash
npm install
npm run dev   # --watch モードで起動
```

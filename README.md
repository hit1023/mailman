# mailman

[Resend](https://resend.com) を使ったシンプルなメール送信 REST API。
Hono + OpenAPI で構築され、Docker で動作する。

## 目次

- [概要](#概要)
- [設計方針](#設計方針)
- [画面・エンドポイント一覧](#画面エンドポイント一覧)
- [ディレクトリ構成](#ディレクトリ構成)
- [環境変数](#環境変数)
- [ローカル開発](#ローカル開発)
- [Dockerでの起動](#dockerでの起動)
- [本番デプロイ (h-1)](#本番デプロイ-h-1)
- [API仕様](#api仕様)
- [環境設定WebUI (`/settings`)](#環境設定webui-settings)
- [テスト送信ページ (`/test`)](#テスト送信ページ-test)
- [Resend側のドメイン検証について](#resend側のドメイン検証について)
- [トラブルシューティング](#トラブルシューティング)

## 概要

社内・個人プロジェクトから「メールを1通送りたいだけ」というときに、Resendの複雑なSDK設定や
アカウント管理を各プロジェクトに持たせず、共通のシンプルなHTTP APIを1本叩けば済むようにする
ための小さなマイクロサービス。POST 1本でメール送信が完結する。

同じ設計思想で作られたWeb Push版が [pushman](https://github.com/hit1023/pushman)。
両者は見た目・構成（Hono + OpenAPI + Docker + `/settings` + `/test` + タブナビゲーション）を
意図的に揃えてある。

## 設計方針

- **薄いラッパーに徹する**: Resendの`emails.send`をほぼそのままHTTPで公開しているだけ。
  リトライ・キューイング・テンプレート機能などは持たない。必要になったら呼び出し側で実装する。
- **状態を持たない**: 送信先リストや送信履歴をDBに保存しない。呼び出し側が必要な情報を
  毎回リクエストボディに含める。
- **設定は`.env`一本**: 秘密情報（APIキー等）は環境変数のみで管理し、コードにハードコードしない。
- **`/settings`は書き込み専用の下書き**: ブラウザから`.env`を編集できるが、実行中のプロセスへの
  反映は手動再起動に委ねる（詳細は後述）。自動再起動をコンテナに実装すると`docker.sock`を
  コンテナに渡す必要が生じ、コンテナ侵害時のホストへの影響が大きくなるため、あえて手動運用にしている。

## 画面・エンドポイント一覧

| パス | メソッド | 認証 | 内容 |
|---|---|---|---|
| `/` | GET | なし | ホーム。タブナビゲーションの起点 |
| `/send` | POST | なし | メール送信API本体 |
| `/test` | GET | なし | ブラウザのフォームからテストメールを送信できる画面 |
| `/settings` | GET/POST | Basic認証 | `.env`の値を閲覧・編集する画面 |
| `/health` | GET | なし | ヘルスチェック（`{"status":"ok"}`を返すだけ） |
| `/docs` | GET | なし | APIドキュメント画面（下記`/api-docs`をタブ内にiframe表示） |
| `/api-docs` | GET | なし | [Scalar](https://scalar.com/)によるAPIドキュメントUI本体 |
| `/openapi.json` | GET | なし | OpenAPI 3.0 スペック（`/api-docs`が参照する） |

`/`, `/docs`, `/test`, `/settings` の4画面は上部に共通のタブバーがあり、直接URLを
打たずに行き来できる。`/send`と`/health`はブラウザ画面を持たないAPI/ヘルスチェック用途。

`/docs`が`/api-docs`をiframeで包んでいるのは、Scalar（サードパーティ製UIライブラリ）が
ページ全体を専有してしまい、こちらの共通ナビゲーションを直接埋め込めないための回避策。

## ディレクトリ構成

```
mailman/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── run.sh                    # 対話的なデプロイ管理メニュー(update/restart/logs等)
├── package.json
└── src/
    ├── index.js               # エントリーポイント。全ルートをここに登録
    ├── lib/
    │   ├── envFile.js          # .env ファイルの読み書き（/settings用）
    │   ├── nav.js               # タブナビゲーションのHTML生成
    │   └── theme.js             # 全画面共通のダークテーマCSS
    └── routes/
        ├── send.js              # POST /send のZodスキーマ・OpenAPIルート定義
        ├── health.js            # GET /health のルート定義
        ├── homePage.js          # GET / のHTML
        ├── docsPage.js          # GET /docs のHTML（iframeラッパー）
        ├── settingsPage.js      # GET/POST /settings のHTML・フィールド定義
        └── testPage.js          # GET /test のHTML・クライアント側JS
```

`send.js`と`health.js`は`@hono/zod-openapi`の`createRoute`でスキーマを定義するだけで、
実際のハンドラ（Resend呼び出しなど）は`index.js`側の`app.openapi(...)`に書く構成。

## 環境変数

`.env.example` をコピーして `.env` を作成する。

```bash
cp .env.example .env
```

| 変数名 | 必須 | 説明 |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Resendダッシュボードで発行したAPIキー（`re_`で始まる） |
| `DEFAULT_FROM` | — | `from`省略時に使う送信元アドレス（省略時のデフォルト値: `noreply@yahoi.jp`） |
| `ADMIN_PASSWORD` | ✅ | `/settings`のBasic認証パスワード（ユーザー名は`admin`固定）。未設定だと`/settings`は500を返しアクセス不可になる |
| `PORT` | — | コンテナ内リッスンポート（docker-compose側で`3000`固定。通常変更不要） |

`DEFAULT_FROM`に指定するアドレスのドメインは、Resend側で送信ドメインとして
verified（検証済み）になっている必要がある。詳細は[Resend側のドメイン検証について](#resend側のドメイン検証について)を参照。

## ローカル開発

```bash
npm install
npm run dev   # --watch モードで起動（ファイル変更で自動再起動）
```

`http://localhost:3000` で起動する（`.env`の`PORT`未設定時）。

## Dockerでの起動

```bash
cp .env.example .env
# .env を編集して RESEND_API_KEY / DEFAULT_FROM / ADMIN_PASSWORD を設定

docker compose up -d
```

ホストの`8765`番ポートにマッピングされる（`docker-compose.yml`参照）。

`docker-compose.yml`は`.env`ファイル自体を`/app/.env`としてコンテナにバインドマウントしている。
これは`/settings`画面からの書き込みが、docker-compose自体の変数展開に使われるホスト側`.env`と
同一ファイルになるようにするため（詳細は[環境設定WebUI](#環境設定webui-settings)を参照）。

`run.sh`を使うと更新・再起動・ログ確認などを対話メニューから実行できる:

```bash
./run.sh
```

## 本番デプロイ (h-1)

現在の本番運用は h-1（192.168.0.20）上のDockerコンテナ。

- コンテナ直: `http://192.168.0.20:8765`
- 外部公開URL: `https://mailman.s-quad.com`（gate上のnginx-proxy-managerが`*.s-quad.com`
  ワイルドカード証明書でHTTPS終端し、`192.168.0.20:8765`へリバースプロキシしている）

デプロイ手順（h-1上）:

```bash
cd ~/docker/mailman
git pull
docker compose up -d --build
```

`docker-compose.yml`は`.env`を書き換えない限り毎回同じ設定で再構築されるため、
初回セットアップ以外は上記2行で更新できる。

## API仕様

### POST /send

```json
{
  "to": "user@example.com",
  "subject": "お知らせ",
  "html": "<p>本文</p>",
  "text": "本文",
  "from": "noreply@s-quad.com"
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `to` | `string \| string[]` | ✅ | 宛先メールアドレス。複数指定可 |
| `subject` | `string` | ✅ | 件名 |
| `html` | `string` | — | HTML本文。`text`とどちらか（または両方）指定 |
| `text` | `string` | — | プレーンテキスト本文 |
| `from` | `string` | — | 送信元アドレス。省略時は`DEFAULT_FROM`を使用 |

**レスポンス (200 OK)**

```json
{ "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

`id`はResend側のメッセージID。配送状況の追跡等に使える。

**レスポンス (400 Bad Request)**

```json
{ "error": "エラーメッセージ" }
```

Resend APIキーが無効、宛先ドメインが不正、送信元ドメインが未検証、などの理由で失敗した場合。

curlでの実行例:

```bash
curl -X POST https://mailman.s-quad.com/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "you@example.com",
    "subject": "テスト",
    "text": "こんにちは"
  }'
```

インタラクティブに試したい場合は`/docs`（Scalar UI）からリクエストを組み立てて実行できる。

### GET /health

```json
{ "status": "ok" }
```

死活監視・ロードバランサのヘルスチェック用。認証なし。

## 環境設定WebUI (`/settings`)

`.env`の値をブラウザから閲覧・編集できる管理画面。RESEND_API_KEYなどの機微情報を扱うため、
`admin` / `ADMIN_PASSWORD`のBasic認証で保護されている（`ADMIN_PASSWORD`未設定時は
アクセス自体を500エラーでブロックする）。

**保存の仕組みと注意点**:

1. フォーム送信すると、コンテナ内の`/app/.env`（＝ホストの`.env`とバインドマウントで同一ファイル）
   に新しい値が書き込まれる
2. **しかしNode.jsプロセスの`process.env`はプロセス起動時に一度読み込まれるだけなので、
   ファイルを書き換えても実行中のプロセスには反映されない**
3. 反映するには明示的にコンテナを再作成する必要がある:

```bash
docker compose up -d
# または run.sh の「2. 起動」
```

**`docker compose restart`ではダメ。** Composeの`environment:`にある`${RESEND_API_KEY}`等の
変数展開は`up`実行時にしか評価されないため、`restart`は起動済みコンテナに焼き込まれた古い環境変数の
ままプロセスを再起動するだけになる（pushmanでLINE連携のトークンを設定した際、実際にこの誤りで
反映されず原因調査することになった）。`.env`を変更したときは必ず`up -d`を使うこと。

4. 再起動後は、送信処理本体・`/test`ページの送信元プレースホルダー・`/docs`のAPIサンプル値の
   すべてが新しい`.env`の値（`process.env`経由）を参照するようになる

自動再起動を実装しない理由: コンテナ自身がdocker composeを操作できるようにするには
`docker.sock`をコンテナにマウントする必要があり、そのコンテナが侵害された場合ホスト全体の
Docker環境を操作されるリスクがある。個人運用のツールでそのリスクを取るより、
手動再起動というひと手間を許容する設計にしている。

## テスト送信ページ (`/test`)

入力した宛先・件名・本文でそのまま`POST /send`を叩く、実運用不要のミニマムな検証用フォーム。
認証なし（`/send`自体に認証がないため、`/test`だけ保護しても意味がない）。

「送信元」欄のプレースホルダーは現在の`DEFAULT_FROM`の値を表示する（`/settings`で変更して
再起動すれば追従する）。空欄のまま送信すると`DEFAULT_FROM`が使われる。

## Resend側のドメイン検証について

`from`（または`DEFAULT_FROM`）に指定したメールアドレスのドメインは、Resendダッシュボードの
「Domains」で追加し、DNS（SPF/DKIM等のTXTレコード）を設定した上で`verified`ステータスに
なっている必要がある。未検証のドメインを`from`に指定すると送信APIがエラーを返す。

検証状況はResend APIから直接確認できる:

```bash
curl -s https://api.resend.com/domains -H "Authorization: Bearer $RESEND_API_KEY"
```

`"status":"verified"`になっていればそのドメインからの送信が可能。

## トラブルシューティング

**`/settings`で保存したのに反映されない**
→ 上述の通り、保存は`.env`ファイルへの書き込みのみ。`docker compose up -d`を実行したか確認する
（`docker compose restart`では反映されない）。

**`/test`や`/docs`のプレースホルダー・サンプルが古い値のまま**
→ これも同上。再起動すればコード側は`process.env.DEFAULT_FROM`を都度読み直すので、
古い値が残ることはない（コード自体にハードコードした値ではない）。

**`POST /send`が400を返す**
→ レスポンスの`error`メッセージを確認する。よくある原因:
  - `RESEND_API_KEY`が無効・期限切れ
  - `from`のドメインがResend側で未検証（[Resend側のドメイン検証について](#resend側のドメイン検証について)参照）
  - `to`のメールアドレス形式が不正

**`/settings`にアクセスすると500が返る**
→ `ADMIN_PASSWORD`が`.env`に設定されていない。設定して再起動する。

**h-1へのデプロイがうまくいかない**
→ `~/docker/mailman`で`git status`を確認し、ローカルの未コミット変更（特に`.env`は
`.gitignore`対象なのでpullでは消えない）がpullを妨げていないか確認する。

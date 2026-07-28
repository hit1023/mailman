import { renderNav, renderBrand } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'
import { FAVICON_LINK } from '../lib/favicon.js'
import { renderLogo } from '../lib/logo.js'

export function renderHomePage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman</title>
${FAVICON_LINK}
<style>${PAGE_STYLE}</style>
</head>
<body>
  ${renderBrand()}
  ${renderNav('/')}

  <div class="hero">
    <div class="logo-hero">${renderLogo('hero')}</div>
    <p class="desc">Resendを使ったシンプルなメール送信API。POST 1本で送信が完結します。</p>
    <span class="badge" id="statusBadge"><span class="dot"></span><span id="statusText">確認中...</span></span>
  </div>

  <div class="cards">
    <div class="card">
      <h3>薄いラッパー</h3>
      <p>Resendの emails.send をほぼそのままHTTPで公開。リトライやテンプレート機能は持たず、必要な分だけ呼び出し側で実装できる。</p>
    </div>
    <div class="card">
      <h3>状態を持たない</h3>
      <p>送信先リストや送信履歴をDBに保存しない。宛先・件名・本文はリクエストのたびに渡すだけ。</p>
    </div>
  </div>

  <h2 class="section">はじめに</h2>
  <ul class="linklist">
    <li><a href="/docs">APIドキュメント<span>エンドポイント仕様・リクエスト例を見る</span></a></li>
    <li><a href="/test">テスト送信<span>フォームからテストメールを送る</span></a></li>
    <li><a href="/settings">環境設定<span>RESEND_API_KEY等を設定する</span></a></li>
  </ul>

<script>
  fetch('/health').then((r) => r.ok ? r.json() : Promise.reject())
    .then(() => {
      const badge = document.getElementById('statusBadge')
      badge.classList.add('up')
      document.getElementById('statusText').textContent = '稼働中'
    })
    .catch(() => {
      const badge = document.getElementById('statusBadge')
      badge.classList.add('down')
      document.getElementById('statusText').textContent = '応答なし'
    })
</script>
</body>
</html>`
}

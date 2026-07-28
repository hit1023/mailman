import { renderNav, NAV_STYLE } from '../lib/nav.js'

export function renderHomePage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; background: #fff; }
  h1 { font-size: 1.3rem; }
  p.desc { color: #555; font-size: 0.9rem; }
  ${NAV_STYLE}
</style>
</head>
<body>
  ${renderNav('/')}
  <h1>Mailman</h1>
  <p class="desc">Resendを使ったメール送信API。上のタブから各ページに移動できます。</p>
</body>
</html>`
}

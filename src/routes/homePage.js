import { renderNav } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'

export function renderHomePage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman</title>
<style>${PAGE_STYLE}</style>
</head>
<body>
  ${renderNav('/')}
  <h1>Mailman</h1>
  <p class="desc">Resendを使ったメール送信API。上のタブから各ページに移動できます。</p>
</body>
</html>`
}

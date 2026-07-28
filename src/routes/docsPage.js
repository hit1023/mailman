import { renderNav } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'

export function renderDocsPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman APIドキュメント</title>
<style>${PAGE_STYLE}</style>
</head>
<body class="wide">
  ${renderNav('/docs')}
  <iframe src="/api-docs" title="API Docs"></iframe>
</body>
</html>`
}

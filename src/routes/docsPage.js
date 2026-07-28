import { renderNav, renderBrand } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'
import { FAVICON_LINK } from '../lib/favicon.js'

export function renderDocsPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman APIドキュメント</title>
${FAVICON_LINK}
<style>${PAGE_STYLE}</style>
</head>
<body class="wide">
  ${renderBrand()}
  ${renderNav('/docs')}
  <iframe src="/api-docs" title="API Docs"></iframe>
</body>
</html>`
}

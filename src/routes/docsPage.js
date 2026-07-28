import { renderNav, NAV_STYLE } from '../lib/nav.js'

export function renderDocsPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman APIドキュメント</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; background: #fff; }
  iframe { width: 100%; height: 80vh; border: 1px solid #ddd; border-radius: 4px; }
  ${NAV_STYLE}
</style>
</head>
<body>
  ${renderNav('/docs')}
  <iframe src="/api-docs" title="API Docs"></iframe>
</body>
</html>`
}

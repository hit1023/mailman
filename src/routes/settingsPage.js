import { renderNav } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'

export const SETTINGS_FIELDS = [
  { key: 'RESEND_API_KEY', label: 'Resend APIキー', type: 'password' },
  { key: 'DEFAULT_FROM', label: 'デフォルト送信元アドレス', type: 'text' },
  { key: 'ADMIN_PASSWORD', label: '管理画面パスワード', type: 'password' },
]

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]))
}

export function renderSettingsPage(values, saved) {
  const fields = SETTINGS_FIELDS.map(
    (f) => `
    <label>
      <span>${f.label}</span>
      <input type="${f.type}" name="${f.key}" value="${escapeHtml(values[f.key])}" autocomplete="off">
    </label>`
  ).join('\n')

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman 設定</title>
<style>${PAGE_STYLE}</style>
</head>
<body>
  ${renderNav('/settings')}
  <h1>Mailman 環境設定</h1>
  ${saved ? '<div class="notice">保存しました。反映するには docker compose restart（またはrun.shの再起動）が必要です。</div>' : ''}
  <div class="warning">変更は .env に書き込まれるだけで、コンテナは自動再起動しません。</div>
  <form method="POST" action="/settings">
    ${fields}
    <button type="submit">保存</button>
  </form>
</body>
</html>`
}

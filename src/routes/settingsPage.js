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
<style>
  body { font-family: -apple-system, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; background: #fff; }
  h1 { font-size: 1.3rem; }
  label { display: block; margin-bottom: 16px; }
  label span { display: block; font-size: 0.85rem; color: #555; margin-bottom: 4px; }
  input { width: 100%; box-sizing: border-box; padding: 8px; font-size: 0.95rem; border: 1px solid #ccc; border-radius: 4px; background: #fff; color: #1a1a1a; }
  button { padding: 8px 20px; font-size: 0.95rem; border: none; border-radius: 4px; background: #2563eb; color: #fff; cursor: pointer; }
  .notice { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; }
  .warning { background: #fffbeb; border: 1px solid #f59e0b; color: #92400e; padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; font-size: 0.85rem; }
</style>
</head>
<body>
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

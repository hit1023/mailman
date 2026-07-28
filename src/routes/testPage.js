import { renderNav, NAV_STYLE } from '../lib/nav.js'

export function renderTestPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman テスト送信</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; background: #fff; }
  h1 { font-size: 1.3rem; }
  p.desc { color: #555; font-size: 0.9rem; }
  label { display: block; margin-bottom: 16px; }
  label span { display: block; font-size: 0.85rem; color: #555; margin-bottom: 4px; }
  input, textarea { width: 100%; box-sizing: border-box; padding: 8px; font-size: 0.95rem; border: 1px solid #ccc; border-radius: 4px; background: #fff; color: #1a1a1a; font-family: inherit; }
  textarea { resize: vertical; min-height: 100px; }
  button { padding: 8px 20px; font-size: 0.95rem; border: none; border-radius: 4px; background: #2563eb; color: #fff; cursor: pointer; }
  button:disabled { background: #9ca3af; cursor: not-allowed; }
  #sendResult { font-size: 0.85rem; margin-top: 16px; white-space: pre-wrap; word-break: break-all; }
  .ok { color: #065f46; }
  .ng { color: #b91c1c; }
  ${NAV_STYLE}
</style>
</head>
<body>
  ${renderNav('/test')}
  <h1>Mailman テスト送信</h1>
  <p class="desc">入力した宛先へテストメールを送信します。</p>

  <form id="sendForm">
    <label><span>宛先</span><input type="email" name="to" placeholder="you@example.com" required></label>
    <label><span>件名</span><input name="subject" value="テストメール" required></label>
    <label><span>本文</span><textarea name="text">Mailmanからのテスト送信です。</textarea></label>
    <label><span>送信元（任意・省略時はDEFAULT_FROM）</span><input type="email" name="from" placeholder="noreply@yahoi.jp"></label>
    <button type="submit">テスト送信</button>
  </form>
  <div id="sendResult"></div>

<script>
  document.getElementById('sendForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const resultEl = document.getElementById('sendResult')
    const formData = new FormData(e.target)
    const payload = {
      to: formData.get('to'),
      subject: formData.get('subject'),
      text: formData.get('text') || undefined,
    }
    const from = formData.get('from')
    if (from) payload.from = from

    resultEl.className = ''
    resultEl.textContent = '送信中...'
    try {
      const res = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      resultEl.className = res.ok ? 'ok' : 'ng'
      resultEl.textContent = (res.ok ? '送信成功: ' : '送信失敗: ') + JSON.stringify(json)
    } catch (err) {
      resultEl.className = 'ng'
      resultEl.textContent = 'エラー: ' + err.message
    }
  })
</script>
</body>
</html>`
}

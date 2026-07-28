import { renderNav, renderBrand } from '../lib/nav.js'
import { PAGE_STYLE } from '../lib/theme.js'
import { FAVICON_LINK } from '../lib/favicon.js'

export function renderTestPage() {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Mailman テスト送信</title>
${FAVICON_LINK}
<style>${PAGE_STYLE}</style>
</head>
<body>
  ${renderBrand()}
  ${renderNav('/test')}
  <h1>Mailman テスト送信</h1>
  <p class="desc">入力した宛先へテストメールを送信します。</p>

  <form id="sendForm">
    <label><span>宛先</span><input type="email" name="to" placeholder="you@example.com" required></label>
    <label><span>件名</span><input name="subject" value="テストメール" required></label>
    <label><span>本文</span><textarea name="text">Mailmanからのテスト送信です。</textarea></label>
    <label><span>送信元（任意・省略時はDEFAULT_FROM）</span><input type="email" name="from" placeholder="${process.env.DEFAULT_FROM ?? 'noreply@yahoi.jp'}"></label>
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

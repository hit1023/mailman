export const NAV_ITEMS = [
  { path: '/', label: 'ホーム' },
  { path: '/docs', label: 'APIドキュメント' },
  { path: '/test', label: 'テスト送信' },
  { path: '/settings', label: '設定' },
]

export function renderNav(activePath) {
  return `<nav class="tabs">
${NAV_ITEMS.map((i) => `  <a href="${i.path}"${i.path === activePath ? ' class="active"' : ''}>${i.label}</a>`).join('\n')}
</nav>`
}

export const NAV_STYLE = `
nav.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid #ddd; }
nav.tabs a { padding: 8px 16px; text-decoration: none; color: #555; font-size: 0.9rem; border-bottom: 2px solid transparent; }
nav.tabs a.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }
nav.tabs a:hover { color: #2563eb; }
`

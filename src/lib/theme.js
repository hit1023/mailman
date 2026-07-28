export const PAGE_STYLE = `
:root {
  --bg: #0a0e14;
  --surface: #12161f;
  --surface-2: #1a2029;
  --border: #262d3a;
  --text: #e5e9f0;
  --text-dim: #8792a6;
  --accent: #6ea8fe;
  --accent-2: #8b7cf6;
  --success-bg: #0f2b1d;
  --success-border: #1f8a52;
  --success-text: #4ade80;
  --warning-bg: #2b2308;
  --warning-border: #a16207;
  --warning-text: #fbbf24;
  --danger-bg: #2b1113;
  --danger-border: #7f1d1d;
  --danger-text: #f87171;
  --radius: 10px;
}

* { box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 640px;
  margin: 48px auto;
  padding: 0 20px 80px;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

body.wide { max-width: 980px; }

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
  background: linear-gradient(135deg, var(--text) 30%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

p.desc { color: var(--text-dim); font-size: 0.92rem; margin: 0 0 28px; }

h2 { font-size: 1.05rem; font-weight: 600; margin: 0 0 4px; color: var(--text); }

hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }

a { color: var(--accent); }

.brand {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 14px;
}
.brand svg { display: block; width: 120px; height: auto; }

.logo-hero svg { display: block; width: 220px; height: auto; margin: 0 auto; }

nav.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
}
nav.tabs a {
  padding: 10px 16px;
  text-decoration: none;
  color: var(--text-dim);
  font-size: 0.88rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
}
nav.tabs a:hover { color: var(--text); }
nav.tabs a.active { color: var(--accent); border-bottom-color: var(--accent); }

label { display: block; margin-bottom: 18px; }
label span { display: block; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 6px; font-weight: 500; }

input, textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 0.92rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  transition: border-color .15s, box-shadow .15s;
}
input::placeholder, textarea::placeholder { color: #4b5566; }
input:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(110, 168, 254, 0.15);
}
textarea { resize: vertical; min-height: 100px; }

button {
  padding: 10px 22px;
  font-size: 0.92rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #0a0e14;
  cursor: pointer;
  transition: transform .1s, box-shadow .15s;
}
button:hover { box-shadow: 0 4px 16px rgba(110, 168, 254, 0.3); transform: translateY(-1px); }
button:active { transform: translateY(0); }
button:disabled { background: #333c4a; color: #6b7484; cursor: not-allowed; box-shadow: none; transform: none; }

.notice, .warning {
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  border: 1px solid;
}
.notice { background: var(--success-bg); border-color: var(--success-border); color: var(--success-text); }
.warning { background: var(--warning-bg); border-color: var(--warning-border); color: var(--warning-text); }

.hero { text-align: center; padding: 8px 0 36px; }
.hero .logo-hero { margin-bottom: 16px; }
.hero p.desc { margin: 0 0 12px; }

.badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-dim); }
.badge .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-dim); }
.badge.up .dot { background: var(--success-text); }
.badge.down .dot { background: var(--danger-text); }

.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 28px 0; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
.card h3 { margin: 0 0 8px; font-size: 1rem; color: var(--text); }
.card p { margin: 0; font-size: 0.85rem; color: var(--text-dim); }

h2.section { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim); margin: 32px 0 12px; font-weight: 600; }

.linklist { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.linklist a { display: block; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; font-size: 0.92rem; transition: border-color .15s, background .15s; }
.linklist a:hover { border-color: var(--accent); background: var(--surface); }
.linklist span { display: block; font-size: 0.8rem; color: var(--text-dim); margin-top: 2px; }

#subscribeStatus, #sendResult {
  font-size: 0.85rem;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  white-space: pre-wrap;
  word-break: break-all;
}
#subscribeStatus:empty, #sendResult:empty { display: none; }
#subscribeStatus.ok, #sendResult.ok { color: var(--success-text); border-color: var(--success-border); background: var(--success-bg); }
#subscribeStatus.ng, #sendResult.ng { color: var(--danger-text); border-color: var(--danger-border); background: var(--danger-bg); }

iframe {
  width: 100%;
  height: 78vh;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
`

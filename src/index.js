import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { basicAuth } from 'hono/basic-auth'
import { sendRoute } from './routes/send.js'
import { healthRoute } from './routes/health.js'
import { readEnvFile, writeEnvFile } from './lib/envFile.js'
import { SETTINGS_FIELDS, renderSettingsPage } from './routes/settingsPage.js'

const app = new OpenAPIHono()

// Routes
app.openapi(healthRoute, (c) => {
  return c.json({ status: 'ok' })
})

app.openapi(sendRoute, async (c) => {
  const { to, subject, html, text, from } = c.req.valid('json')

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: from ?? process.env.DEFAULT_FROM,
    to,
    subject,
    html,
    text,
  })

  if (error) {
    return c.json({ error: error.message }, 400)
  }

  return c.json({ id: data.id }, 200)
})

// 設定ページ（.envの閲覧・編集。RESEND_API_KEY等の機微情報を扱うためBasic認証必須）
app.use('/settings', async (c, next) => {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return c.text('ADMIN_PASSWORD が設定されていません。.env に設定してください。', 500)
  }
  return basicAuth({ username: 'admin', password })(c, next)
})

app.get('/settings', (c) => {
  return c.html(renderSettingsPage(readEnvFile(), c.req.query('saved') === '1'))
})

app.post('/settings', async (c) => {
  const body = await c.req.parseBody()
  const updates = {}
  for (const field of SETTINGS_FIELDS) {
    if (body[field.key] !== undefined) updates[field.key] = body[field.key]
  }
  writeEnvFile(updates)
  return c.redirect('/settings?saved=1')
})

// OpenAPI spec
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Mailman API',
    version: '1.0.0',
    description: 'Resend を使ったメール送信API',
  },
})

// /docs UI
app.get(
  '/docs',
  apiReference({
    spec: { url: '/openapi.json' },
    theme: 'saturn',
  })
)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Mailman API running on port ${port}`)
})

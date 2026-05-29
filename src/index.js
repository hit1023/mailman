import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { sendRoute } from './routes/send.js'
import { healthRoute } from './routes/health.js'

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

const port = process.env.PORT ?? 3000
console.log(`Mailman API running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}

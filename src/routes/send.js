import { createRoute, z } from '@hono/zod-openapi'

const SendBodySchema = z.object({
  to: z
    .union([z.string().email(), z.array(z.string().email())])
    .openapi({ example: 'user@example.com' }),
  subject: z.string().min(1).openapi({ example: 'お知らせ' }),
  html: z.string().optional().openapi({ example: '<p>本文</p>' }),
  text: z.string().optional().openapi({ example: '本文' }),
  from: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'noreply@yahoi.jp', description: '省略時はDEFAULT_FROMを使用' }),
})

const SendResponseSchema = z.object({
  id: z.string().openapi({ example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }),
})

const ErrorSchema = z.object({
  error: z.string(),
})

export const sendRoute = createRoute({
  method: 'post',
  path: '/send',
  summary: 'メール送信',
  request: {
    body: {
      content: { 'application/json': { schema: SendBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SendResponseSchema } },
      description: '送信成功',
    },
    400: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '送信失敗',
    },
  },
})

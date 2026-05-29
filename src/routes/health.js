import { createRoute, z } from '@hono/zod-openapi'

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  summary: 'ヘルスチェック',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ status: z.string() }),
        },
      },
      description: 'OK',
    },
  },
})

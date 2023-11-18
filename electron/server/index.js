import { relative } from 'node:path'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

export default async (mainWindow) => {
  const app = new Hono()

  app.notFound((c) => {
    return c.text('Escrcpy server 404', 404)
  })

  const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

  if (VITE_DEV_SERVER_URL) {
    app.get('/', ctx =>
      ctx.redirect(`${VITE_DEV_SERVER_URL}server/index.html`),
    )
  }
  else {
    app.use(
      '/*',
      serveStatic({
        root: relative('./', process.env.DIST),
        rewriteRequestPath: (path) => {
          return path.replace(/^\//, '/server')
        },
      }),
    )
    app.use(
      '/assets/*',
      serveStatic({
        root: relative('./', `${process.env.DIST}/assets/`),
        rewriteRequestPath: (path) => {
          console.log('path', path)
          return path.replace(/^\/assets/, '/')
        },
      }),
    )
  }

  serve({ fetch: app.fetch, port: 1996 })
}
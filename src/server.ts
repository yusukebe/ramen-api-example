import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'

const app = new Hono()
app.use('*', serveStatic({ root: './' }))

app.fire()

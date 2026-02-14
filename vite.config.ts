import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const MIME: Record<string, string> = {
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-data',
      configureServer(server) {
        const dataDir = path.resolve(process.cwd(), 'data')
        server.middlewares.use('/data', (req, res, next) => {
          if (req.method !== 'GET' || !req.url) return next()
          const relative = req.url.replace(/^\//, '').replace(/^(\.\.(\/|\\))+/g, '')
          const safePath = path.resolve(dataDir, relative)
          const dataResolved = path.resolve(dataDir) + path.sep
          if (!safePath.startsWith(dataResolved)) return next()
          fs.stat(safePath, (err, stat) => {
            if (err || !stat.isFile()) return next()
            const ext = path.extname(safePath)
            res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
            fs.createReadStream(safePath).pipe(res)
          })
        })
      },
    },
  ],
})

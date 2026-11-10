import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { env } from 'node:process'
import { resolve } from 'node:path'

const base = env.GITHUB_ACTIONS ? '/cye/' : '/'

function offlineServiceWorker() {
  let publicDir

  return {
    name: 'cye-offline-service-worker',
    apply: 'build',
    configResolved(config) {
      publicDir = config.publicDir
    },
    generateBundle(_, bundle) {
      const shellFiles = Object.keys(bundle).filter((fileName) =>
        /\.(?:js|css)$/.test(fileName),
      )
      const precacheUrls = [
        base,
        `${base}manifest.webmanifest`,
        `${base}icons/cye.svg`,
        `${base}icons/cye-192.png`,
        `${base}icons/cye-512.png`,
        `${base}icons/apple-touch-icon.png`,
        ...shellFiles.map((fileName) => `${base}${fileName}`),
      ]
      const version = createHash('sha256')
        .update(
          JSON.stringify(
            [
              ...Object.entries(bundle).map(([fileName, output]) => [
                fileName,
                output.type === 'chunk'
                  ? output.code
                  : output.source?.toString() ?? '',
              ]),
              ...precacheUrls
                .filter(
                  (url) =>
                    url !== base &&
                    !shellFiles.includes(url.slice(base.length)),
                )
                .map((url) => [
                  url,
                  readFileSync(resolve(publicDir, url.slice(base.length))),
                ]),
            ].sort(([left], [right]) => left.localeCompare(right)),
          ),
        )
        .digest('hex')
        .slice(0, 12)

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const CACHE_NAME = 'cye-shell-${version}'
const APP_BASE = ${JSON.stringify(base)}
const PRECACHE_URLS = ${JSON.stringify(precacheUrls)}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('cye-shell-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME)
        const cachedPage = await cache.match(request, { ignoreVary: true })
        return (
          cachedPage ||
          cache.match(APP_BASE, { ignoreVary: true }) ||
          Response.error()
        )
      }),
    )
    return
  }

  if (!PRECACHE_URLS.includes(url.pathname)) return

  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(request, { ignoreVary: true }))
      .then((cachedResponse) => cachedResponse || fetch(request)),
  )
})
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), offlineServiceWorker()],
})

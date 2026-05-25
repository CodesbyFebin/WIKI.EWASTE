import fs from 'fs'
import path from 'path'
import { getAllRoutes } from '../lib/wiki/slug-registry'

function makeUrl(route: string) {
  // In production you'd use your canonical host
  const host = process.env.SITE_HOST || 'https://example.com'
  return `${host}${route}`
}

function buildSitemap() {
  const all = getAllRoutes()
  const urls = new Set<string>()
  urls.add('/wiki')
  for (const r of all.articles) urls.add(r)
  for (const r of all.glossary) urls.add(r)
  for (const r of all.entities) urls.add(r)
  for (const r of all.updates) urls.add(r)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Array.from(urls)
    .map((u) => `  <url>\n    <loc>${makeUrl(u)}</loc>\n  </url>`)
    .join('\n')}\n</urlset>`

  const outDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8')

  // write llms files
  fs.writeFileSync(path.join(outDir, 'llms.txt'), '# llms manifest\n', 'utf8')
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), '# llms-full manifest\n', 'utf8')

  console.log('Sitemap and manifests written to public/')
}

buildSitemap()

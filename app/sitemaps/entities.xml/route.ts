import { semanticGraph } from '@/lib/wiki/entity-graph'
import { sitemapResponse, xmlEsc } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  const entities = Object.values(semanticGraph)

  // Entity hub
  const hubEntry = `  <url>
    <loc>${BASE_URL}/wiki/entities</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`

  const entityEntries = entities.map((e) => {
    const loc = `${BASE_URL}/wiki/glossary/${e.id}`
    return `  <url>
    <loc>${xmlEsc(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubEntry}
${entityEntries.join('\n')}
</urlset>`

  return sitemapResponse(xml)
}

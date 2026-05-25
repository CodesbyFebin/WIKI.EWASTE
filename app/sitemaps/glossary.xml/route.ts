import { getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'
import { sitemapResponse, xmlEsc, toLastmod } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function GET() {
  const terms = await getAllArticlesInCategory('glossary')

  // Category hub
  const hubEntry = `  <url>
    <loc>${BASE_URL}/wiki/glossary</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`

  const termEntries = terms.map((t) => {
    const loc = `${BASE_URL}/wiki/glossary/${t.slug}`
    const lastmod = toLastmod(t.metadata.dateUpdated ?? t.metadata.datePublished)
    return `  <url>
    <loc>${xmlEsc(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubEntry}
${termEntries.join('\n')}
</urlset>`

  return sitemapResponse(xml)
}

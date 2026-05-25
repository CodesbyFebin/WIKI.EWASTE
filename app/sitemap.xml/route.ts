import { sitemapResponse } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function GET() {
  const now = new Date().toISOString().slice(0, 10)

  const sitemaps = [
    { loc: `${BASE_URL}/sitemaps/articles.xml`,  lastmod: now },
    { loc: `${BASE_URL}/sitemaps/glossary.xml`,  lastmod: now },
    { loc: `${BASE_URL}/sitemaps/entities.xml`,  lastmod: now },
    { loc: `${BASE_URL}/sitemaps/services.xml`,  lastmod: now },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return sitemapResponse(xml)
}

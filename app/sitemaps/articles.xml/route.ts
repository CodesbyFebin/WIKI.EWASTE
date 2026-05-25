import { getAllArticles } from '@/lib/wiki/mdx-processor'
import { sitemapResponse, xmlEsc, toLastmod, tierPriority, tierChangefreq } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function GET() {
  const articles = await getAllArticles()

  // Exclude pure glossary articles — they get their own sitemap
  const nonGlossary = articles.filter((a) => a.category !== 'glossary')

  const urls = nonGlossary.map((a) => {
    const loc = `${BASE_URL}/wiki/${a.category}/${a.slug}`
    const lastmod = toLastmod(a.metadata.dateUpdated ?? a.metadata.datePublished)
    const priority = tierPriority(a.metadata.tier)
    const changefreq = tierChangefreq(a.metadata.tier)
    return `  <url>
    <loc>${xmlEsc(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return sitemapResponse(xml)
}

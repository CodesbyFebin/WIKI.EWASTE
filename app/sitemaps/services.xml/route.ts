import { sitemapResponse } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'
export const revalidate = 86400

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'
const MAIN_URL = 'https://ewastekochi.com'

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)

  const pages = [
    // Wiki site — high-converting service entry points
    { loc: `${BASE_URL}`,                                          priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/wiki`,                                     priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/services/schedule-pickup`,                 priority: '0.95', changefreq: 'daily' },
    { loc: `${BASE_URL}/services/enterprise-itad`,                 priority: '0.95', changefreq: 'daily' },
    { loc: `${BASE_URL}/services/data-destruction`,                priority: '0.95', changefreq: 'daily' },
    { loc: `${BASE_URL}/services/recycling-kochi`,                 priority: '0.9',  changefreq: 'weekly' },
    { loc: `${BASE_URL}/services/battery-recycling`,               priority: '0.85', changefreq: 'weekly' },
    { loc: `${BASE_URL}/services/document-shredding`,              priority: '0.85', changefreq: 'weekly' },
    // Cross-link to main site
    { loc: `${MAIN_URL}`,                                          priority: '0.95', changefreq: 'daily' },
    { loc: `${MAIN_URL}/contact`,                                  priority: '0.9',  changefreq: 'weekly' },
  ]

  const urls = pages.map((p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return sitemapResponse(xml)
}

import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { getAllArticles } from '@/lib/wiki/mdx-processor'
import { generateBreadcrumbSchema } from '@/lib/wiki/schema-builder'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export const metadata = {
  title: 'Recently Updated — EWasteKochi Wiki',
  description:
    'The most recently updated articles, glossary terms, and regulatory guidance in the EWasteKochi knowledge base.',
  alternates: { canonical: `${BASE_URL}/wiki/updates` },
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  compliance:       { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200'     },
  recycling:        { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  itad:             { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  'data-destruction':{ bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200'  },
  esg:              { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200'    },
  materials:        { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200'  },
  localities:       { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200'    },
  glossary:         { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
}

const DEFAULT_COLOR = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function UpdatesPage() {
  const allArticles = await getAllArticles()

  // Sort by dateUpdated → datePublished
  const sorted = [...allArticles].sort((a, b) => {
    const dA = a.metadata.dateUpdated ?? a.metadata.datePublished ?? ''
    const dB = b.metadata.dateUpdated ?? b.metadata.datePublished ?? ''
    return dB.localeCompare(dA)
  })

  // Group by month
  const byMonth: Record<string, typeof allArticles> = {}
  for (const article of sorted) {
    const date = article.metadata.dateUpdated ?? article.metadata.datePublished ?? ''
    const monthKey = date ? date.slice(0, 7) : 'unknown'
    if (!byMonth[monthKey]) byMonth[monthKey] = []
    byMonth[monthKey].push(article)
  }

  const monthOrder = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
    { name: 'Recently Updated', url: `${BASE_URL}/wiki/updates` },
  ])

  return (
    <WikiLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-10">
        {/* Header */}
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 px-8 py-10 border border-gray-200">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-100">
            {allArticles.length} articles tracked
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">Recently Updated</h1>
          <p className="max-w-2xl text-gray-600">
            Articles, compliance guidance, and glossary terms sorted by last revision date.
            Freshness matters — regulatory rules change.
          </p>
        </div>

        {/* Articles by month */}
        {monthOrder.map((monthKey) => {
          const articles = byMonth[monthKey]
          const label = monthKey === 'unknown'
            ? 'Undated'
            : new Date(monthKey + '-01').toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })

          return (
            <section key={monthKey}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-gray-800">{label}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-mono">{articles.length}</span>
              </div>

              <div className="space-y-2">
                {articles.map((article) => {
                  const colors = CATEGORY_COLORS[article.category] ?? DEFAULT_COLOR
                  const updated = article.metadata.dateUpdated
                  const published = article.metadata.datePublished
                  const catLabel = article.category.charAt(0).toUpperCase() +
                    article.category.slice(1).replace(/-/g, ' ')

                  return (
                    <Link
                      key={`${article.category}/${article.slug}`}
                      href={`/wiki/${article.category}/${article.slug}`}
                      className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
                            {catLabel}
                          </span>
                          {article.metadata.tier === 'T1' && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              T1
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                          {article.metadata.title}
                        </p>
                        {article.metadata.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {article.metadata.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 text-right space-y-1">
                        {updated ? (
                          <div>
                            <p className="text-[10px] text-gray-400">Updated</p>
                            <p className="text-xs font-medium text-gray-700">{formatDate(updated)}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-[10px] text-gray-400">Published</p>
                            <p className="text-xs font-medium text-gray-700">{formatDate(published)}</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <nav className="mt-12 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500">
          <Link href="/wiki" className="hover:text-emerald-600">Wiki</Link>
          {' › '}
          <span>Recently Updated</span>
        </div>
      </nav>
    </WikiLayout>
  )
}

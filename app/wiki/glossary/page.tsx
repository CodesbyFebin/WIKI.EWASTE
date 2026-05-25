import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'

export const metadata = {
  title: 'Glossary — E-Waste Terms & Definitions',
  description:
    'Complete A–Z glossary of 156+ e-waste, recycling, ITAD, compliance, and circular economy terms. Entity-linked definitions for every concept in the EWasteKochi knowledge base.',
  keywords: ['e-waste glossary', 'ITAD terms', 'EPR definition', 'recycling glossary India'],
}

function groupByLetter(
  articles: { slug: string; metadata: { title: string; description: string } }[]
) {
  const map: Record<string, typeof articles> = {}
  for (const article of articles) {
    const first = (article.metadata.title?.[0] ?? article.slug[0]).toUpperCase()
    if (!map[first]) map[first] = []
    map[first].push(article)
  }
  return map
}

export default async function GlossaryIndexPage() {
  const articles = await getAllArticlesInCategory('glossary')
  const grouped = groupByLetter(articles)
  const letters = Object.keys(grouped).sort()

  return (
    <WikiLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 px-8 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            Glossary · {articles.length} definitions
          </div>
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            E-Waste Glossary
          </h1>
          <p className="max-w-2xl text-lg text-gray-700">
            Authoritative A–Z definitions for every e-waste, recycling, ITAD, compliance, and
            circular economy term. Each entry is entity-linked to relevant articles and
            regulatory frameworks.
          </p>
        </div>

        {/* Alphabet jump nav */}
        <div className="flex flex-wrap gap-2">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 transition-all"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Grouped listings */}
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg font-black text-violet-700">
                {letter}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-mono text-gray-400">
                {grouped[letter].length} {grouped[letter].length === 1 ? 'term' : 'terms'}
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[letter].map((article) => (
                <Link
                  key={article.slug}
                  href={`/wiki/glossary/${article.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-4 hover:border-violet-400 hover:bg-violet-50 transition-all"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 text-sm">
                    {article.metadata.title}
                  </h3>
                  {article.metadata.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {article.metadata.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {articles.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No glossary terms found.</p>
          </div>
        )}
      </div>
    </WikiLayout>
  )
}

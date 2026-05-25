import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'
import categoriesData from '@/lib/wiki/categories.json'
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from '@/lib/wiki/schema-builder'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function generateStaticParams() {
  return categoriesData.categories.map((cat) => ({
    category: cat.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}) {
  const category = categoriesData.categories.find((c) => c.slug === params.category)
  return {
    title: `${category?.name ?? params.category} — EWasteKochi Wiki`,
    description: category?.description,
    alternates: {
      canonical: `${BASE_URL}/wiki/${params.category}`,
    },
  }
}

export default async function CategoryHub({
  params,
}: {
  params: { category: string }
}) {
  const category = categoriesData.categories.find((c) => c.slug === params.category)

  if (!category) {
    notFound()
  }

  const articles = await getAllArticlesInCategory(params.category)
  const t1Articles = articles.filter((a) => a.metadata.tier === 'T1')
  const t2Articles = articles.filter((a) => a.metadata.tier === 'T2')
  const t3Articles = articles.filter((a) => a.metadata.tier === 'T3')
  const t4Articles = articles.filter((a) => a.metadata.tier === 'T4')

  const categoryUrl = `${BASE_URL}/wiki/${params.category}`

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
    { name: category.name, url: categoryUrl },
  ])

  const itemListSchema = generateItemListSchema(
    category.name,
    articles.slice(0, 50).map((a) => ({
      name: a.metadata.title,
      url: `${categoryUrl}/${a.slug}`,
    }))
  )

  return (
    <WikiLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="space-y-12">
        {/* Category Header */}
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 px-8 py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{category.name}</h1>
          <p className="max-w-2xl text-lg text-gray-700">{category.description}</p>
          <p className="mt-4 text-sm text-gray-600">{articles.length} articles total</p>
        </div>

        {/* Ultimate Guides (T1) */}
        {t1Articles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Ultimate Guides</h2>
              <p className="text-sm text-gray-600">Comprehensive guides (12,000–25,000 words)</p>
            </div>
            <div className="space-y-3">
              {t1Articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/wiki/${params.category}/${article.slug}`}
                  className="block rounded-lg border border-yellow-200 bg-yellow-50 p-4 hover:border-yellow-400 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{article.metadata.title}</h3>
                      <p className="mt-1 text-sm text-gray-700">{article.metadata.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                        <span>{article.metadata.readTime} min read</span>
                        <span>•</span>
                        <span>By {article.metadata.author}</span>
                      </div>
                    </div>
                    <span className="ml-2 flex-shrink-0 rounded-full bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-900">
                      T1
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Pillars (T2) */}
        {t2Articles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Pillar Articles</h2>
              <p className="text-sm text-gray-600">In-depth articles (5,000–10,000 words)</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {t2Articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/wiki/${params.category}/${article.slug}`}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-4 hover:border-blue-400 transition-all"
                >
                  <h3 className="font-bold text-gray-900">{article.metadata.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{article.metadata.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    <span>{article.metadata.readTime} min</span>
                    <span className="rounded-full bg-blue-200 px-2 py-0.5 font-semibold text-blue-900">
                      T2
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Clusters (T3) */}
        {t3Articles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Cluster Articles</h2>
              <p className="text-sm text-gray-600">Focused articles (2,000–4,000 words)</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {t3Articles.slice(0, 9).map((article) => (
                <Link
                  key={article.slug}
                  href={`/wiki/${params.category}/${article.slug}`}
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{article.metadata.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{article.metadata.readTime} min read</p>
                </Link>
              ))}
            </div>
            {t3Articles.length > 9 && (
              <p className="mt-4 text-center text-sm text-gray-600">
                +{t3Articles.length - 9} more articles
              </p>
            )}
          </section>
        )}

        {/* Locality Guides (T4) */}
        {t4Articles.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Locality Guides</h2>
              <p className="text-sm text-gray-600">Location-specific guides (1,800–3,500 words)</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {t4Articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/wiki/${params.category}/${article.slug}`}
                  className="rounded-lg border border-green-200 bg-green-50 p-4 hover:border-green-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{article.metadata.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{article.metadata.description}</p>
                  <p className="mt-2 text-xs text-gray-600">{article.metadata.readTime} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600">No articles published yet in this category.</p>
          </div>
        )}
      </div>
    </WikiLayout>
  )
}

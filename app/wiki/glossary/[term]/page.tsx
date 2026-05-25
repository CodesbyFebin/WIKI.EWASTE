import WikiLayout from '@/components/wiki/wiki-layout'
import { getArticle, getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateDefinedTermSchema,
} from '@/lib/wiki/schema-builder'
import { autoLinkEntities } from '@/lib/wiki/auto-entity-links'
import { getArticlesByEntity, getCoMentionedEntities } from '@/lib/wiki/entity-article-index'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function generateStaticParams() {
  const articles = await getAllArticlesInCategory('glossary')
  return articles.map((a) => ({ term: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { term: string }
}) {
  const article = await getArticle('glossary', params.term)
  if (!article) notFound()

  const description =
    article.metadata.description ||
    `Definition of ${article.metadata.title} in the context of e-waste, recycling, and ITAD.`

  return {
    title: `${article.metadata.title} — E-Waste Glossary`,
    description,
    keywords: article.metadata.keywords,
    openGraph: {
      title: `${article.metadata.title} — E-Waste Glossary`,
      description,
      type: 'article',
      siteName: 'EWasteKochi',
      images: [
        {
          url: `${BASE_URL}/api/og?type=glossary&title=${encodeURIComponent(article.metadata.title ?? '')}&description=${encodeURIComponent(description.slice(0, 120))}`,
          width: 1200,
          height: 630,
          alt: article.metadata.title,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/wiki/glossary/${params.term}`,
    },
  }
}

const mdxComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-gray-700 leading-relaxed text-lg" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 space-y-2 list-disc" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-700" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-emerald-600 hover:underline font-medium" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-gray-900" {...props} />
  ),
}

export default async function GlossaryTermPage({
  params,
}: {
  params: { term: string }
}) {
  const article = await getArticle('glossary', params.term)
  if (!article) notFound()

  const termUrl = `${BASE_URL}/wiki/glossary/${params.term}`
  const description =
    article.metadata.description ??
    article.content.replace(/^#+\s.+\n?/gm, '').trim().slice(0, 300)

  // Bidirectional index: articles that reference this term
  const referencingArticles = getArticlesByEntity(params.term, 8)

  // Co-mentioned entity keys for "related concepts"
  const coMentionedKeys = getCoMentionedEntities(params.term, 5)

  /* ── JSON-LD ──────────────────────────────────────────── */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
    { name: 'Glossary', url: `${BASE_URL}/wiki/glossary` },
    { name: article.metadata.title, url: termUrl },
  ])

  const faqSchema = generateFAQSchema([
    {
      question: `What is ${article.metadata.title}?`,
      answer: description,
    },
    {
      question: `Why is ${article.metadata.title} important in e-waste management?`,
      answer: `${article.metadata.title} plays a key role in responsible e-waste disposal and compliance with India's e-waste management regulations.`,
    },
  ])

  const definedTermSchema = generateDefinedTermSchema(
    {
      name: article.metadata.title,
      description,
      url: termUrl,
    },
    BASE_URL
  )

  const relatedSlugs: string[] = article.metadata.relatedArticles ?? []

  return (
    <WikiLayout>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-10 items-start">
        {/* Main column */}
        <article className="max-w-2xl">
          {/* Term header */}
          <div className="mb-8 border-b border-gray-200 pb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1 text-sm font-semibold text-violet-700">
              Glossary Term
            </div>

            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              {article.metadata.title}
            </h1>

            {article.metadata.description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {article.metadata.description}
              </p>
            )}
          </div>

          {/* MDX body */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote
              source={autoLinkEntities(article.content, params.term)}
              components={mdxComponents}
            />
          </div>

          {/* Related terms */}
          {relatedSlugs.length > 0 && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {relatedSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/wiki/glossary/${slug}`}
                    className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:border-violet-400 hover:bg-violet-100 transition-all"
                  >
                    {slug.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Referenced by — bidirectional backlinks */}
          {referencingArticles.length > 0 && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                Referenced by {referencingArticles.length} article{referencingArticles.length !== 1 ? 's' : ''}
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Guides and articles in this knowledge base that mention this term.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {referencingArticles.map((ref) => (
                  <Link
                    key={ref.url}
                    href={ref.url}
                    className="group rounded-lg border border-gray-200 bg-white p-3 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                  >
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 leading-snug">
                      {ref.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400 capitalize">
                      {ref.category.replace(/-/g, ' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {(article.metadata.keywords?.length ?? 0) > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {article.metadata.keywords.map((kw: string) => (
                  <span
                    key={kw}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Right sidebar — co-mentioned concepts */}
        {coMentionedKeys.length > 0 && (
          <aside className="space-y-3 xl:sticky xl:top-24">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Related Concepts
            </p>
            <div className="space-y-2">
              {coMentionedKeys.map((key) => {
                const displayName = key
                  .split(' ')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')
                const slug = key.replace(/\s+/g, '-')
                return (
                  <Link
                    key={key}
                    href={`/wiki/glossary/${slug}`}
                    className="block rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:border-violet-300 hover:bg-violet-50 transition-all"
                  >
                    <p className="text-sm font-semibold text-gray-900 hover:text-violet-700">
                      {displayName}
                    </p>
                  </Link>
                )
              })}
            </div>
            <Link
              href="/wiki/glossary"
              className="block pt-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Browse full glossary →
            </Link>
          </aside>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="mt-12 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500">
          <Link href="/wiki" className="hover:text-emerald-600">Wiki</Link>
          {' › '}
          <Link href="/wiki/glossary" className="hover:text-emerald-600">Glossary</Link>
          {' › '}
          <span>{article.metadata.title}</span>
        </div>
      </nav>
    </WikiLayout>
  )
}

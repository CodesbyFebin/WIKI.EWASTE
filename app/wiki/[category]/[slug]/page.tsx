import WikiLayout from '@/components/wiki/wiki-layout'
import ArticleWrapper from '@/components/wiki/article-wrapper'
import EntitySidebar from '@/components/wiki/entity-sidebar'
import { AIAnswer } from '@/components/wiki/ai-answer'
import { getArticle, getAllArticlesInCategory, findArticleCategory } from '@/lib/wiki/mdx-processor'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
} from '@/lib/wiki/schema-builder'
import { autoLinkEntities } from '@/lib/wiki/auto-entity-links'
import categoriesData from '@/lib/wiki/categories.json'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export async function generateStaticParams() {
  const categories = [
    'recycling',
    'compliance',
    'itad',
    'data-destruction',
    'esg',
    'materials',
    'localities',
    'glossary',
  ]
  const params: { category: string; slug: string }[] = []

  for (const category of categories) {
    const articles = await getAllArticlesInCategory(category)
    articles.forEach((article) => {
      params.push({ category, slug: article.slug })
    })
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const article = await getArticle(params.category, params.slug)
  if (!article) notFound()

  const categoryDef = categoriesData.categories.find((c) => c.slug === params.category)
  const categoryName = categoryDef?.name ?? params.category

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    keywords: article.metadata.keywords,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: 'article',
      publishedTime: article.metadata.datePublished,
      modifiedTime: article.metadata.dateUpdated,
      siteName: 'EWasteKochi',
      images: [
        {
          url: `${BASE_URL}/api/og?type=article&title=${encodeURIComponent(article.metadata.title ?? '')}&description=${encodeURIComponent((article.metadata.description ?? '').slice(0, 120))}&category=${encodeURIComponent(params.category)}`,
          width: 1200,
          height: 630,
          alt: article.metadata.title,
        },
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/wiki/${params.category}/${params.slug}`,
    },
  }
}

const mdxComponents = {
  AIAnswer,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold text-gray-900" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 space-y-2 list-disc" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 space-y-2 list-decimal" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-700" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mb-4 border-l-4 border-emerald-500 pl-4 italic text-gray-700"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-emerald-600 hover:underline" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4 text-gray-100"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <table className="mb-4 w-full border-collapse border border-gray-300" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-gray-300 bg-gray-100 p-3 text-left font-bold" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-gray-300 p-3" {...props} />
  ),
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string }
}) {
  const article = await getArticle(params.category, params.slug)
  if (!article) notFound()

  const categoryDef = categoriesData.categories.find((c) => c.slug === params.category)
  const categoryName = categoryDef?.name ?? params.category
  const articleUrl = `${BASE_URL}/wiki/${params.category}/${params.slug}`

  /* ── JSON-LD schemas ─────────────────────────────────── */
  const articleSchema = generateArticleSchema(
    {
      title: article.metadata.title,
      description: article.metadata.description,
      author: article.metadata.author ?? 'EWasteKochi',
      reviewer: article.metadata.reviewer,
      datePublished: article.metadata.datePublished ?? new Date().toISOString(),
      dateUpdated: article.metadata.dateUpdated ?? new Date().toISOString(),
      entities: article.metadata.entities,
    },
    articleUrl,
    BASE_URL
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
    { name: categoryName, url: `${BASE_URL}/wiki/${params.category}` },
    { name: article.metadata.title, url: articleUrl },
  ])

  const faqSchema =
    article.metadata.faqs?.length
      ? generateFAQSchema(article.metadata.faqs)
      : null

  const howToSchema =
    article.metadata.howToSteps?.length
      ? generateHowToSchema(article.metadata.title, article.metadata.howToSteps)
      : null

  const resolvedRelated = (article.metadata.relatedArticles ?? []).map((slug) => {
    const cat = findArticleCategory(slug) ?? params.category
    return { slug, category: cat, href: `/wiki/${cat}/${slug}` }
  })

  return (
    <WikiLayout>
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Two-column layout: article + entity sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-8 items-start">
        <div>
          <ArticleWrapper
            metadata={article.metadata}
            category={params.category}
            categoryName={categoryName}
            resolvedRelated={resolvedRelated}
          >
            <MDXRemote
              source={autoLinkEntities(article.content, params.slug)}
              components={mdxComponents}
            />
          </ArticleWrapper>

          {/* Breadcrumb nav */}
          <nav className="mt-12 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">
              <Link href="/wiki" className="hover:text-emerald-600">
                Wiki
              </Link>
              {' › '}
              <Link href={`/wiki/${params.category}`} className="hover:text-emerald-600">
                {categoryName}
              </Link>
              {' › '}
              <span>{article.metadata.title}</span>
            </div>
          </nav>
        </div>

        {/* Entity sidebar — only renders when article has entity metadata */}
        <EntitySidebar
          entityIds={article.metadata.entities ?? []}
          currentUrl={articleUrl}
        />
      </div>
    </WikiLayout>
  )
}

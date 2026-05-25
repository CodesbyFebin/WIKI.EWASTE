/**
 * Article index for search and discovery
 * Generated at build time from article frontmatter
 */

export interface ArticleIndex {
  slug: string
  category: string
  title: string
  description: string
  keywords: string[]
  entities: string[]
  relatedArticles: string[]
  tier: 'T1' | 'T2' | 'T3' | 'T4' | 'T5'
  readTime: number
  datePublished: string
}

/**
 * Build article index from MDX metadata
 * This would be called during build time
 */
export function buildArticleIndex(articles: any[]): ArticleIndex[] {
  return articles.map((article) => ({
    slug: article.metadata.slug,
    category: article.category,
    title: article.metadata.title,
    description: article.metadata.description,
    keywords: article.metadata.keywords || [],
    entities: article.metadata.entities || [],
    relatedArticles: article.metadata.relatedArticles || [],
    tier: article.metadata.tier,
    readTime: article.metadata.readTime,
    datePublished: article.metadata.datePublished,
  }))
}

/**
 * Search articles by keyword
 */
export function searchByKeyword(
  query: string,
  index: ArticleIndex[]
): ArticleIndex[] {
  const lowerQuery = query.toLowerCase()
  return index.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.keywords.some((k) =>
        k.toLowerCase().includes(lowerQuery)
      )
  )
}

/**
 * Search articles by entity
 */
export function searchByEntity(
  entityId: string,
  index: ArticleIndex[]
): ArticleIndex[] {
  return index.filter((article) =>
    article.entities.includes(entityId)
  )
}

/**
 * Get related articles for a given article
 */
export function getRelatedArticles(
  articleSlug: string,
  index: ArticleIndex[]
): ArticleIndex[] {
  const article = index.find((a) => a.slug === articleSlug)
  if (!article) return []

  const related = new Set<ArticleIndex>()

  // Find articles with overlapping entities
  article.entities.forEach((entityId) => {
    const articlesWithEntity = index.filter((a) =>
      a.entities.includes(entityId)
    )
    articlesWithEntity.forEach((a) => {
      if (a.slug !== articleSlug) related.add(a)
    })
  })

  // Find articles with overlapping keywords
  article.keywords.forEach((keyword) => {
    const articlesWithKeyword = index.filter((a) =>
      a.keywords.includes(keyword)
    )
    articlesWithKeyword.forEach((a) => {
      if (a.slug !== articleSlug) related.add(a)
    })
  })

  return Array.from(related).slice(0, 5)
}

/**
 * Filter articles by category
 */
export function filterByCategory(
  category: string,
  index: ArticleIndex[]
): ArticleIndex[] {
  return index.filter((article) => article.category === category)
}

/**
 * Filter articles by tier
 */
export function filterByTier(
  tier: string,
  index: ArticleIndex[]
): ArticleIndex[] {
  return index.filter((article) => article.tier === tier)
}

/**
 * Sort articles by date (newest first)
 */
export function sortByDate(articles: ArticleIndex[]): ArticleIndex[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() -
      new Date(a.datePublished).getTime()
  )
}

/**
 * Sort articles by read time (shortest first)
 */
export function sortByReadTime(articles: ArticleIndex[]): ArticleIndex[] {
  return [...articles].sort((a, b) => a.readTime - b.readTime)
}

/**
 * Pagination helper
 */
export function paginate<T>(
  items: T[],
  page: number,
  perPage: number
): { items: T[]; total: number; pages: number; currentPage: number } {
  const total = items.length
  const pages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    items: items.slice(start, end),
    total,
    pages,
    currentPage: page,
  }
}

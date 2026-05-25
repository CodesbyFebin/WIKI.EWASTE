import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ArticleMetadata {
  title: string
  slug: string
  category: string
  tier: "T1" | "T2" | "T3" | "T4" | "T5"
  author: string
  reviewer?: string
  datePublished: string
  dateUpdated: string
  readTime: number
  description: string
  keywords: string[]
  entities: string[]
  relatedArticles: string[]
  howToSteps?: Array<{ name: string; text: string }>
  faqs?: Array<{ question: string; answer: string }>
}

export interface ProcessedArticle {
  metadata: ArticleMetadata
  content: string
  slug: string
  category: string
}

const contentRoot = path.join(process.cwd(), "content/wiki")

export async function getArticle(
  category: string,
  slug: string
): Promise<ProcessedArticle | null> {
  try {
    const filePath = path.join(contentRoot, category, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(fileContent)

    // Normalize: some glossary files use `term:` instead of `title:`
    const normalizedData = {
      ...data,
      title: (data.title ?? data.term ?? slug) as string,
    }

    return {
      metadata: normalizedData as ArticleMetadata,
      content,
      slug,
      category,
    }
  } catch (error) {
    console.error(`Error reading article ${category}/${slug}:`, error)
    return null
  }
}

export async function getAllArticlesInCategory(category: string): Promise<ProcessedArticle[]> {
  try {
    const categoryPath = path.join(contentRoot, category)

    if (!fs.existsSync(categoryPath)) {
      return []
    }

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".mdx"))

    const articles: ProcessedArticle[] = []

    for (const file of files) {
      const slug = file.replace(".mdx", "")
      const article = await getArticle(category, slug)
      if (article) {
        articles.push(article)
      }
    }

    return articles.sort((a, b) => {
      const tierOrder: Record<string, number> = {
        T1: 0,
        T2: 1,
        T3: 2,
        T4: 3,
        T5: 4,
      }
      return tierOrder[a.metadata.tier] - tierOrder[b.metadata.tier]
    })
  } catch (error) {
    console.error(`Error reading category ${category}:`, error)
    return []
  }
}

export async function getAllArticles(): Promise<ProcessedArticle[]> {
  const categories = [
    "recycling",
    "compliance",
    "itad",
    "data-destruction",
    "esg",
    "materials",
    "localities",
    "glossary",
  ]
  const allArticles: ProcessedArticle[] = []

  for (const category of categories) {
    const articles = await getAllArticlesInCategory(category)
    allArticles.push(...articles)
  }

  return allArticles
}

const CATEGORIES = [
  "recycling", "compliance", "itad", "data-destruction",
  "esg", "materials", "localities", "glossary",
]

let _slugCategoryCache: Record<string, string> | null = null

export function findArticleCategory(slug: string): string | null {
  if (!_slugCategoryCache) {
    _slugCategoryCache = {}
    for (const cat of CATEGORIES) {
      const catPath = path.join(contentRoot, cat)
      if (fs.existsSync(catPath)) {
        for (const file of fs.readdirSync(catPath)) {
          if (file.endsWith(".mdx")) {
            _slugCategoryCache[file.replace(".mdx", "")] = cat
          }
        }
      }
    }
  }
  return _slugCategoryCache[slug] ?? null
}

export function generateTableOfContents(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Array<{ level: number; text: string; id: string }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    headings.push({ level, text, id })
  }

  return headings
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

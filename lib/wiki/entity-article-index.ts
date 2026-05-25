/**
 * Entity–Article Co-occurrence Index
 *
 * Scans every MDX file in content/wiki at first access, builds two maps:
 *
 *   entityIndex  — normalized entity key  →  ArticleRef[]
 *   articleIndex — "category/slug"        →  normalized entity keys[]
 *
 * Both maps are cached as singletons so the filesystem is only scanned once
 * per process (i.e. once per Next.js build worker).
 *
 * Normalisation:  "CPCB" → "cpcb",  "extended-producer-responsibility" → "extended producer responsibility"
 * This lets glossary slugs match the short acronyms articles use in frontmatter.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'content/wiki')

const ALL_CATEGORIES = [
  'recycling',
  'compliance',
  'itad',
  'data-destruction',
  'esg',
  'materials',
  'localities',
  'glossary',
]

export interface ArticleRef {
  title: string
  slug: string
  category: string
  url: string
}

type EntityIndex = Map<string, ArticleRef[]>
type ArticleEntityMap = Map<string, string[]>  // "category/slug" → entity keys

let _entityIndex: EntityIndex | null = null
let _articleEntityMap: ArticleEntityMap | null = null

function normalise(raw: string): string {
  return raw.toLowerCase().trim().replace(/-/g, ' ')
}

function buildIndexes(): { entityIndex: EntityIndex; articleEntityMap: ArticleEntityMap } {
  const entityIndex: EntityIndex = new Map()
  const articleEntityMap: ArticleEntityMap = new Map()

  for (const category of ALL_CATEGORIES) {
    const catDir = path.join(contentRoot, category)
    if (!fs.existsSync(catDir)) continue

    let files: string[]
    try {
      files = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'))
    } catch {
      continue
    }

    for (const file of files) {
      const slug = file.replace('.mdx', '')
      const filePath = path.join(catDir, file)

      try {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(raw)

        const title = ((data.title ?? data.term ?? slug) as string).trim()
        const entities = (data.entities as string[] | undefined) ?? []
        const url = `/wiki/${category}/${slug}`
        const articleKey = `${category}/${slug}`

        const normalisedKeys: string[] = []

        for (const entity of entities) {
          const key = normalise(entity)
          if (!entityIndex.has(key)) entityIndex.set(key, [])

          // Avoid duplicates (articles sometimes repeat entities)
          const existing = entityIndex.get(key)!
          if (!existing.some((r) => r.url === url)) {
            existing.push({ title, slug, category, url })
          }

          normalisedKeys.push(key)
        }

        articleEntityMap.set(articleKey, normalisedKeys)
      } catch {
        // Silently skip unreadable files
      }
    }
  }

  return { entityIndex, articleEntityMap }
}

function ensureIndexes() {
  if (!_entityIndex || !_articleEntityMap) {
    const { entityIndex, articleEntityMap } = buildIndexes()
    _entityIndex = entityIndex
    _articleEntityMap = articleEntityMap
  }
}

/**
 * All non-glossary articles that reference `entityId`.
 * Looks up by the raw ID and by the slug-normalised form of the ID.
 *
 * @param entityId  Glossary slug or entity graph ID (e.g. "cpcb", "epr")
 * @param limit     Maximum results (default 12)
 */
export function getArticlesByEntity(entityId: string, limit = 12): ArticleRef[] {
  ensureIndexes()
  const key = normalise(entityId)
  const results = (_entityIndex!.get(key) ?? [])
    .filter((r) => r.category !== 'glossary')
    .slice(0, limit)
  return results
}

/**
 * Count of non-glossary articles referencing this entity.
 */
export function getArticleCountForEntity(entityId: string): number {
  ensureIndexes()
  const key = normalise(entityId)
  return (_entityIndex!.get(key) ?? []).filter((r) => r.category !== 'glossary').length
}

/**
 * Entity keys that most frequently co-occur with `entityId` across articles.
 * Useful for "related concepts" on glossary and entity sidebar.
 *
 * @param entityId   Entity to look up
 * @param topN       How many co-occurrences to return (default 5)
 */
export function getCoMentionedEntities(entityId: string, topN = 5): string[] {
  ensureIndexes()
  const key = normalise(entityId)
  const articles = _entityIndex!.get(key) ?? []

  const counts = new Map<string, number>()

  for (const article of articles) {
    const articleKey = `${article.category}/${article.slug}`
    const coEntities = _articleEntityMap!.get(articleKey) ?? []
    for (const co of coEntities) {
      if (co === key) continue
      counts.set(co, (counts.get(co) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([k]) => k)
}

/**
 * All entity keys referenced by a specific article.
 */
export function getEntitiesForArticle(category: string, slug: string): string[] {
  ensureIndexes()
  return _articleEntityMap!.get(`${category}/${slug}`) ?? []
}

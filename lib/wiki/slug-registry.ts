import fs from 'fs'
import path from 'path'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function walkDir(dir: string, prefix = ''): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const rel = prefix ? `${prefix}/${name}` : name
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      results.push(...walkDir(full, rel))
    } else {
      results.push(rel)
    }
  }
  return results
}

function removeExt(p: string) {
  return p.replace(/\.[^/.]+$/, '')
}

const articleSet = new Set<string>()
const glossarySet = new Set<string>()
const entitySet = new Set<string>()
const updatesSet = new Set<string>()

function buildRegistry() {
  // articles: content/wiki/<category>/<slug>.mdx or .md
  const wikiDir = path.join(CONTENT_ROOT, 'wiki')
  for (const file of walkDir(wikiDir)) {
    const parts = file.split('/')
    if (parts.length >= 2) {
      const category = parts[0]
      const slug = removeExt(parts.slice(1).join('/'))
      articleSet.add(`/wiki/${category}/${slug}`)
      // also add category index
      articleSet.add(`/wiki/${category}`)
    }
  }

  // glossary: content/glossary/<term>.mdx
  const glossaryDir = path.join(CONTENT_ROOT, 'glossary')
  for (const file of walkDir(glossaryDir)) {
    const term = removeExt(file)
    glossarySet.add(`/wiki/glossary/${term}`)
  }

  // entities: content/entities/<slug>.mdx
  const entitiesDir = path.join(CONTENT_ROOT, 'entities')
  for (const file of walkDir(entitiesDir)) {
    const slug = removeExt(file)
    entitySet.add(`/wiki/entities/${slug}`)
  }

  // updates
  const updatesDir = path.join(CONTENT_ROOT, 'updates')
  for (const file of walkDir(updatesDir)) {
    const slug = removeExt(file)
    updatesSet.add(`/wiki/updates/${slug}`)
    updatesSet.add(`/wiki/updates`)
  }
}

buildRegistry()

export function routeExists(route: string) {
  if (articleSet.has(route)) return true
  if (glossarySet.has(route)) return true
  if (entitySet.has(route)) return true
  if (updatesSet.has(route)) return true
  // allow base routes
  if (route === '/wiki') return true
  return false
}

export function articleExists(routeOrPath: string) {
  return articleSet.has(routeOrPath)
}

export function glossaryExists(routeOrPath: string) {
  return glossarySet.has(routeOrPath)
}

export function getAllRoutes() {
  return {
    articles: Array.from(articleSet),
    glossary: Array.from(glossarySet),
    entities: Array.from(entitySet),
    updates: Array.from(updatesSet)
  }
}

export const RESERVED_ROUTES = new Set(['entities', 'updates', 'search', 'glossary'])

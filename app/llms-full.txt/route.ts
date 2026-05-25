/**
 * /llms-full.txt
 *
 * Machine-expanded bootstrap manifest for AI crawler orientation.
 * Every article, entity, glossary term, API endpoint, and AIAnswer
 * snippet listed for maximum ingestion surface.
 *
 * Differs from /llms.txt (curated summary) by being exhaustive.
 */

import { getAllArticles } from '@/lib/wiki/mdx-processor'
import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getArticleCountForEntity } from '@/lib/wiki/entity-article-index'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export const dynamic = 'force-static'
export const revalidate = 3600

const AI_ANSWER_RE =
  /<AIAnswer\s+question="([^"]+)"[^>]*>/g

function extractQuestions(content: string): string[] {
  const questions: string[] = []
  let match: RegExpExecArray | null
  AI_ANSWER_RE.lastIndex = 0
  while ((match = AI_ANSWER_RE.exec(content)) !== null) {
    questions.push(match[1].trim())
  }
  return questions
}

export async function GET() {
  const allArticles = await getAllArticles()
  const entities = Object.values(semanticGraph).sort(
    (a, b) => getArticleCountForEntity(b.id) - getArticleCountForEntity(a.id)
  )

  // ── 1. Header ────────────────────────────────────────────────
  const header = `# EWasteKochi — Full Content Manifest
# Generated: ${new Date().toISOString()}
# Source: ${BASE_URL}
# Format: llmstxt.org/spec (extended — exhaustive index)
#
# This file is intended for AI crawlers, embedding pipelines,
# and retrieval systems. It enumerates ALL content surfaces.
# For a curated summary, see: ${BASE_URL}/llms.txt
`

  // ── 2. Retrieval APIs ────────────────────────────────────────
  const apis = `## Retrieval APIs

- Articles catalogue: ${BASE_URL}/api/articles
- Entity graph:       ${BASE_URL}/api/entities
- Glossary:           ${BASE_URL}/api/glossary
- AI snippets:        ${BASE_URL}/api/snippets
- Recent updates:     ${BASE_URL}/api/recent
- Trending entities:  ${BASE_URL}/api/trending-entities
- Semantic chunks:    ${BASE_URL}/exports/chunks.ndjson
`

  // ── 3. Core entities (sorted by authority) ───────────────────
  const entityLines = entities.map((e) => {
    const count = getArticleCountForEntity(e.id)
    return `- [${e.name}](${BASE_URL}/wiki/glossary/${e.id}) [${e.type}] (${count} refs): ${e.description}`
  })
  const entitiesBlock = `## Core Entities (${entities.length} total, sorted by article references)\n\n${entityLines.join('\n')}`

  // ── 4. All articles grouped by category ──────────────────────
  const byCategory: Record<string, typeof allArticles> = {}
  for (const a of allArticles) {
    if (!byCategory[a.category]) byCategory[a.category] = []
    byCategory[a.category].push(a)
  }

  const articleBlocks = Object.entries(byCategory).map(([cat, arts]) => {
    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
    const lines = arts.map((a) => {
      const tier = a.metadata.tier ?? 'T3'
      const updated = a.metadata.dateUpdated ?? a.metadata.datePublished ?? ''
      return `- [${a.metadata.title}](${BASE_URL}/wiki/${cat}/${a.slug}) [${tier}] (updated: ${updated}): ${a.metadata.description ?? ''}`
    })
    return `### ${catLabel} (${arts.length} articles)\n\n${lines.join('\n')}`
  })
  const articlesBlock = `## All Articles (${allArticles.length} total)\n\n${articleBlocks.join('\n\n')}`

  // ── 5. AIAnswer snippets index ────────────────────────────────
  const snippetLines: string[] = []
  for (const a of allArticles) {
    const questions = extractQuestions(a.content)
    for (const q of questions) {
      snippetLines.push(`- "${q}" — ${BASE_URL}/api/snippets?q=${encodeURIComponent(q.split(' ').slice(0, 4).join(' '))}`)
    }
  }
  const snippetsBlock = snippetLines.length > 0
    ? `## AIAnswer Snippets Index (${snippetLines.length} structured answers)\n\n${snippetLines.join('\n')}`
    : ''

  // ── 6. Compliance reference quick index ──────────────────────
  const complianceBlock = `## Compliance Reference Index

### Indian Regulations
- E-Waste Management Rules 2022 → /wiki/compliance/e-waste-management-rules-2022
- Extended Producer Responsibility (EPR) → /wiki/compliance/epr-compliance-guide
- DPDP Act 2023 → /wiki/compliance/dpdp-act-data-destruction
- CPCB Authorisation → /wiki/compliance/cpcb-authorisation-process
- KSPCB Kerala Rules → /wiki/localities/kerala-kspcb-rules

### International Standards Applied in India
- NIST SP 800-88 (data sanitization) → /wiki/glossary/nist-800-88
- ISO 14001 (environmental management) → /wiki/glossary/iso-14001
- ISO 27001 (information security) → /wiki/glossary/iso-27001
- R2/RIOS Certification → /wiki/glossary/r2-certification
`

  const body = [
    header,
    apis,
    entitiesBlock,
    articlesBlock,
    snippetsBlock,
    complianceBlock,
  ].filter(Boolean).join('\n\n---\n\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

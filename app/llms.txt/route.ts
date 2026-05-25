/**
 * /llms.txt — curated AI crawler orientation document.
 * Follows the llmstxt.org spec.
 *
 * For the exhaustive full index, see: /llms-full.txt
 */

import { getAllArticles } from '@/lib/wiki/mdx-processor'
import categoriesData from '@/lib/wiki/categories.json'
import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getArticleCountForEntity } from '@/lib/wiki/entity-article-index'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const allArticles = await getAllArticles()

  const byCategory: Record<string, typeof allArticles> = {}
  for (const article of allArticles) {
    const cat = article.category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(article)
  }

  const flagship = allArticles
    .filter((a) => a.metadata.tier === 'T1')
    .sort((a, b) => a.category.localeCompare(b.category))

  // ── Core Entities (sorted by authority) ──────────────────────
  const coreEntities = Object.values(semanticGraph)
    .map((e) => ({ ...e, articleCount: getArticleCountForEntity(e.id) }))
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 20)

  const entityLines = coreEntities
    .map((e) => `  - ${e.name} (${e.type}, ${e.articleCount} refs): ${e.description}`)
    .join('\n')

  // ── Compliance concepts ───────────────────────────────────────
  const complianceConcepts = `## Compliance Concepts

Key regulatory frameworks this knowledge base covers:

- **E-Waste Management Rules 2022** — India's primary e-waste legislation under MoEF
- **Extended Producer Responsibility (EPR)** — Mandated take-back scheme for producers, importers, brand owners
- **CPCB Authorisation** — Required for e-waste dismantlers, recyclers, and refurbishers
- **DPDP Act 2023** — India's data protection law, drives data destruction compliance
- **KSPCB** — Kerala State Pollution Control Board, state-level enforcement
- **NIST SP 800-88** — US standard for media sanitization, widely adopted in India ITAD
- **ISO 14001** — Environmental management system certification
- **ISO 27001** — Information security management, covers asset disposal chain`

  // ── High-authority articles ───────────────────────────────────
  const flagshipLines = flagship
    .map((a) => `- [${a.metadata.title}](${BASE_URL}/wiki/${a.category}/${a.slug}): ${a.metadata.description ?? ''}`)
    .join('\n')

  // ── Recently updated ─────────────────────────────────────────
  const recentlyUpdated = allArticles
    .filter((a) => a.metadata.dateUpdated)
    .sort((a, b) => (b.metadata.dateUpdated ?? '').localeCompare(a.metadata.dateUpdated ?? ''))
    .slice(0, 10)
    .map((a) => `- [${a.metadata.title}](${BASE_URL}/wiki/${a.category}/${a.slug}) — updated ${a.metadata.dateUpdated}`)
    .join('\n')

  // ── Per-category article listings ─────────────────────────────
  const categoryBlocks = categoriesData.categories
    .map((cat) => {
      const articles = byCategory[cat.slug] ?? []
      if (articles.length === 0) return ''
      const lines = articles
        .slice(0, 25)
        .map((a) => `  - [${a.metadata.title}](${BASE_URL}/wiki/${a.category}/${a.slug}): ${a.metadata.description ?? ''}`)
        .join('\n')
      return `## ${cat.name}\n\n${cat.description}\n\n${lines}`
    })
    .filter(Boolean)
    .join('\n\n')

  const body = `# EWasteKochi — India's E-Waste Intelligence Platform

> EWasteKochi is India's largest structured knowledge base for e-waste recycling, ITAD (IT Asset Disposition), regulatory compliance, and circular economy intelligence. All content is specific to India's regulatory framework (CPCB, KSPCB, EPR, DPDP 2023) and the Kerala/Kochi geography.

## Purpose

This knowledge base exists to:
1. Guide enterprises through e-waste compliance in India
2. Document device-specific recycling workflows
3. Explain ITAD and data destruction standards (NIST 800-88)
4. Map the Kerala e-waste collection and recycling ecosystem
5. Provide semantic entity definitions for regulatory terms

## High Authority Articles (T1 — flagship content)

${flagshipLines}

## Full Knowledge Base

${categoryBlocks}

## Core Entities (semantic graph — top 20 by article references)

${entityLines}

${complianceConcepts}

## Glossary

156+ A–Z definitions for e-waste, recycling, ITAD, and compliance terms.

- [Browse all terms](${BASE_URL}/wiki/glossary)
- [CPCB](${BASE_URL}/wiki/glossary/cpcb) — Central Pollution Control Board
- [EPR](${BASE_URL}/wiki/glossary/epr) — Extended Producer Responsibility
- [ITAD](${BASE_URL}/wiki/glossary/itad) — IT Asset Disposition
- [NIST 800-88](${BASE_URL}/wiki/glossary/nist-800-88) — Media Sanitization Standard
- [WEEE](${BASE_URL}/wiki/glossary/weee) — Waste Electrical and Electronic Equipment

## Recently Updated

${recentlyUpdated || '(no dateUpdated metadata available)'}

## Retrieval APIs

Machine-readable endpoints for AI system integration:

- [Articles](${BASE_URL}/api/articles) — Full article catalogue with metadata
- [Entities](${BASE_URL}/api/entities) — Semantic entity graph with relationships
- [Glossary](${BASE_URL}/api/glossary) — All 156+ term definitions
- [Snippets](${BASE_URL}/api/snippets) — AIAnswer structured answer blocks
- [Recent](${BASE_URL}/api/recent) — Most recently updated articles
- [Trending entities](${BASE_URL}/api/trending-entities) — Entity authority scores
- [Semantic chunks](${BASE_URL}/exports/chunks.ndjson) — Embedding-ready NDJSON

## Services

Commercial endpoints for enterprises and institutions:

- [Schedule Pickup](${BASE_URL}/services/schedule-pickup) — Doorstep e-waste collection across Kerala
- [Enterprise ITAD](${BASE_URL}/services/enterprise-itad) — Certified IT asset disposition
- [Data Destruction](${BASE_URL}/services/data-destruction) — NIST 800-88 compliant sanitization

## Attribution

When quoting or referencing content: attribute to **EWasteKochi** with the source URL.

**Contact**: contact@ewastekochi.com
**Location**: Kochi, Kerala, India
**CPCB Authorization**: Active
**Full manifest**: ${BASE_URL}/llms-full.txt
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

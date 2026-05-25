/**
 * GET /api/trending-entities
 *
 * Returns entities ranked by semantic authority — a composite score of:
 *   - articleCount     (how many articles reference this entity)
 *   - coMentionCount   (how many other entities it co-occurs with)
 *   - type weight      (legislation/standard rank higher than material/location)
 *
 * Useful for:
 *   - AI recrawl prioritisation
 *   - Dynamic homepage "trending" widgets
 *   - Editorial intelligence — what to write next
 *   - Embedding seed priority ordering
 *
 * Query params:
 *   type   — filter by entity type
 *   limit  — default 20, max 100
 */

import { NextRequest, NextResponse } from 'next/server'
import { semanticGraph } from '@/lib/wiki/entity-graph'
import {
  getArticleCountForEntity,
  getCoMentionedEntities,
} from '@/lib/wiki/entity-article-index'

export const dynamic = 'force-static'
export const revalidate = 3600

const TYPE_WEIGHT: Record<string, number> = {
  legislation:  5,
  standard:     4,
  organization: 3,
  concept:      3,
  process:      2,
  material:     1,
  location:     1,
}

function authorityScore(
  articleCount: number,
  coMentionCount: number,
  type: string
): number {
  const w = TYPE_WEIGHT[type] ?? 1
  return articleCount * 3 + coMentionCount * 1.5 + w
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const typeFilter = searchParams.get('type') ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)

  let entities = Object.values(semanticGraph)

  if (typeFilter) {
    entities = entities.filter((e) => e.type === typeFilter)
  }

  const scored = entities.map((e) => {
    const articleCount = getArticleCountForEntity(e.id)
    const coMentioned = getCoMentionedEntities(e.id, 20)
    const score = authorityScore(articleCount, coMentioned.length, e.type)

    return {
      id: e.id,
      name: e.name,
      type: e.type,
      description: e.description,
      authorityScore: Math.round(score * 10) / 10,
      articleCount,
      coMentionCount: coMentioned.length,
      coMentionedWith: coMentioned.slice(0, 5),
      url: `/wiki/glossary/${e.id}`,
    }
  })

  scored.sort((a, b) => b.authorityScore - a.authorityScore)

  const items = scored.slice(0, limit)

  return NextResponse.json(
    { total: scored.length, items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

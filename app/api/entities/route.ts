/**
 * GET /api/entities
 *
 * Returns the full semantic entity graph with relationship data and
 * article reference counts from the live co-occurrence index.
 *
 * Query parameters:
 *   type  — filter by entity type (organization|standard|legislation|concept|material|process|location)
 *   id    — return a single entity by ID (e.g. ?id=cpcb)
 */

import { NextRequest, NextResponse } from 'next/server'
import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getArticleCountForEntity, getCoMentionedEntities } from '@/lib/wiki/entity-article-index'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const typeFilter = searchParams.get('type')
  const idFilter = searchParams.get('id')

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

  try {
    let entries = Object.values(semanticGraph)

    if (typeFilter) {
      entries = entries.filter((e) => e.type === typeFilter)
    }

    if (idFilter) {
      const entity = semanticGraph[idFilter.toLowerCase()]
      if (!entity) {
        return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
      }
      entries = [entity]
    }

    const enriched = entries.map((entity) => {
      const articleCount = getArticleCountForEntity(entity.id)
      const coMentioned = getCoMentionedEntities(entity.id, 5)

      return {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        description: entity.description,
        linkedArticles: entity.linkedArticles,
        relatedEntities: entity.relatedEntities,
        articleCount,
        coMentionedEntities: coMentioned,
        glossaryUrl: `${BASE_URL}/wiki/glossary/${entity.id}`,
      }
    })

    // Sort by article count descending (most-referenced entities first)
    enriched.sort((a, b) => b.articleCount - a.articleCount)

    return NextResponse.json(
      {
        entities: enriched,
        total: enriched.length,
        types: ['organization', 'standard', 'legislation', 'concept', 'material', 'process', 'location'],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('/api/entities error:', err)
    return NextResponse.json({ error: 'Failed to load entities' }, { status: 500 })
  }
}

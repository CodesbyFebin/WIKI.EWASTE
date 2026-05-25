/**
 * GET /api/search/semantic
 *
 * Hybrid semantic search: vector similarity + BM25 + authority + entity boost
 * + freshness + locality.
 *
 * Requires QDRANT_URL and VOYAGE_API_KEY | OPENAI_API_KEY to be set.
 * Returns a graceful error if vector store is not configured.
 *
 * Query params:
 *   q          — search query (required)
 *   category   — filter by wiki category
 *   tier       — filter by article tier (T1, T2, ...)
 *   sourceType — filter by chunk type (ai-answer, glossary-definition, ...)
 *   limit      — max results (default 10, max 30)
 *   debug      — include score breakdown (true | false)
 */

import { NextRequest, NextResponse } from 'next/server'
import { hybridSearch } from '@/lib/retrieval/hybrid-search'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  if (!process.env.QDRANT_URL) {
    return NextResponse.json(
      { error: 'Vector store not configured. Set QDRANT_URL to enable semantic search.' },
      { status: 503 }
    )
  }

  const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 30)
  const debug = searchParams.get('debug') === 'true'

  const options = {
    limit,
    category: searchParams.get('category') ?? undefined,
    tier:     searchParams.get('tier')     ?? undefined,
    sourceType: searchParams.get('sourceType') ?? undefined,
  }

  try {
    const results = await hybridSearch(q, options)

    const items = results.map((r) => {
      const base = {
        id:          r.chunk.id,
        title:       r.chunk.title,
        heading:     r.chunk.heading,
        content:     r.chunk.content.slice(0, 500),
        url:         r.chunk.url,
        category:    r.chunk.category,
        tier:        r.chunk.tier,
        sourceType:  r.chunk.sourceType,
        entities:    r.chunk.entities,
        score:       Math.round(r.finalScore * 1000) / 1000,
      }

      if (!debug) return base

      return {
        ...base,
        _scores: {
          vector:    Math.round(r.vectorScore    * 1000) / 1000,
          bm25:      Math.round(r.bm25Score      * 1000) / 1000,
          authority: Math.round(r.authorityScore * 1000) / 1000,
          entity:    Math.round(r.entityBoost    * 1000) / 1000,
          freshness: Math.round(r.freshnessBoost * 1000) / 1000,
          locality:  Math.round(r.localityBoost  * 1000) / 1000,
        },
      }
    })

    return NextResponse.json(
      { query: q, total: items.length, items },
      {
        headers: {
          'Cache-Control': 'no-store', // real-time retrieval — do not cache
        },
      }
    )
  } catch (err) {
    console.error('[/api/search/semantic]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

/**
 * GET /api/glossary
 *
 * Returns all 156+ glossary term definitions.
 * Used by AI assistants for grounded definition retrieval and by the
 * embedding pipeline for vector indexing.
 *
 * Query parameters:
 *   q      — search on term name + description
 *   letter — filter to a specific starting letter (e.g. ?letter=E)
 *   limit  — max results (default 200)
 *   offset — pagination offset (default 0)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesInCategory } from '@/lib/wiki/mdx-processor'
import { getArticleCountForEntity } from '@/lib/wiki/entity-article-index'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query = searchParams.get('q')?.toLowerCase()
  const letterFilter = searchParams.get('letter')?.toUpperCase()
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '200', 10), 500)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

  try {
    let terms = await getAllArticlesInCategory('glossary')

    if (query) {
      terms = terms.filter(
        (t) =>
          t.metadata.title?.toLowerCase().includes(query) ||
          t.metadata.description?.toLowerCase().includes(query)
      )
    }

    if (letterFilter) {
      terms = terms.filter((t) => {
        const first = (t.metadata.title?.[0] ?? t.slug[0]).toUpperCase()
        return first === letterFilter
      })
    }

    const total = terms.length
    const paginated = terms.slice(offset, offset + limit)

    return NextResponse.json(
      {
        terms: paginated.map((t) => ({
          term: t.metadata.title,
          slug: t.slug,
          description: t.metadata.description ?? null,
          keywords: t.metadata.keywords ?? [],
          articleCount: getArticleCountForEntity(t.slug),
          url: `${BASE_URL}/wiki/glossary/${t.slug}`,
        })),
        total,
        limit,
        offset,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('/api/glossary error:', err)
    return NextResponse.json({ error: 'Failed to load glossary' }, { status: 500 })
  }
}

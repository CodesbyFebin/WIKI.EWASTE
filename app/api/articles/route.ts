/**
 * GET /api/articles
 *
 * Returns the full article catalogue with metadata.
 * Used by AI assistants, the embedding pipeline, and internal tooling.
 *
 * Query parameters:
 *   category  — filter by category slug (e.g. ?category=compliance)
 *   tier      — filter by tier (e.g. ?tier=T1)
 *   q         — full-text search on title + description + keywords
 *   limit     — max results (default 100, max 500)
 *   offset    — pagination offset (default 0)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/wiki/mdx-processor'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const categoryFilter = searchParams.get('category')
  const tierFilter = searchParams.get('tier')
  const query = searchParams.get('q')?.toLowerCase()
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 500)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  try {
    let articles = await getAllArticles()

    if (categoryFilter) {
      articles = articles.filter((a) => a.category === categoryFilter)
    }

    if (tierFilter) {
      articles = articles.filter((a) => a.metadata.tier === tierFilter)
    }

    if (query) {
      articles = articles.filter(
        (a) =>
          a.metadata.title?.toLowerCase().includes(query) ||
          a.metadata.description?.toLowerCase().includes(query) ||
          a.metadata.keywords?.some((k) => k.toLowerCase().includes(query)) ||
          a.metadata.entities?.some((e) => e.toLowerCase().includes(query))
      )
    }

    const total = articles.length
    const paginated = articles.slice(offset, offset + limit)

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

    return NextResponse.json(
      {
        articles: paginated.map((a) => ({
          title: a.metadata.title,
          slug: a.slug,
          category: a.category,
          tier: a.metadata.tier,
          description: a.metadata.description,
          keywords: a.metadata.keywords ?? [],
          entities: a.metadata.entities ?? [],
          author: a.metadata.author,
          datePublished: a.metadata.datePublished,
          dateUpdated: a.metadata.dateUpdated,
          readTime: a.metadata.readTime,
          url: `${BASE_URL}/wiki/${a.category}/${a.slug}`,
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
    console.error('/api/articles error:', err)
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 })
  }
}

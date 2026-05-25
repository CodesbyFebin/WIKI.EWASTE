/**
 * GET /api/recent
 *
 * Returns articles sorted by dateUpdated (most recently updated first).
 * Useful for AI freshness recrawl signals, /updates feed, and "Recently Updated"
 * widgets.
 *
 * Query params:
 *   limit    — max results, default 20, max 100
 *   category — filter by category slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/wiki/mdx-processor'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)

  let articles = await getAllArticles()

  if (category) {
    articles = articles.filter((a) => a.category === category)
  }

  // Sort by dateUpdated → datePublished fallback
  articles.sort((a, b) => {
    const dateA = a.metadata.dateUpdated ?? a.metadata.datePublished ?? ''
    const dateB = b.metadata.dateUpdated ?? b.metadata.datePublished ?? ''
    return dateB.localeCompare(dateA)
  })

  const items = articles.slice(0, limit).map((a) => ({
    title: a.metadata.title,
    slug: a.slug,
    category: a.category,
    url: `/wiki/${a.category}/${a.slug}`,
    tier: a.metadata.tier,
    dateUpdated: a.metadata.dateUpdated,
    datePublished: a.metadata.datePublished,
    description: a.metadata.description,
    entities: a.metadata.entities ?? [],
  }))

  return NextResponse.json(
    { total: items.length, items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

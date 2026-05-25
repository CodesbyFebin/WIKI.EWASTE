/**
 * GET /api/snippets
 *
 * Returns all AIAnswer blocks extracted from MDX content.
 * These are retrieval-optimised answer units used for:
 *   - RAG pipelines
 *   - Featured snippet targeting
 *   - AI Overview bait
 *   - Embedding seed data
 *
 * Query params:
 *   type     — filter by AIAnswer type (faq | definition | howto | compliance-step)
 *   category — filter by source article category
 *   q        — keyword search in question + answer text
 *   limit    — default 50, max 200
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/wiki/mdx-processor'

export const dynamic = 'force-static'
export const revalidate = 3600

const AI_ANSWER_RE =
  /<AIAnswer\s+question="([^"]+)"(?:\s+type="([^"]+)")?[^>]*>([\s\S]*?)<\/AIAnswer>/g

interface Snippet {
  question: string
  answer: string
  type: string
  sourceUrl: string
  sourceTitle: string
  category: string
  entities: string[]
}

function extractSnippets(
  content: string,
  category: string,
  slug: string,
  title: string,
  entities: string[]
): Snippet[] {
  const snippets: Snippet[] = []
  let match: RegExpExecArray | null

  // Reset lastIndex before each use
  AI_ANSWER_RE.lastIndex = 0

  while ((match = AI_ANSWER_RE.exec(content)) !== null) {
    const question = match[1].trim()
    const type = match[2]?.trim() ?? 'faq'
    const rawAnswer = match[3]
      // Strip JSX tags (nested components, markdown)
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (question && rawAnswer.length >= 20) {
      snippets.push({
        question,
        answer: rawAnswer.slice(0, 1000), // cap for API response size
        type,
        sourceUrl: `/wiki/${category}/${slug}`,
        sourceTitle: title,
        category,
        entities,
      })
    }
  }

  return snippets
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const typeFilter = searchParams.get('type') ?? ''
  const categoryFilter = searchParams.get('category') ?? ''
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)

  const articles = await getAllArticles()
  const allSnippets: Snippet[] = []

  for (const article of articles) {
    if (categoryFilter && article.category !== categoryFilter) continue

    const snippets = extractSnippets(
      article.content,
      article.category,
      article.slug,
      article.metadata.title,
      article.metadata.entities ?? []
    )

    allSnippets.push(...snippets)
  }

  let filtered = allSnippets

  if (typeFilter) {
    filtered = filtered.filter((s) => s.type === typeFilter)
  }

  if (q) {
    filtered = filtered.filter(
      (s) =>
        s.question.toLowerCase().includes(q) ||
        s.answer.toLowerCase().includes(q)
    )
  }

  const items = filtered.slice(0, limit)

  return NextResponse.json(
    { total: filtered.length, items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

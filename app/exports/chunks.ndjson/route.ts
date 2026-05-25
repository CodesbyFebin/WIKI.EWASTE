/**
 * GET /exports/chunks.ndjson
 *
 * Semantic chunk export in newline-delimited JSON format.
 * Each line is a self-contained chunk ready for embedding.
 *
 * Chunk strategy:
 *   - Split articles at H2 headings
 *   - Include article-level entities on every chunk (for retrieval context)
 *   - Include heading path for positional context
 *   - Cap chunks at ~800 words to stay within embedding model limits
 *
 * Query params:
 *   category — filter by source category
 *   tier     — filter by article tier (T1, T2, T3, ...)
 *   minWords — minimum chunk word count (default 30)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/wiki/mdx-processor'

export const dynamic = 'force-static'
export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'
const MAX_WORDS = 800
const HEADING_RE = /^(#{1,3})\s+(.+)$/m

interface Chunk {
  id: string
  text: string
  heading: string
  headingLevel: number
  sourceUrl: string
  sourceTitle: string
  category: string
  slug: string
  tier: string
  entities: string[]
  wordCount: number
  chunkIndex: number
}

function splitIntoChunks(
  content: string,
  category: string,
  slug: string,
  title: string,
  tier: string,
  entities: string[],
  minWords: number
): Chunk[] {
  // Remove MDX/JSX components and frontmatter artifacts
  const cleaned = content
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // remove JSX components
    .replace(/<[^>]+\/>/g, '')                            // self-closing tags
    .replace(/```[\s\S]*?```/g, '[code block]')           // code blocks → placeholder

  // Split at H2/H3 boundaries
  const sections = cleaned.split(/^(?=#{1,3}\s)/m).filter(Boolean)
  const chunks: Chunk[] = []
  const sourceUrl = `${BASE_URL}/wiki/${category}/${slug}`

  // First section (before any heading — intro)
  let chunkIndex = 0

  for (const section of sections) {
    const headingMatch = section.match(HEADING_RE)
    const heading = headingMatch ? headingMatch[2].trim() : title
    const headingLevel = headingMatch ? headingMatch[1].length : 1

    // Strip the heading line from the text body
    const body = section.replace(HEADING_RE, '').trim()

    if (!body) continue

    const words = body.split(/\s+/).filter(Boolean)
    if (words.length < minWords) continue

    // If over limit, split into sub-chunks at paragraph boundaries
    if (words.length > MAX_WORDS) {
      const paragraphs = body.split(/\n\n+/).filter((p) => p.trim())
      let buffer = ''
      let bufWords = 0

      for (const para of paragraphs) {
        const paraWords = para.split(/\s+/).filter(Boolean).length
        if (bufWords + paraWords > MAX_WORDS && buffer) {
          if (bufWords >= minWords) {
            chunks.push({
              id: `${category}/${slug}#${chunkIndex}`,
              text: buffer.trim(),
              heading,
              headingLevel,
              sourceUrl,
              sourceTitle: title,
              category,
              slug,
              tier,
              entities,
              wordCount: bufWords,
              chunkIndex: chunkIndex++,
            })
          }
          buffer = para
          bufWords = paraWords
        } else {
          buffer += (buffer ? '\n\n' : '') + para
          bufWords += paraWords
        }
      }

      if (buffer.trim() && bufWords >= minWords) {
        chunks.push({
          id: `${category}/${slug}#${chunkIndex}`,
          text: buffer.trim(),
          heading,
          headingLevel,
          sourceUrl,
          sourceTitle: title,
          category,
          slug,
          tier,
          entities,
          wordCount: bufWords,
          chunkIndex: chunkIndex++,
        })
      }
    } else {
      chunks.push({
        id: `${category}/${slug}#${chunkIndex}`,
        text: body,
        heading,
        headingLevel,
        sourceUrl,
        sourceTitle: title,
        category,
        slug,
        tier,
        entities,
        wordCount: words.length,
        chunkIndex: chunkIndex++,
      })
    }
  }

  return chunks
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const categoryFilter = searchParams.get('category') ?? ''
  const tierFilter = searchParams.get('tier') ?? ''
  const minWords = parseInt(searchParams.get('minWords') ?? '30', 10)

  const articles = await getAllArticles()
  const lines: string[] = []

  for (const article of articles) {
    if (categoryFilter && article.category !== categoryFilter) continue
    if (tierFilter && article.metadata.tier !== tierFilter) continue

    const chunks = splitIntoChunks(
      article.content,
      article.category,
      article.slug,
      article.metadata.title,
      article.metadata.tier ?? 'T3',
      article.metadata.entities ?? [],
      minWords
    )

    for (const chunk of chunks) {
      lines.push(JSON.stringify(chunk))
    }
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

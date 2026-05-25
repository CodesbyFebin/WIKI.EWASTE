/**
 * Tier 1 chunking — AIAnswer blocks.
 *
 * AIAnswer blocks are the highest-precision retrieval units:
 * they are explicitly structured Q&A with a known question string,
 * making them perfect featured-snippet and RAG targets.
 */

import type { SemanticChunk } from './types'

const AI_ANSWER_RE =
  /<AIAnswer\s+question="([^"]+)"(?:\s+type="([^"]+)")?[^>]*>([\s\S]*?)<\/AIAnswer>/g

function stripMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')      // HTML/JSX tags
    .replace(/\*\*/g, '')         // bold
    .replace(/\*/g, '')           // italic
    .replace(/`([^`]+)`/g, '$1')  // inline code
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function extractAiAnswerChunks(
  content: string,
  category: string,
  slug: string,
  title: string,
  tier: string,
  entities: string[],
  updatedAt: string,
  baseUrl: string
): SemanticChunk[] {
  const chunks: SemanticChunk[] = []
  let match: RegExpExecArray | null
  let index = 0

  AI_ANSWER_RE.lastIndex = 0

  while ((match = AI_ANSWER_RE.exec(content)) !== null) {
    const question = match[1].trim()
    const type = match[2]?.trim() ?? 'faq'
    const rawBody = match[3]
    const body = stripMarkup(rawBody)

    if (!question || body.length < 20) continue

    chunks.push({
      id: `${category}/${slug}#ai-${index++}`,
      title,
      heading: question,
      content: `Q: ${question}\n\nA: ${body}`.slice(0, 2000),
      entities,
      category,
      tier,
      url: `${baseUrl}/wiki/${category}/${slug}`,
      sourceType: 'ai-answer',
      updatedAt,
      authorityScore: 0,
      wordCount: body.split(/\s+/).length,
    })
  }

  return chunks
}

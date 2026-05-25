/**
 * Tier 3 chunking — H2/H3 semantic sections.
 *
 * Splits MDX content at heading boundaries into self-contained
 * semantic units. Falls back to paragraph batching if a section
 * exceeds MAX_WORDS.
 */

import type { SemanticChunk } from './types'

const MAX_WORDS = 700
const MIN_WORDS = 30

function stripMdx(text: string): string {
  return text
    .replace(/<AIAnswer[\s\S]*?<\/AIAnswer>/g, '')  // remove AIAnswer (handled separately)
    .replace(/<[A-Z][^>]*\/>/g, '')                 // self-closing JSX
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim()
}

interface Section {
  heading: string
  level: 2 | 3
  body: string
}

function parseSections(content: string): Section[] {
  const cleaned = stripMdx(content)
  const sections: Section[] = []

  // Split at H2 or H3 boundaries
  const parts = cleaned.split(/^(?=#{2,3}\s)/m).filter(Boolean)

  for (const part of parts) {
    const headingMatch = part.match(/^(#{2,3})\s+(.+)$/)
    const heading = headingMatch ? headingMatch[2].trim() : ''
    const level: 2 | 3 = headingMatch ? (headingMatch[1].length as 2 | 3) : 2
    const body = part.replace(/^#{2,3}\s+.+$\n?/m, '').trim()
    if (body.length >= 20) sections.push({ heading, level, body })
  }

  return sections
}

function splitByParagraphs(
  body: string,
  heading: string,
  level: 2 | 3,
  baseId: string,
  meta: Omit<SemanticChunk, 'id' | 'heading' | 'content' | 'wordCount' | 'sourceType'>
): SemanticChunk[] {
  const chunks: SemanticChunk[] = []
  const paras = body.split(/\n\n+/).filter((p) => p.trim().length > 0)
  let buffer = ''
  let bufWords = 0
  let idx = 0

  for (const para of paras) {
    const words = para.split(/\s+/).length
    if (bufWords + words > MAX_WORDS && buffer) {
      if (bufWords >= MIN_WORDS) {
        chunks.push({
          ...meta,
          id: `${baseId}-${idx++}`,
          heading,
          content: buffer.trim(),
          wordCount: bufWords,
          sourceType: level === 2 ? 'h2-section' : 'h3-section',
        })
      }
      buffer = para
      bufWords = words
    } else {
      buffer += (buffer ? '\n\n' : '') + para
      bufWords += words
    }
  }

  if (buffer.trim() && bufWords >= MIN_WORDS) {
    chunks.push({
      ...meta,
      id: `${baseId}-${idx}`,
      heading,
      content: buffer.trim(),
      wordCount: bufWords,
      sourceType: level === 2 ? 'h2-section' : 'h3-section',
    })
  }

  return chunks
}

export function extractHeadingChunks(
  content: string,
  category: string,
  slug: string,
  title: string,
  tier: string,
  entities: string[],
  updatedAt: string,
  baseUrl: string
): SemanticChunk[] {
  const sections = parseSections(content)
  const url = `${baseUrl}/wiki/${category}/${slug}`
  const meta = { title, entities, category, tier, url, updatedAt, authorityScore: 0 }
  const chunks: SemanticChunk[] = []

  sections.forEach((section, sectionIdx) => {
    const words = section.body.split(/\s+/).length
    const baseId = `${category}/${slug}#h${sectionIdx}`

    if (words <= MAX_WORDS) {
      if (words >= MIN_WORDS) {
        chunks.push({
          ...meta,
          id: baseId,
          heading: section.heading || title,
          content: section.body,
          wordCount: words,
          sourceType: section.level === 2 ? 'h2-section' : 'h3-section',
        })
      }
    } else {
      // Fallback: split by paragraphs
      chunks.push(
        ...splitByParagraphs(section.body, section.heading || title, section.level, baseId, meta)
      )
    }
  })

  return chunks
}

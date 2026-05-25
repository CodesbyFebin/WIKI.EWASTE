/**
 * Tier 2 chunking — Glossary definitions + Entity definitions.
 *
 * These are canonical ontology nodes: the authoritative single-paragraph
 * definition of a term or entity. Ideal for direct answer retrieval.
 */

import type { SemanticChunk } from './types'
import { semanticGraph } from '@/lib/wiki/entity-graph'

function stripMdx(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // strip links
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Chunk for each semantic entity in the graph */
export function buildEntityChunks(baseUrl: string): SemanticChunk[] {
  return Object.values(semanticGraph).map((entity) => ({
    id: `entity/${entity.id}`,
    title: entity.name,
    heading: `${entity.name} — Definition`,
    content: `${entity.name} (${entity.type}): ${entity.description}. Related entities: ${entity.relatedEntities.join(', ')}.`,
    entities: [entity.id, ...entity.relatedEntities],
    category: 'entities',
    tier: 'T1',
    url: `${baseUrl}/wiki/glossary/${entity.id}`,
    sourceType: 'entity-definition' as const,
    updatedAt: new Date().toISOString().slice(0, 10),
    authorityScore: 0,
    wordCount: entity.description.split(/\s+/).length,
  }))
}

/** Chunk for a single glossary article */
export function buildGlossaryChunk(
  slug: string,
  title: string,
  description: string,
  content: string,
  entities: string[],
  updatedAt: string,
  baseUrl: string
): SemanticChunk {
  // Use first 600 words of stripped content as the definition body
  const body = stripMdx(content)
  const words = body.split(/\s+/).filter(Boolean)
  const truncated = words.slice(0, 600).join(' ')

  return {
    id: `glossary/${slug}#definition`,
    title,
    heading: `${title} — Definition`,
    content: description ? `${description}\n\n${truncated}` : truncated,
    entities,
    category: 'glossary',
    tier: 'T2',
    url: `${baseUrl}/wiki/glossary/${slug}`,
    sourceType: 'glossary-definition',
    updatedAt,
    authorityScore: 0,
    wordCount: Math.min(words.length, 600),
  }
}

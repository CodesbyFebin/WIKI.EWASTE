/**
 * Pure vector search — wraps Qdrant.
 *
 * Takes a query string, generates its embedding, and returns
 * the closest chunks from the vector store.
 */

import { embedQuery } from '@/lib/vector/embeddings'
import { searchPoints, DEFAULT_COLLECTION } from '@/lib/vector/qdrant'
import type { SemanticChunk } from '@/lib/chunking/types'

export interface VectorSearchResult {
  chunk: SemanticChunk
  vectorScore: number
}

export interface SemanticSearchOptions {
  limit?:    number
  category?: string
  tier?:     string
  sourceType?: string
}

function buildFilter(opts: SemanticSearchOptions): Record<string, unknown> | undefined {
  const conditions: Record<string, unknown>[] = []

  if (opts.category) {
    conditions.push({ key: 'category', match: { value: opts.category } })
  }
  if (opts.tier) {
    conditions.push({ key: 'tier', match: { value: opts.tier } })
  }
  if (opts.sourceType) {
    conditions.push({ key: 'sourceType', match: { value: opts.sourceType } })
  }

  if (conditions.length === 0) return undefined
  return conditions.length === 1 ? { must: conditions } : { must: conditions }
}

export async function semanticSearch(
  query: string,
  options: SemanticSearchOptions = {}
): Promise<VectorSearchResult[]> {
  const limit = options.limit ?? 20
  const queryVec = await embedQuery(query)
  const filter = buildFilter(options)

  const results = await searchPoints(
    DEFAULT_COLLECTION,
    queryVec,
    limit,
    filter
  )

  return results.map((r) => ({
    chunk: r.payload as unknown as SemanticChunk,
    vectorScore: Math.max(0, Math.min(1, r.score)),
  }))
}

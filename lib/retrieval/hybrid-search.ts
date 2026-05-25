/**
 * Hybrid search orchestrator.
 *
 * Full pipeline:
 *   1. Detect entities + localities in the query
 *   2. Fetch vector search results from Qdrant
 *   3. Score results against BM25 index
 *   4. Apply hybrid reranking (formula in hybrid-rank.ts)
 *   5. Return ranked results with full score breakdown
 */

import { semanticSearch } from './semantic-search'
import { getBM25Index } from '@/lib/search/bm25'
import { rerankResults, type RankedResult } from './rerank'

export interface HybridSearchOptions {
  limit?:         number
  category?:      string
  tier?:          string
  sourceType?:    string
}

export type { RankedResult }

export async function hybridSearch(
  query: string,
  options: HybridSearchOptions = {}
): Promise<RankedResult[]> {
  if (!query.trim()) return []

  const topK   = options.limit ?? 10
  const fetchK = topK * 3  // over-fetch for reranking

  // Run vector search and BM25 in parallel
  const [vectorResults, bm25Index] = await Promise.all([
    semanticSearch(query, { ...options, limit: fetchK }),
    getBM25Index(),
  ])

  const bm25Results = bm25Index.search(query, fetchK)

  return rerankResults(vectorResults, bm25Results, query, topK)
}

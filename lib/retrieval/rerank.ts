/**
 * Reranking — merges vector results with BM25 and boost signals.
 *
 * Takes vector search results (already scored 0–1) and applies
 * the hybrid formula to produce a final ordered result set.
 */

import type { VectorSearchResult } from './semantic-search'
import type { BM25Result } from '@/lib/search/bm25'
import { getAuthorityScore } from '@/lib/authority/entity-score'
import {
  computeEntityBoost,
  computeLocalityBoost,
  detectQueryEntities,
  detectQueryLocality,
} from '@/lib/search/entity-boost'
import { hybridScore, computeFreshnessBoost } from '@/lib/search/hybrid-rank'

export interface RankedResult {
  chunk: VectorSearchResult['chunk']
  finalScore: number
  vectorScore: number
  bm25Score: number
  authorityScore: number
  entityBoost: number
  freshnessBoost: number
  localityBoost: number
}

export function rerankResults(
  vectorResults: VectorSearchResult[],
  bm25Results: BM25Result[],
  query: string,
  topK = 10
): RankedResult[] {
  const bm25Map = new Map(bm25Results.map((r) => [r.id, r.score]))
  const queryEntities = detectQueryEntities(query)
  const queryLocalities = detectQueryLocality(query)

  const ranked: RankedResult[] = vectorResults.map((vr) => {
    const chunk = vr.chunk
    const docId = `${chunk.category}/${chunk.id.split('/').slice(-1)[0]}`

    const bm25Score      = bm25Map.get(`${chunk.category}/${chunk.id.split('#')[0].split('/').slice(1).join('/')}`) ?? 0
    const authorityScore = getAuthorityScore(chunk.entities[0] ?? '') ||
                           Math.max(...chunk.entities.map((e) => getAuthorityScore(e)), 0)
    const entityBoost    = computeEntityBoost(chunk.entities, queryEntities)
    const freshnessBoost = computeFreshnessBoost(chunk.updatedAt, chunk.category)
    const localityBoost  = computeLocalityBoost(chunk.url, chunk.category, queryLocalities)

    const finalScore = hybridScore({
      vectorSimilarity: vr.vectorScore,
      bm25Score,
      authorityScore,
      entityBoost,
      freshnessBoost,
      localityBoost,
    })

    return {
      chunk,
      finalScore,
      vectorScore: vr.vectorScore,
      bm25Score,
      authorityScore,
      entityBoost,
      freshnessBoost,
      localityBoost,
    }
  })

  return ranked
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topK)
}

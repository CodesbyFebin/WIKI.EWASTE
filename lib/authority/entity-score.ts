/**
 * Composite entity authority score.
 *
 * Combines graph metrics + article references into a single [0, 1] score.
 *
 * Formula:
 *   authority = (pageRank × 0.35) + (normArticleCount × 0.35) + (degree × 0.15) + (typeWeight × 0.15)
 *
 * Type weights reflect information hierarchy:
 *   legislation > standard > organization > concept > process > material > location
 */

import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getArticleCountForEntity } from '@/lib/wiki/entity-article-index'
import { getPageRankScores, computeDegree, getEntityGraph } from './graph-metrics'

const TYPE_WEIGHT: Record<string, number> = {
  legislation:  1.0,
  standard:     0.85,
  organization: 0.75,
  concept:      0.65,
  process:      0.50,
  material:     0.35,
  location:     0.25,
}

// ── Singleton cache ───────────────────────────────────────────────────────────

let _scores: Record<string, number> | null = null

export function computeAuthorityScores(): Record<string, number> {
  if (_scores) return _scores

  const entities = Object.values(semanticGraph)
  const pageRank = getPageRankScores()
  const degree = computeDegree(getEntityGraph())

  // Normalise article count to [0, 1]
  const counts = entities.map((e) => getArticleCountForEntity(e.id))
  const maxCount = Math.max(...counts, 1)

  _scores = {}

  for (const entity of entities) {
    const pr = pageRank[entity.id] ?? 0
    const ac = getArticleCountForEntity(entity.id) / maxCount
    const deg = degree[entity.id] ?? 0
    const tw = TYPE_WEIGHT[entity.type] ?? 0.5

    _scores[entity.id] =
      pr  * 0.35 +
      ac  * 0.35 +
      deg * 0.15 +
      tw  * 0.15
  }

  return _scores
}

/** Get authority score for a single entity (0–1). */
export function getAuthorityScore(entityId: string): number {
  return computeAuthorityScores()[entityId] ?? 0
}

/**
 * Get authority score for a chunk given its entity list.
 * Returns max score among all associated entities.
 */
export function getChunkAuthorityScore(entityIds: string[]): number {
  if (entityIds.length === 0) return 0
  const scores = computeAuthorityScores()
  return Math.max(...entityIds.map((id) => scores[id] ?? 0))
}

/** Reset cache (call after content updates). */
export function resetAuthorityCache(): void {
  _scores = null
}

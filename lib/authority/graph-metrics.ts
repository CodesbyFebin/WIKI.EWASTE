/**
 * Graph-theoretic metrics over the entity co-occurrence graph.
 *
 * Computes PageRank, in-degree, and clustering coefficient.
 * Used as inputs to the composite authority score.
 */

import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getCoMentionedEntities, getArticleCountForEntity } from '@/lib/wiki/entity-article-index'

export type AdjacencyMap = Map<string, Set<string>>

// ── Adjacency construction ────────────────────────────────────────────────────

/**
 * Builds a directed adjacency map from entity co-occurrence.
 * Each entity points to entities it co-occurs with (both directions).
 */
export function buildCoOccurrenceGraph(): AdjacencyMap {
  const graph: AdjacencyMap = new Map()
  const entityIds = Object.keys(semanticGraph)

  for (const id of entityIds) {
    if (!graph.has(id)) graph.set(id, new Set())
    const coMentioned = getCoMentionedEntities(id, 20)
    for (const relId of coMentioned) {
      graph.get(id)!.add(relId)
      if (!graph.has(relId)) graph.set(relId, new Set())
      graph.get(relId)!.add(id)
    }
    // Also include explicitly declared related entities
    const entity = semanticGraph[id]
    if (entity) {
      for (const relId of entity.relatedEntities) {
        if (semanticGraph[relId]) {
          graph.get(id)!.add(relId)
          if (!graph.has(relId)) graph.set(relId, new Set())
          graph.get(relId)!.add(id)
        }
      }
    }
  }

  return graph
}

// ── PageRank ─────────────────────────────────────────────────────────────────

/**
 * Power-iteration PageRank.
 *
 * @param graph   Adjacency map (undirected — each edge appears in both directions)
 * @param damping Damping factor (default 0.85)
 * @param iters   Number of iterations (default 50)
 * @returns       Record<entityId, rank> normalised to [0, 1]
 */
export function computePageRank(
  graph: AdjacencyMap,
  damping = 0.85,
  iters = 50
): Record<string, number> {
  const nodes = Array.from(graph.keys())
  const N = nodes.length
  if (N === 0) return {}

  const rank: Record<string, number> = {}
  const initial = 1 / N
  for (const n of nodes) rank[n] = initial

  for (let iter = 0; iter < iters; iter++) {
    const next: Record<string, number> = {}
    for (const n of nodes) next[n] = (1 - damping) / N

    for (const n of nodes) {
      const outLinks = graph.get(n)!
      if (outLinks.size === 0) {
        // Dangling node — distribute rank uniformly
        const share = (damping * rank[n]) / N
        for (const m of nodes) next[m] += share
      } else {
        const share = (damping * rank[n]) / outLinks.size
        for (const m of outLinks) {
          if (next[m] !== undefined) next[m] += share
        }
      }
    }

    // Convergence check
    let delta = 0
    for (const n of nodes) delta += Math.abs(next[n] - rank[n])
    Object.assign(rank, next)
    if (delta < 1e-6) break
  }

  // Normalise to [0, 1]
  const max = Math.max(...Object.values(rank)) || 1
  for (const n of nodes) rank[n] = rank[n] / max

  return rank
}

// ── Degree metrics ────────────────────────────────────────────────────────────

export function computeDegree(graph: AdjacencyMap): Record<string, number> {
  const degree: Record<string, number> = {}
  const max = Math.max(...Array.from(graph.values()).map((s) => s.size)) || 1
  for (const [node, neighbours] of graph.entries()) {
    degree[node] = neighbours.size / max
  }
  return degree
}

/**
 * Local clustering coefficient: fraction of neighbours that are
 * also connected to each other.
 */
export function computeClusteringCoefficient(graph: AdjacencyMap): Record<string, number> {
  const coeff: Record<string, number> = {}

  for (const [node, neighbours] of graph.entries()) {
    const nb = Array.from(neighbours)
    const k = nb.length
    if (k < 2) {
      coeff[node] = 0
      continue
    }
    let edges = 0
    for (let i = 0; i < nb.length; i++) {
      for (let j = i + 1; j < nb.length; j++) {
        if (graph.get(nb[i])?.has(nb[j])) edges++
      }
    }
    coeff[node] = (2 * edges) / (k * (k - 1))
  }

  return coeff
}

// ── Cached graph (singleton) ─────────────────────────────────────────────────

let _cachedGraph: AdjacencyMap | null = null
let _cachedPageRank: Record<string, number> | null = null

export function getEntityGraph(): AdjacencyMap {
  if (!_cachedGraph) _cachedGraph = buildCoOccurrenceGraph()
  return _cachedGraph
}

export function getPageRankScores(): Record<string, number> {
  if (!_cachedPageRank) {
    _cachedPageRank = computePageRank(getEntityGraph())
  }
  return _cachedPageRank
}

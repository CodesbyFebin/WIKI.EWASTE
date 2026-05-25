/**
 * Community detection via label propagation.
 *
 * Label propagation is O(E) per iteration — much faster than Louvain
 * while producing comparable community quality for graphs of this size.
 *
 * The result is a mapping: entityId → clusterName.
 * Cluster names are inferred from the highest-authority entity in each group.
 */

import { semanticGraph } from '@/lib/wiki/entity-graph'
import { getEntityGraph } from './graph-metrics'
import { getAuthorityScore } from './entity-score'

// ── Label propagation ─────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function runLabelPropagation(
  iterations = 20
): Record<string, string> {
  const graph = getEntityGraph()
  const nodes = Array.from(graph.keys())

  // Initialise: each node is its own label
  const labels: Record<string, string> = {}
  for (const n of nodes) labels[n] = n

  for (let iter = 0; iter < iterations; iter++) {
    let changed = false

    for (const node of shuffle(nodes)) {
      const neighbours = graph.get(node)!
      if (neighbours.size === 0) continue

      // Count label frequencies among neighbours, weighted by authority
      const labelCount: Record<string, number> = {}
      for (const nb of neighbours) {
        const lbl = labels[nb]
        const w = getAuthorityScore(nb) + 0.1  // +0.1 so 0-score nodes still vote
        labelCount[lbl] = (labelCount[lbl] ?? 0) + w
      }

      // Pick the most common label (ties broken by current label)
      let bestLabel = labels[node]
      let bestScore = -1
      for (const [lbl, score] of Object.entries(labelCount)) {
        if (score > bestScore || (score === bestScore && lbl < bestLabel)) {
          bestScore = score
          bestLabel = lbl
        }
      }

      if (bestLabel !== labels[node]) {
        labels[node] = bestLabel
        changed = true
      }
    }

    if (!changed) break
  }

  return labels
}

// ── Cluster naming ────────────────────────────────────────────────────────────

const CLUSTER_NAMES: Record<string, string> = {
  'weee-rules':           'compliance',
  'epr':                  'compliance',
  'cpcb':                 'compliance',
  'kspcb':                'compliance',
  'dpdp':                 'data-security',
  'nist-800-88':          'data-security',
  'itad':                 'data-security',
  'iso-27001':            'data-security',
  'circular-economy':     'circular-economy',
  'iso-14001':            'circular-economy',
  'esg-reporting':        'esg',
  'cobalt':               'materials',
  'lithium':              'materials',
  'lead':                 'materials',
  'kochi':                'localities',
  'kerala':               'localities',
}

/**
 * Map a cluster representative ID to a human-readable cluster name.
 * Falls back to the entity name if not in the lookup table.
 */
function clusterName(representativeId: string): string {
  if (CLUSTER_NAMES[representativeId]) return CLUSTER_NAMES[representativeId]
  const entity = semanticGraph[representativeId]
  if (!entity) return representativeId
  // Use type as fallback cluster name
  return entity.type
}

// ── Singleton cache ───────────────────────────────────────────────────────────

let _clusterMap: Map<string, string[]> | null = null
let _entityCluster: Record<string, string> | null = null

export function getClusters(): Map<string, string[]> {
  if (_clusterMap) return _clusterMap

  const labels = runLabelPropagation()

  // Group entities by label
  const byLabel = new Map<string, string[]>()
  for (const [entityId, label] of Object.entries(labels)) {
    if (!byLabel.has(label)) byLabel.set(label, [])
    byLabel.get(label)!.push(entityId)
  }

  // Rename clusters by most-authoritative representative
  _clusterMap = new Map()
  _entityCluster = {}

  for (const [label, members] of byLabel.entries()) {
    const representative = members.sort(
      (a, b) => getAuthorityScore(b) - getAuthorityScore(a)
    )[0]
    const name = clusterName(representative)
    _clusterMap.set(name, members)
    for (const m of members) {
      _entityCluster![m] = name
    }
  }

  return _clusterMap
}

export function getEntityCluster(entityId: string): string | null {
  getClusters() // ensure cache is warm
  return _entityCluster?.[entityId] ?? null
}

export function resetClusterCache(): void {
  _clusterMap = null
  _entityCluster = null
}

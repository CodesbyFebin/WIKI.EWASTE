/**
 * Entity and locality boost computation.
 *
 * Detects known entities and Kerala localities in queries, then scores
 * chunks by how well their entity list matches the query intent.
 *
 * This is crucial for EWasteKochi because:
 *   - "CPCB registration" should surface CPCB-tagged content first
 *   - "battery recycling in kochi" should surface Kochi/Kerala content
 */

import { semanticGraph } from '@/lib/wiki/entity-graph'

// ── Entity detection ─────────────────────────────────────────────────────────

// Build lookup: lowercase term → entity ID, sorted longest-first to prefer specific matches
const _entityLookup = new Map<string, string>()

for (const entity of Object.values(semanticGraph)) {
  _entityLookup.set(entity.name.toLowerCase(), entity.id)
  _entityLookup.set(entity.id.toLowerCase(), entity.id)
  _entityLookup.set(entity.id.replace(/-/g, ' ').toLowerCase(), entity.id)
}

// Manual aliases for common abbreviations
const QUERY_ALIASES: Record<string, string> = {
  'cpcb':          'cpcb',
  'kspcb':         'kspcb',
  'epr':           'epr',
  'itad':          'itad',
  'nist':          'nist-800-88',
  'nist 800':      'nist-800-88',
  'iso 14001':     'iso-14001',
  'iso 27001':     'iso-27001',
  'weee':          'weee-rules',
  'e-waste rules': 'weee-rules',
  'dpdp':          'dpdp',
  'circular economy': 'circular-economy',
}

export function detectQueryEntities(query: string): string[] {
  const lower = query.toLowerCase()
  const found = new Set<string>()

  // Check aliases first (longest first via sort)
  for (const [alias, id] of Object.entries(QUERY_ALIASES)) {
    if (lower.includes(alias)) found.add(id)
  }

  // Check entity names / IDs
  for (const [term, id] of _entityLookup.entries()) {
    if (lower.includes(term)) found.add(id)
  }

  return Array.from(found)
}

// ── Locality detection ────────────────────────────────────────────────────────

const KERALA_LOCALITIES = [
  'kochi', 'cochin', 'ernakulam', 'kerala', 'thrissur', 'kozhikode', 'calicut',
  'thiruvananthapuram', 'trivandrum', 'kollam', 'alappuzha', 'alleppey',
  'palakkad', 'malappuram', 'kannur', 'kasaragod', 'kottayam', 'pathanamthitta',
  'idukki', 'kakkanad', 'edappally', 'lulu',
]

export function detectQueryLocality(query: string): string[] {
  const lower = query.toLowerCase()
  return KERALA_LOCALITIES.filter((loc) => lower.includes(loc))
}

// ── Boost computation ─────────────────────────────────────────────────────────

/**
 * Entity boost: fraction of query entities present in chunk entities.
 * Returns 0 if no query entities detected.
 */
export function computeEntityBoost(
  chunkEntities: string[],
  queryEntities: string[]
): number {
  if (queryEntities.length === 0) return 0
  const chunkSet = new Set(chunkEntities)
  const matches = queryEntities.filter((e) => chunkSet.has(e)).length
  return matches / queryEntities.length
}

/**
 * Locality boost: 1.0 if chunk is in localities category, 0.5 if url contains
 * a matched locality, 0 otherwise.
 */
export function computeLocalityBoost(
  chunkUrl: string,
  chunkCategory: string,
  queryLocalities: string[]
): number {
  if (queryLocalities.length === 0) return 0
  if (chunkCategory === 'localities') return 1.0
  const urlLower = chunkUrl.toLowerCase()
  const matches = queryLocalities.filter((loc) => urlLower.includes(loc)).length
  return matches > 0 ? 0.5 : 0
}

/**
 * Hybrid ranking score formula.
 *
 * finalScore =
 *   (vectorSimilarity × 0.40)
 * + (bm25Score        × 0.25)
 * + (authorityScore   × 0.15)
 * + (entityBoost      × 0.10)
 * + (freshnessBoost   × 0.05)
 * + (localityBoost    × 0.05)
 *
 * All inputs must be normalised to [0, 1].
 *
 * Freshness uses exponential decay:
 *   freshness = e^(-daysSinceUpdate / decayFactor)
 *
 * Decay factors by content type:
 *   - regulation / compliance → slow decay (365 days)
 *   - general wiki            → medium decay (180 days)
 *   - news / recent events    → fast decay (30 days)
 */

export interface HybridScoreParams {
  vectorSimilarity: number
  bm25Score:        number
  authorityScore:   number
  entityBoost:      number
  freshnessBoost:   number
  localityBoost:    number
}

const WEIGHTS = {
  vector:    0.40,
  bm25:      0.25,
  authority: 0.15,
  entity:    0.10,
  freshness: 0.05,
  locality:  0.05,
} as const

export function hybridScore(params: HybridScoreParams): number {
  return (
    params.vectorSimilarity * WEIGHTS.vector +
    params.bm25Score        * WEIGHTS.bm25 +
    params.authorityScore   * WEIGHTS.authority +
    params.entityBoost      * WEIGHTS.entity +
    params.freshnessBoost   * WEIGHTS.freshness +
    params.localityBoost    * WEIGHTS.locality
  )
}

const DECAY_FACTOR: Record<string, number> = {
  compliance:        365,
  'data-destruction': 180,
  itad:              180,
  recycling:         180,
  materials:         365,
  localities:        180,
  esg:               90,
  glossary:          365,
  default:           180,
}

/**
 * Compute freshness boost.
 * Returns 1.0 for content updated today, decays exponentially.
 */
export function computeFreshnessBoost(
  updatedAt: string | null | undefined,
  category = 'default'
): number {
  if (!updatedAt) return 0.3 // unknown freshness → partial credit

  let days: number
  try {
    const msAgo = Date.now() - new Date(updatedAt).getTime()
    days = Math.max(0, msAgo / (1000 * 60 * 60 * 24))
  } catch {
    return 0.3
  }

  const factor = DECAY_FACTOR[category] ?? DECAY_FACTOR.default
  return Math.exp(-days / factor)
}

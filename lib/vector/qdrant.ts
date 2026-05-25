/**
 * Qdrant REST API client.
 *
 * No SDK — raw fetch only.
 *
 * Required env vars:
 *   QDRANT_URL      — e.g. https://your-cluster.qdrant.io:6333  (or http://localhost:6333)
 *   QDRANT_API_KEY  — required for Qdrant Cloud, optional for local
 *
 * Collection convention: one collection per environment.
 *   Default: "ewaste_wiki"
 */

const QDRANT_URL = () => {
  const url = process.env.QDRANT_URL
  if (!url) throw new Error('QDRANT_URL is not set')
  return url.replace(/\/$/, '')
}

function qdrantHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = process.env.QDRANT_API_KEY
  if (key) h['api-key'] = key
  return h
}

export const DEFAULT_COLLECTION = 'ewaste_wiki'

// ── Types ────────────────────────────────────────────────────────────────────

export interface QdrantPoint {
  id: string
  vector: number[]
  payload: Record<string, unknown>
}

export interface QdrantSearchResult {
  id: string
  score: number
  payload: Record<string, unknown>
}

// ── Collection management ────────────────────────────────────────────────────

export async function ensureCollection(
  name: string,
  vectorSize: number,
  distance: 'Cosine' | 'Dot' | 'Euclid' = 'Cosine'
): Promise<void> {
  const base = QDRANT_URL()

  // Check if collection exists
  const check = await fetch(`${base}/collections/${name}`, {
    headers: qdrantHeaders(),
  })

  if (check.status === 200) return // already exists

  // Create it
  const res = await fetch(`${base}/collections/${name}`, {
    method: 'PUT',
    headers: qdrantHeaders(),
    body: JSON.stringify({
      vectors: {
        size: vectorSize,
        distance,
      },
      hnsw_config: {
        m: 16,
        ef_construct: 100,
      },
      optimizers_config: {
        indexing_threshold: 10000,
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to create Qdrant collection "${name}": ${res.status} ${body}`)
  }

  console.log(`[qdrant] Created collection "${name}" (${vectorSize}d, ${distance})`)
}

// ── Point operations ─────────────────────────────────────────────────────────

/** Upsert in batches of 100 points. */
export async function upsertPoints(
  collection: string,
  points: QdrantPoint[],
  batchSize = 100
): Promise<void> {
  if (points.length === 0) return
  const base = QDRANT_URL()

  for (let i = 0; i < points.length; i += batchSize) {
    const batch = points.slice(i, i + batchSize)
    const res = await fetch(`${base}/collections/${collection}/points?wait=true`, {
      method: 'PUT',
      headers: qdrantHeaders(),
      body: JSON.stringify({
        points: batch.map((p) => ({
          id: stableId(p.id),
          vector: p.vector,
          payload: p.payload,
        })),
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Qdrant upsert failed: ${res.status} ${body}`)
    }
  }
}

export async function deletePoints(
  collection: string,
  ids: string[]
): Promise<void> {
  if (ids.length === 0) return
  const base = QDRANT_URL()

  const res = await fetch(`${base}/collections/${collection}/points/delete?wait=true`, {
    method: 'POST',
    headers: qdrantHeaders(),
    body: JSON.stringify({ points: ids.map(stableId) }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Qdrant delete failed: ${res.status} ${body}`)
  }
}

// ── Search ───────────────────────────────────────────────────────────────────

export async function searchPoints(
  collection: string,
  vector: number[],
  limit = 10,
  filter?: Record<string, unknown>
): Promise<QdrantSearchResult[]> {
  const base = QDRANT_URL()

  const body: Record<string, unknown> = {
    vector,
    limit,
    with_payload: true,
    with_vector: false,
  }

  if (filter) body.filter = filter

  const res = await fetch(`${base}/collections/${collection}/points/search`, {
    method: 'POST',
    headers: qdrantHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Qdrant search failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as { result: QdrantSearchResult[] }
  return json.result ?? []
}

// ── Scroll (for incremental refresh) ────────────────────────────────────────

export async function scrollPoints(
  collection: string,
  limit = 1000,
  payloadFields: string[] = ['contentHash']
): Promise<Array<{ id: string; payload: Record<string, unknown> }>> {
  const base = QDRANT_URL()
  const results: Array<{ id: string; payload: Record<string, unknown> }> = []
  let offset: string | null = null

  do {
    const body: Record<string, unknown> = {
      limit,
      with_payload: payloadFields,
      with_vector: false,
    }
    if (offset) body.offset = offset

    const res = await fetch(`${base}/collections/${collection}/points/scroll`, {
      method: 'POST',
      headers: qdrantHeaders(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Qdrant scroll failed: ${res.status} ${text}`)
    }

    const json = (await res.json()) as {
      result: { points: Array<{ id: string; payload: Record<string, unknown> }>; next_page_offset: string | null }
    }

    results.push(...json.result.points)
    offset = json.result.next_page_offset
  } while (offset !== null)

  return results
}

// ── Utility ──────────────────────────────────────────────────────────────────

/**
 * Qdrant requires numeric or UUID point IDs.
 * Derive a stable uint64 from a string ID using FNV-1a hash.
 */
function stableId(id: string): number {
  let hash = 2166136261
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  // Return as positive int32 (Qdrant accepts unsigned ints)
  return hash >>> 0
}

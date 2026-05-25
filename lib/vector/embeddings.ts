/**
 * Embedding generation.
 *
 * Provider selection (via env vars):
 *   VOYAGE_API_KEY  → voyage-3-large (1024 dims, best retrieval quality)
 *   OPENAI_API_KEY  → text-embedding-3-small (1536 dims, fallback)
 *
 * Both accessed via raw fetch — no SDK dependency.
 *
 * Batch size: 128 texts per request (Voyage limit).
 * Automatic retry with exponential backoff on 429/503.
 */

const VOYAGE_BATCH = 128
const OPENAI_BATCH = 2048

export type EmbeddingProvider = 'voyage' | 'openai'

export function getProvider(): EmbeddingProvider {
  if (process.env.VOYAGE_API_KEY) return 'voyage'
  if (process.env.OPENAI_API_KEY) return 'openai'
  throw new Error('No embedding API key found. Set VOYAGE_API_KEY or OPENAI_API_KEY.')
}

export function getDimension(provider?: EmbeddingProvider): number {
  const p = provider ?? getProvider()
  return p === 'voyage' ? 1024 : 1536
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options)
    if (res.ok) return res
    if (res.status === 429 || res.status === 503) {
      const delay = Math.pow(2, attempt) * 1000
      console.warn(`[embeddings] Rate limited, retrying in ${delay}ms...`)
      await sleep(delay)
      continue
    }
    const body = await res.text()
    throw new Error(`Embedding request failed: ${res.status} ${body}`)
  }
  throw new Error('Embedding request failed after retries')
}

async function voyageEmbedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetchWithRetry(
    'https://api.voyageai.com/v1/embeddings',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: texts,
        model: 'voyage-3-large',
        input_type: 'document',
      }),
    }
  )

  const json = (await res.json()) as { data: Array<{ embedding: number[] }> }
  return json.data.map((d) => d.embedding)
}

async function openaiEmbedBatch(texts: string[]): Promise<number[][]> {
  const res = await fetchWithRetry(
    'https://api.openai.com/v1/embeddings',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: texts,
        model: 'text-embedding-3-small',
      }),
    }
  )

  const json = (await res.json()) as { data: Array<{ embedding: number[] }> }
  return json.data.map((d) => d.embedding)
}

/** Generate embeddings for an arbitrary number of texts, batched automatically. */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []

  const provider = getProvider()
  const batchSize = provider === 'voyage' ? VOYAGE_BATCH : OPENAI_BATCH
  const embedFn = provider === 'voyage' ? voyageEmbedBatch : openaiEmbedBatch

  const results: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    console.log(
      `[embeddings] Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)} (${batch.length} items)`
    )
    const vecs = await embedFn(batch)
    results.push(...vecs)

    // Brief pause between batches to stay within rate limits
    if (i + batchSize < texts.length) await sleep(200)
  }

  return results
}

/** Generate embedding for a single query string (uses query input_type for Voyage). */
export async function embedQuery(query: string): Promise<number[]> {
  const provider = getProvider()

  if (provider === 'voyage') {
    const res = await fetchWithRetry(
      'https://api.voyageai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: [query],
          model: 'voyage-3-large',
          input_type: 'query',
        }),
      }
    )
    const json = (await res.json()) as { data: Array<{ embedding: number[] }> }
    return json.data[0].embedding
  } else {
    const res = await fetchWithRetry(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: [query], model: 'text-embedding-3-small' }),
      }
    )
    const json = (await res.json()) as { data: Array<{ embedding: number[] }> }
    return json.data[0].embedding
  }
}

/**
 * POST /api/cron/refresh-ontology
 *
 * Vercel Cron job handler — runs the incremental ontology refresh pipeline.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/refresh-ontology", "schedule": "0 2 * * *" }]
 * }
 *
 * The job runs at 02:00 UTC daily and:
 *   1. Rebuilds all semantic chunks
 *   2. Diffs against existing Qdrant hashes
 *   3. Re-embeds only changed content
 *   4. Recalculates authority + cluster scores
 *   5. Pings IndexNow to signal freshness
 *
 * Protected by CRON_SECRET env var (set in Vercel).
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes — Vercel Pro limit

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'
const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY ?? ''

async function pingIndexNow(): Promise<void> {
  if (!INDEX_NOW_KEY) return

  const urls = [
    `${BASE_URL}/wiki`,
    `${BASE_URL}/wiki/entities`,
    `${BASE_URL}/wiki/updates`,
    `${BASE_URL}/sitemap.xml`,
  ]

  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host:    new URL(BASE_URL).hostname,
      key:     INDEX_NOW_KEY,
      keyLocation: `${BASE_URL}/${INDEX_NOW_KEY}.txt`,
      urlList: urls,
    }),
  }).catch((err) => console.warn('[indexnow] Ping failed:', err))
}

export async function POST(req: NextRequest) {
  // Verify Vercel Cron signature
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = Date.now()
  const log: string[] = []

  try {
    // Only run if vector store is configured
    if (!process.env.QDRANT_URL) {
      log.push('QDRANT_URL not set — skipping vector refresh')
    } else {
      log.push('Starting incremental refresh...')

      const { resetAuthorityCache } = await import('@/lib/authority/entity-score')
      const { resetClusterCache } = await import('@/lib/authority/cluster-analysis')
      const { resetBM25Cache } = await import('@/lib/search/bm25')

      resetAuthorityCache()
      resetClusterCache()
      resetBM25Cache()

      log.push('Caches cleared')

      // Import and run the refresh logic inline (avoids spawning a subprocess)
      const { getAllArticles, getAllArticlesInCategory } = await import('@/lib/wiki/mdx-processor')
      const { buildEntityChunks, buildGlossaryChunk } = await import('@/lib/chunking/chunk-entity')
      const { extractAiAnswerChunks } = await import('@/lib/chunking/chunk-ai-answer')
      const { extractHeadingChunks } = await import('@/lib/chunking/chunk-headings')
      const { generateEmbeddings, getDimension } = await import('@/lib/vector/embeddings')
      const { ensureCollection, upsertPoints, deletePoints, scrollPoints, DEFAULT_COLLECTION } = await import('@/lib/vector/qdrant')
      const { computeAuthorityScores, getChunkAuthorityScore } = await import('@/lib/authority/entity-score')
      const crypto = await import('crypto')

      const hashFn = (text: string) =>
        crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)

      const dim = getDimension()
      await ensureCollection(DEFAULT_COLLECTION, dim)

      // Build chunks
      const chunks = []
      chunks.push(...buildEntityChunks(BASE_URL))

      const glossary = await getAllArticlesInCategory('glossary')
      for (const a of glossary) {
        chunks.push(buildGlossaryChunk(a.slug, a.metadata.title, a.metadata.description ?? '', a.content, a.metadata.entities ?? [], a.metadata.dateUpdated ?? a.metadata.datePublished ?? '', BASE_URL))
      }

      const allArticles = await getAllArticles()
      for (const a of allArticles) {
        if (a.category === 'glossary') continue
        const tier = a.metadata.tier ?? 'T3'
        const entities = a.metadata.entities ?? []
        const updated = a.metadata.dateUpdated ?? a.metadata.datePublished ?? ''
        chunks.push(...extractAiAnswerChunks(a.content, a.category, a.slug, a.metadata.title, tier, entities, updated, BASE_URL))
        chunks.push(...extractHeadingChunks(a.content, a.category, a.slug, a.metadata.title, tier, entities, updated, BASE_URL))
      }

      computeAuthorityScores()
      for (const chunk of chunks) chunk.authorityScore = getChunkAuthorityScore(chunk.entities)

      // Diff against existing
      const existing = await scrollPoints(DEFAULT_COLLECTION, 2000, ['contentHash', 'id'])
      const existingMap = new Map(
        existing.map((p) => [p.payload.id as string, p.payload.contentHash as string])
      )

      const currentMap = new Map(chunks.map((c) => [c.id, c]))
      const toEmbed = chunks.filter((c) => existingMap.get(c.id) !== hashFn(c.content))
      const toDelete = Array.from(existingMap.keys()).filter((id) => !currentMap.has(id))

      if (toDelete.length > 0) await deletePoints(DEFAULT_COLLECTION, toDelete)

      if (toEmbed.length > 0) {
        const texts = toEmbed.map((c) => `${c.heading}\n\n${c.content}`)
        const vectors = await generateEmbeddings(texts)
        const points = toEmbed.map((chunk, i) => ({
          id: chunk.id,
          vector: vectors[i],
          payload: { ...chunk, contentHash: hashFn(chunk.content) },
        }))
        await upsertPoints(DEFAULT_COLLECTION, points)
      }

      log.push(`Updated: ${toEmbed.length}, Deleted: ${toDelete.length}, Total: ${chunks.length}`)
    }

    // Ping IndexNow
    await pingIndexNow()
    log.push('IndexNow pinged')

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[cron/refresh-ontology]', err)
    log.push(`ERROR: ${message}`)
    return NextResponse.json({ ok: false, log, durationMs: Date.now() - startedAt }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    log,
    durationMs: Date.now() - startedAt,
  })
}

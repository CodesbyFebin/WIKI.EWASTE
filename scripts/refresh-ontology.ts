/**
 * Incremental ontology refresh.
 *
 * Instead of re-embedding everything daily:
 *   1. Read existing contentHash values from Qdrant
 *   2. Regenerate all chunks + compute new hashes
 *   3. Only re-embed chunks whose content changed
 *   4. Delete chunks that no longer exist
 *   5. Update manifests + authority scores
 *
 * Run:
 *   npx tsx scripts/refresh-ontology.ts
 *
 * Typical daily cost: ~5–15% of full re-embed (only changed content)
 */

import 'dotenv/config'
import { getAllArticles, getAllArticlesInCategory } from '../lib/wiki/mdx-processor'
import { extractAiAnswerChunks } from '../lib/chunking/chunk-ai-answer'
import { extractHeadingChunks } from '../lib/chunking/chunk-headings'
import { buildEntityChunks, buildGlossaryChunk } from '../lib/chunking/chunk-entity'
import { generateEmbeddings, getDimension } from '../lib/vector/embeddings'
import {
  ensureCollection,
  upsertPoints,
  deletePoints,
  scrollPoints,
  DEFAULT_COLLECTION,
} from '../lib/vector/qdrant'
import { computeAuthorityScores, getChunkAuthorityScore, resetAuthorityCache } from '../lib/authority/entity-score'
import { resetClusterCache } from '../lib/authority/cluster-analysis'
import type { SemanticChunk } from '../lib/chunking/types'
import crypto from 'crypto'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

function contentHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)
}

async function buildAllChunks(): Promise<SemanticChunk[]> {
  const chunks: SemanticChunk[] = []

  chunks.push(...buildEntityChunks(BASE_URL))

  const glossary = await getAllArticlesInCategory('glossary')
  for (const article of glossary) {
    chunks.push(
      buildGlossaryChunk(
        article.slug,
        article.metadata.title,
        article.metadata.description ?? '',
        article.content,
        article.metadata.entities ?? [],
        article.metadata.dateUpdated ?? article.metadata.datePublished ?? '',
        BASE_URL
      )
    )
  }

  const allArticles = await getAllArticles()
  for (const article of allArticles) {
    if (article.category === 'glossary') continue
    const tier = article.metadata.tier ?? 'T3'
    const entities = article.metadata.entities ?? []
    const updated = article.metadata.dateUpdated ?? article.metadata.datePublished ?? ''

    chunks.push(
      ...extractAiAnswerChunks(article.content, article.category, article.slug, article.metadata.title, tier, entities, updated, BASE_URL),
      ...extractHeadingChunks(article.content, article.category, article.slug, article.metadata.title, tier, entities, updated, BASE_URL)
    )
  }

  return chunks
}

async function main() {
  console.log('=== EWasteKochi Incremental Refresh ===\n')

  const dim = getDimension()
  await ensureCollection(DEFAULT_COLLECTION, dim)

  // 1. Read existing hashes from Qdrant
  console.log('[qdrant] Reading existing point hashes...')
  const existing = await scrollPoints(DEFAULT_COLLECTION, 2000, ['contentHash', 'id'])
  const existingMap = new Map<string, string>()
  for (const point of existing) {
    const id = point.payload.id as string
    const hash = point.payload.contentHash as string
    if (id && hash) existingMap.set(id, hash)
  }
  console.log(`[qdrant] Found ${existingMap.size} existing chunks`)

  // 2. Generate current chunks
  console.log('\n[chunk] Building current chunks...')
  const currentChunks = await buildAllChunks()
  const currentMap = new Map(currentChunks.map((c) => [c.id, c]))

  // 3. Compute authority scores
  resetAuthorityCache()
  resetClusterCache()
  computeAuthorityScores()
  for (const chunk of currentChunks) {
    chunk.authorityScore = getChunkAuthorityScore(chunk.entities)
  }

  // 4. Diff: find changed + new chunks
  const toEmbed: SemanticChunk[] = []
  for (const [id, chunk] of currentMap.entries()) {
    const hash = contentHash(chunk.content)
    if (existingMap.get(id) !== hash) {
      toEmbed.push(chunk)
    }
  }

  // 5. Find deleted chunks
  const toDelete: string[] = []
  for (const id of existingMap.keys()) {
    if (!currentMap.has(id)) toDelete.push(id)
  }

  console.log(`\n[diff] Changed/new: ${toEmbed.length}, Deleted: ${toDelete.length}, Unchanged: ${currentChunks.length - toEmbed.length}`)

  if (toDelete.length > 0) {
    console.log('[qdrant] Deleting removed chunks...')
    await deletePoints(DEFAULT_COLLECTION, toDelete)
  }

  if (toEmbed.length > 0) {
    console.log('[embed] Generating embeddings for changed chunks...')
    const texts = toEmbed.map((c) => `${c.heading}\n\n${c.content}`)
    const vectors = await generateEmbeddings(texts)

    console.log('[qdrant] Upserting updated chunks...')
    const points = toEmbed.map((chunk, i) => ({
      id: chunk.id,
      vector: vectors[i],
      payload: { ...chunk, contentHash: contentHash(chunk.content) },
    }))
    await upsertPoints(DEFAULT_COLLECTION, points)
  }

  console.log('\n✓ Incremental refresh complete')
  console.log(`  Updated: ${toEmbed.length} | Deleted: ${toDelete.length} | Unchanged: ${currentChunks.length - toEmbed.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

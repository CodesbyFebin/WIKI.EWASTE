/**
 * Full embedding ingestion pipeline.
 *
 * Loads all content, chunks it by tier, applies authority scores,
 * generates embeddings, and upserts to Qdrant.
 *
 * Run:
 *   npx tsx scripts/generate-embeddings.ts
 *
 * Required env vars:
 *   QDRANT_URL, QDRANT_API_KEY (optional for local)
 *   VOYAGE_API_KEY | OPENAI_API_KEY
 *   NEXT_PUBLIC_BASE_URL (optional, defaults to https://wiki.ewastekochi.com)
 */

import 'dotenv/config'
import { getAllArticles, getAllArticlesInCategory } from '../lib/wiki/mdx-processor'
import { extractAiAnswerChunks } from '../lib/chunking/chunk-ai-answer'
import { extractHeadingChunks } from '../lib/chunking/chunk-headings'
import { buildEntityChunks, buildGlossaryChunk } from '../lib/chunking/chunk-entity'
import { generateEmbeddings, getDimension } from '../lib/vector/embeddings'
import { ensureCollection, upsertPoints, DEFAULT_COLLECTION } from '../lib/vector/qdrant'
import { computeAuthorityScores, getChunkAuthorityScore } from '../lib/authority/entity-score'
import type { SemanticChunk } from '../lib/chunking/types'
import crypto from 'crypto'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

function contentHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)
}

async function buildAllChunks(): Promise<SemanticChunk[]> {
  const chunks: SemanticChunk[] = []

  // Tier 1 — Entity definitions
  console.log('[chunk] Building entity chunks...')
  chunks.push(...buildEntityChunks(BASE_URL))

  // Tier 2 — Glossary definitions
  console.log('[chunk] Building glossary chunks...')
  const glossaryArticles = await getAllArticlesInCategory('glossary')
  for (const article of glossaryArticles) {
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

  // Tier 1 priority — AIAnswer blocks (all categories)
  console.log('[chunk] Extracting AIAnswer blocks...')
  const allArticles = await getAllArticles()
  for (const article of allArticles) {
    if (article.category === 'glossary') continue // handled above
    chunks.push(
      ...extractAiAnswerChunks(
        article.content,
        article.category,
        article.slug,
        article.metadata.title,
        article.metadata.tier ?? 'T3',
        article.metadata.entities ?? [],
        article.metadata.dateUpdated ?? article.metadata.datePublished ?? '',
        BASE_URL
      )
    )
  }

  // Tier 3 — H2/H3 sections
  console.log('[chunk] Extracting heading sections...')
  for (const article of allArticles) {
    if (article.category === 'glossary') continue
    chunks.push(
      ...extractHeadingChunks(
        article.content,
        article.category,
        article.slug,
        article.metadata.title,
        article.metadata.tier ?? 'T3',
        article.metadata.entities ?? [],
        article.metadata.dateUpdated ?? article.metadata.datePublished ?? '',
        BASE_URL
      )
    )
  }

  return chunks
}

async function main() {
  console.log('=== EWasteKochi Embedding Pipeline ===\n')

  // 1. Ensure collection exists
  const dim = getDimension()
  console.log(`[setup] Embedding dimension: ${dim}`)
  await ensureCollection(DEFAULT_COLLECTION, dim)

  // 2. Build all chunks
  const chunks = await buildAllChunks()
  console.log(`\n[chunks] Total: ${chunks.length}`)
  console.log(`  entity-definition:  ${chunks.filter((c) => c.sourceType === 'entity-definition').length}`)
  console.log(`  glossary-definition:${chunks.filter((c) => c.sourceType === 'glossary-definition').length}`)
  console.log(`  ai-answer:          ${chunks.filter((c) => c.sourceType === 'ai-answer').length}`)
  console.log(`  h2-section:         ${chunks.filter((c) => c.sourceType === 'h2-section').length}`)
  console.log(`  h3-section:         ${chunks.filter((c) => c.sourceType === 'h3-section').length}`)

  // 3. Apply authority scores
  console.log('\n[authority] Computing authority scores...')
  const authorityScores = computeAuthorityScores()
  for (const chunk of chunks) {
    chunk.authorityScore = getChunkAuthorityScore(chunk.entities)
  }

  // 4. Generate embeddings
  console.log('\n[embed] Generating embeddings...')
  const texts = chunks.map((c) => `${c.heading}\n\n${c.content}`)
  const vectors = await generateEmbeddings(texts)
  console.log(`[embed] Generated ${vectors.length} vectors`)

  // 5. Upsert to Qdrant
  console.log('\n[qdrant] Upserting points...')
  const points = chunks.map((chunk, i) => ({
    id: chunk.id,
    vector: vectors[i],
    payload: {
      ...chunk,
      contentHash: contentHash(chunk.content),
    },
  }))

  await upsertPoints(DEFAULT_COLLECTION, points)
  console.log(`[qdrant] Upserted ${points.length} points to "${DEFAULT_COLLECTION}"`)

  console.log('\n✓ Embedding pipeline complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

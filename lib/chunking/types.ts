export type ChunkSourceType =
  | 'ai-answer'
  | 'glossary-definition'
  | 'h2-section'
  | 'h3-section'
  | 'entity-definition'
  | 'fallback'

export interface SemanticChunk {
  /** Stable ID: "{category}/{slug}#{index}" or "entity/{id}" */
  id: string
  title: string
  heading: string
  content: string
  entities: string[]
  category: string
  tier: string
  url: string
  sourceType: ChunkSourceType
  updatedAt: string
  authorityScore: number
  wordCount: number
}

export interface ChunkWithHash extends SemanticChunk {
  contentHash: string
}

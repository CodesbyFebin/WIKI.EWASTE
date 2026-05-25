/**
 * BM25F keyword ranking.
 *
 * k1 = 1.5 (term frequency saturation)
 * b  = 0.75 (document length normalisation)
 *
 * The index is built once and cached as a module-level singleton.
 */

export interface BM25Document {
  id: string
  text: string
}

export interface BM25Result {
  id: string
  score: number
}

const K1 = 1.5
const B  = 0.75

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

export class BM25Index {
  private docs: Map<string, string[]> = new Map()      // id → tokens
  private df: Map<string, number> = new Map()          // term → doc frequency
  private avgDl = 0
  private N = 0

  build(documents: BM25Document[]): void {
    this.docs.clear()
    this.df.clear()
    this.N = documents.length

    let totalLen = 0

    for (const doc of documents) {
      const tokens = tokenize(doc.text)
      this.docs.set(doc.id, tokens)
      totalLen += tokens.length

      // Document frequency: count each term once per doc
      const seen = new Set(tokens)
      for (const term of seen) {
        this.df.set(term, (this.df.get(term) ?? 0) + 1)
      }
    }

    this.avgDl = this.N > 0 ? totalLen / this.N : 1
  }

  search(query: string, topK = 10): BM25Result[] {
    if (this.N === 0) return []
    const queryTerms = tokenize(query)
    if (queryTerms.length === 0) return []

    const scores = new Map<string, number>()

    for (const term of queryTerms) {
      const df = this.df.get(term) ?? 0
      if (df === 0) continue

      // IDF with smoothing
      const idf = Math.log((this.N - df + 0.5) / (df + 0.5) + 1)

      for (const [docId, tokens] of this.docs.entries()) {
        const tf = tokens.filter((t) => t === term).length
        if (tf === 0) continue

        const dl = tokens.length
        const tfNorm =
          (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (dl / this.avgDl)))

        scores.set(docId, (scores.get(docId) ?? 0) + idf * tfNorm)
      }
    }

    // Normalise to [0, 1]
    const maxScore = Math.max(...scores.values(), 1)

    return Array.from(scores.entries())
      .map(([id, score]) => ({ id, score: score / maxScore }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

let _index: BM25Index | null = null

export async function getBM25Index(): Promise<BM25Index> {
  if (_index) return _index

  const { getAllArticles } = await import('@/lib/wiki/mdx-processor')
  const articles = await getAllArticles()

  _index = new BM25Index()
  _index.build(
    articles.map((a) => ({
      id: `${a.category}/${a.slug}`,
      text: [
        a.metadata.title,
        a.metadata.description ?? '',
        (a.metadata.keywords ?? []).join(' '),
        a.content.slice(0, 5000),
      ].join(' '),
    }))
  )

  return _index
}

export function resetBM25Cache(): void {
  _index = null
}

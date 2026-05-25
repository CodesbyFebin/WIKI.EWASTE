import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { EntityGraphExplorer } from '@/components/wiki/entity-graph-wrapper'
import { semanticGraph, EntityType } from '@/lib/wiki/entity-graph'
import { getArticleCountForEntity, getArticlesByEntity } from '@/lib/wiki/entity-article-index'
import { computeAuthorityScores } from '@/lib/authority/entity-score'
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from '@/lib/wiki/schema-builder'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export const metadata = {
  title: 'Entity Hub — EWasteKochi Semantic Graph',
  description:
    'Explore the semantic entity graph underlying the EWasteKochi knowledge base. Regulatory bodies, standards, legislation, materials, and processes — all interconnected.',
  alternates: {
    canonical: `${BASE_URL}/wiki/entities`,
  },
}

const TYPE_META: Record<
  EntityType,
  { label: string; bg: string; text: string; border: string; description: string }
> = {
  organization: {
    label: 'Organizations',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    description: 'Regulatory bodies and governmental organizations',
  },
  legislation: {
    label: 'Legislation',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    description: 'Laws, rules, and regulatory frameworks',
  },
  standard: {
    label: 'Standards',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    description: 'Technical and compliance standards',
  },
  concept: {
    label: 'Concepts',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    description: 'Core frameworks and strategic concepts',
  },
  process: {
    label: 'Processes',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    description: 'Operational and technical processes',
  },
  material: {
    label: 'Materials',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    description: 'Physical materials and components',
  },
  location: {
    label: 'Locations',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    description: 'Geographic regions and jurisdictions',
  },
}

export default function EntitiesHubPage() {
  const allEntities = Object.values(semanticGraph)

  // Enrich each entity with live article counts
  const enriched = allEntities.map((entity) => ({
    ...entity,
    articleCount: getArticleCountForEntity(entity.id),
    topArticles: getArticlesByEntity(entity.id, 3),
  }))

  // Authority scores for graph node sizing
  const authorityScores = computeAuthorityScores()
  const articleCountMap = Object.fromEntries(enriched.map((e) => [e.id, e.articleCount]))

  // Sort by article count within each type group
  const byType = enriched.reduce<Record<EntityType, typeof enriched>>((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = []
    acc[entity.type].push(entity)
    return acc
  }, {} as Record<EntityType, typeof enriched>)

  for (const type of Object.keys(byType) as EntityType[]) {
    byType[type].sort((a, b) => b.articleCount - a.articleCount)
  }

  const typeOrder: EntityType[] = [
    'organization',
    'legislation',
    'standard',
    'concept',
    'process',
    'material',
    'location',
  ]

  // Total article references (sum across all entities)
  const totalRefs = enriched.reduce((sum, e) => sum + e.articleCount, 0)

  /* ── JSON-LD ──────────────────────────────────────────── */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
    { name: 'Entity Hub', url: `${BASE_URL}/wiki/entities` },
  ])

  const itemListSchema = generateItemListSchema(
    'EWasteKochi Semantic Entity Graph',
    enriched.map((e) => ({
      name: e.name,
      url: `${BASE_URL}/wiki/glossary/${e.id}`,
    }))
  )

  return (
    <WikiLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="space-y-12">
        {/* Header */}
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 px-8 py-12 border border-gray-200">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-100">
            Semantic Graph · {enriched.length} entities · {totalRefs} article references
          </div>
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Entity Hub</h1>
          <p className="max-w-2xl text-lg text-gray-700">
            The semantic graph underlying the EWasteKochi knowledge base. Every regulatory
            body, standard, law, concept, and material — cross-linked to the articles that
            reference them.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {typeOrder.map((type) => {
              const meta = TYPE_META[type]
              const count = byType[type]?.length ?? 0
              return count > 0 ? (
                <a
                  key={type}
                  href={`#type-${type}`}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${meta.bg} ${meta.text} ${meta.border} hover:opacity-80`}
                >
                  {meta.label} ({count})
                </a>
              ) : null
            })}
          </div>
        </div>

        {/* Force-directed ontology graph */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Ontology Explorer</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-mono">interactive · canvas</span>
          </div>
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <EntityGraphExplorer
              articleCounts={articleCountMap}
              authorityScores={authorityScores}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Click a node to see details. Node size reflects article references. Filter by entity type above.
          </p>
        </section>

        {/* Entity groups */}
        {typeOrder.map((type) => {
          const entities = byType[type]
          if (!entities?.length) return null
          const meta = TYPE_META[type]

          return (
            <section key={type} id={`type-${type}`} className="scroll-mt-20">
              <div className="mb-6 flex items-center gap-3">
                <div className={`rounded-xl px-4 py-2 ${meta.bg}`}>
                  <h2 className={`text-lg font-black ${meta.text}`}>{meta.label}</h2>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-mono text-gray-400">
                  {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {entities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`rounded-xl border ${meta.border} bg-white p-5 flex flex-col gap-3`}
                  >
                    {/* Entity name + type badge */}
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/wiki/glossary/${entity.id}`}
                        className={`font-bold text-gray-900 hover:${meta.text} text-base leading-snug`}
                      >
                        {entity.name}
                      </Link>
                      {entity.articleCount > 0 && (
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${meta.bg} ${meta.text}`}>
                          {entity.articleCount}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {entity.description}
                    </p>

                    {/* Related entities */}
                    {entity.relatedEntities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entity.relatedEntities.slice(0, 4).map((relId) => {
                          const rel = semanticGraph[relId]
                          return rel ? (
                            <Link
                              key={relId}
                              href={`/wiki/glossary/${relId}`}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                            >
                              {rel.name}
                            </Link>
                          ) : null
                        })}
                      </div>
                    )}

                    {/* Top referencing articles */}
                    {entity.topArticles.length > 0 && (
                      <div className="border-t border-gray-100 pt-3 space-y-1">
                        {entity.topArticles.map((ref) => (
                          <Link
                            key={ref.url}
                            href={ref.url}
                            className="block text-xs text-gray-500 hover:text-emerald-700 truncate"
                          >
                            → {ref.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Glossary link */}
                    <Link
                      href={`/wiki/glossary/${entity.id}`}
                      className={`text-xs font-semibold ${meta.text} hover:underline`}
                    >
                      View definition →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* API discovery */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-2 font-bold text-gray-900">Retrieval API</h3>
          <p className="mb-4 text-sm text-gray-600">
            This entity graph is available as a machine-readable JSON API for AI systems,
            embedding pipelines, and enterprise integrations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/api/entities"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-mono text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-all"
            >
              GET /api/entities
            </Link>
            <Link
              href="/api/articles"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-mono text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-all"
            >
              GET /api/articles
            </Link>
            <Link
              href="/api/glossary"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-mono text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition-all"
            >
              GET /api/glossary
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="mt-12 border-t border-gray-200 pt-6">
        <div className="text-sm text-gray-500">
          <Link href="/wiki" className="hover:text-emerald-600">Wiki</Link>
          {' › '}
          <span>Entity Hub</span>
        </div>
      </nav>
    </WikiLayout>
  )
}

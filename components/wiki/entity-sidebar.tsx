import { semanticGraph, SemanticEntity, EntityType } from '@/lib/wiki/entity-graph'
import Link from 'next/link'

const typeStyles: Record<EntityType, { bg: string; text: string; label: string }> = {
  organization: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Org' },
  standard: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Standard' },
  legislation: { bg: 'bg-red-50', text: 'text-red-700', label: 'Law' },
  concept: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Concept' },
  material: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Material' },
  process: { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Process' },
  location: { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Location' },
}

interface EntitySidebarProps {
  entityIds: string[]
  currentUrl?: string
}

export default function EntitySidebar({ entityIds, currentUrl }: EntitySidebarProps) {
  if (!entityIds?.length) return null

  const entities = entityIds
    .map((id) => semanticGraph[id.toLowerCase()])
    .filter((e): e is SemanticEntity => Boolean(e))

  if (!entities.length) return null

  return (
    <aside className="space-y-3 xl:sticky xl:top-24">
      <p className="px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Key Entities
      </p>

      <div className="space-y-2">
        {entities.map((entity) => {
          const style = typeStyles[entity.type]
          const primaryLink = entity.linkedArticles.find((l) => l !== currentUrl) ?? entity.linkedArticles[0]

          return (
            <div
              key={entity.id}
              className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
            >
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}
              >
                {style.label}
              </span>

              {primaryLink ? (
                <Link
                  href={primaryLink}
                  className="mt-1.5 block text-sm font-semibold text-gray-900 hover:text-emerald-700 leading-snug"
                >
                  {entity.name}
                </Link>
              ) : (
                <p className="mt-1.5 text-sm font-semibold text-gray-900 leading-snug">
                  {entity.name}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {entity.description}
              </p>

              {entity.relatedEntities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {entity.relatedEntities.slice(0, 3).map((relId) => {
                    const rel = semanticGraph[relId]
                    if (!rel) return null
                    return (
                      <span
                        key={relId}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500"
                      >
                        {rel.name}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Link
        href="/wiki/glossary"
        className="block pt-1 text-xs font-medium text-emerald-600 hover:underline"
      >
        Browse full glossary →
      </Link>
    </aside>
  )
}

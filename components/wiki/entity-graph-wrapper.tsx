'use client'

import dynamic from 'next/dynamic'

export const EntityGraphExplorer = dynamic(
  () => import('@/components/wiki/entity-graph-explorer').then((m) => m.EntityGraphExplorer),
  { ssr: false, loading: () => <div className="h-[580px] rounded-xl bg-gray-900 animate-pulse" /> }
)

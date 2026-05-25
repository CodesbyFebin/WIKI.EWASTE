import { notFound } from 'next/navigation'
import React from 'react'
import { RESERVED_ROUTES, articleExists, getAllRoutes } from '../../../lib/wiki/slug-registry'

type Props = { params: { category: string } }

export async function generateStaticParams() {
  // produce categories based on registry
  const routes = getAllRoutes().articles
  const cats = new Set<string>()
  for (const r of routes) {
    const m = r.match(/^\/wiki\/([^/]+)(?:\/|$)/)
    if (m) cats.add(m[1])
  }
  return Array.from(cats).map((c) => ({ category: c }))
}

export default function CategoryPage({ params }: Props) {
  const { category } = params
  if (RESERVED_ROUTES.has(category)) return notFound()

  // check if category exists
  if (!articleExists(`/wiki/${category}`)) return notFound()

  // list articles in category
  // naive: filter registry
  const all = getAllRoutes().articles
  const items = all.filter((r) => r.startsWith(`/wiki/${category}/`))

  return (
    <div>
      <h1>Category: {category}</h1>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

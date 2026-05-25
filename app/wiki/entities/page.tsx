import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { getAllRoutes } from '../../../lib/wiki/slug-registry'

export async function generateStaticParams() {
  // placeholder, entities page is static
  return [{}]
}

export default function EntitiesPage() {
  // list entities from registry
  const entities = getAllRoutes().entities || []
  if (!entities.length) return <div>No entities found</div>
  return (
    <div>
      <h1>Entities</h1>
      <ul>
        {entities.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  )
}

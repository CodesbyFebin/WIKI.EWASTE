import React from 'react'
import { getAllRoutes } from '../../../lib/wiki/slug-registry'

export default function UpdatesPage() {
  const updates = getAllRoutes().updates || []
  if (!updates.length) return <div>No updates found</div>
  return (
    <div>
      <h1>Updates</h1>
      <ul>
        {updates.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>
    </div>
  )
}

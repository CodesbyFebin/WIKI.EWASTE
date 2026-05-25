import Link from 'next/link'
import { getAllRoutes } from '../lib/wiki/slug-registry'

export default function Home() {
  const routes = getAllRoutes()
  return (
    <main>
      <h1>WIKI.EWASTE</h1>
      <p>Available routes (sample):</p>
      <ul>
        {routes.articles.slice(0, 10).map((r) => (
          <li key={r}>
            <Link href={r}>{r}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

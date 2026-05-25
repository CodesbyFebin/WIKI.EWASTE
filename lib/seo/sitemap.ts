/** Shared utilities for route-handler-based sitemaps */

export function xmlEsc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

/** Normalise a date string to YYYY-MM-DD for <lastmod> */
export function toLastmod(date: string | undefined | null): string {
  if (!date) return new Date().toISOString().slice(0, 10)
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  // ISO datetime — truncate to date
  try {
    return new Date(date).toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export function tierPriority(tier: string | undefined): string {
  switch (tier) {
    case 'T1': return '1.0'
    case 'T2': return '0.8'
    case 'T3': return '0.6'
    default:   return '0.5'
  }
}

export function tierChangefreq(tier: string | undefined): string {
  return tier === 'T1' ? 'weekly' : 'monthly'
}

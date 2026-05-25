/**
 * Auto Entity Links
 *
 * Scans MDX content and wraps known glossary terms in Markdown links.
 * Rules:
 *   - Only the FIRST occurrence of each phrase is linked.
 *   - Code fences, inline code, existing links, headings, and AI summary
 *     blockquotes are never modified.
 *   - Phrases shorter than MIN_PHRASE_LENGTH chars are skipped.
 *   - The article's own slug is never linked (no self-loops).
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'content/wiki')
const MIN_PHRASE_LENGTH = 3

// Curated aliases that map full entity names / acronyms to glossary slugs.
// Add here when a term is important but not already covered by its glossary title.
const MANUAL_ALIASES: Record<string, string> = {
  'Central Pollution Control Board': '/wiki/glossary/cpcb',
  'Kerala State Pollution Control Board': '/wiki/glossary/cpcb',
  'Extended Producer Responsibility': '/wiki/glossary/extended-producer-responsibility',
  'IT Asset Disposition': '/wiki/glossary/itad',
  'Information Technology Asset Disposition': '/wiki/glossary/itad',
  'Waste Electrical and Electronic Equipment': '/wiki/glossary/weee',
  'Chain of Custody': '/wiki/glossary/chain-of-custody',
  'Data Sanitization': '/wiki/glossary/data-sanitization',
  'Carbon Footprint': '/wiki/glossary/carbon-footprint',
  'Life Cycle Assessment': '/wiki/glossary/life-cycle-assessment',
  'LCA': '/wiki/glossary/life-cycle-assessment',
  'Material Recovery': '/wiki/glossary/material-recovery',
  'Rare Earth Elements': '/wiki/glossary/rare-earth-element',
  'Rare Earth Element': '/wiki/glossary/rare-earth-element',
  'Printed Circuit Board': '/wiki/glossary/pcb',
  'Circular Economy': '/wiki/glossary/circular-economy',
  'Hazardous Material': '/wiki/glossary/hazmat',
  'Authorized Recycler': '/wiki/glossary/authorized-recycler',
  'authorized recyclers': '/wiki/glossary/authorized-recycler',
  'Supply Chain': '/wiki/glossary/supply-chain',
  'Audit Trail': '/wiki/glossary/audit-trail',
  'Traceability': '/wiki/glossary/traceability',
  'Landfill': '/wiki/glossary/landfill',
  'Producer Responsibility': '/wiki/glossary/producer-responsibility',
  'Take-Back Program': '/wiki/glossary/take-back-program',
  'take-back mechanism': '/wiki/glossary/take-back-mechanism',
  'Energy Recovery': '/wiki/glossary/energy-recovery',
  'Hydrometallurgy': '/wiki/glossary/hydrometallurgy',
  'Pyrometallurgy': '/wiki/glossary/pyrometallurgy',
  'Precious Metal': '/wiki/glossary/precious-metal',
  'Precious Metals': '/wiki/glossary/precious-metal',
  'Waste Stream': '/wiki/glossary/waste-stream',
  'Value Chain': '/wiki/glossary/value-chain',
}

let _linkMap: Map<string, string> | null = null

function buildLinkMap(): Map<string, string> {
  const map = new Map<string, string>()
  const glossaryDir = path.join(contentRoot, 'glossary')

  try {
    const files = fs.readdirSync(glossaryDir).filter((f) => f.endsWith('.mdx'))
    for (const file of files) {
      const slug = file.replace('.mdx', '')
      const url = `/wiki/glossary/${slug}`
      try {
        const raw = fs.readFileSync(path.join(glossaryDir, file), 'utf-8')
        const { data } = matter(raw)
        const phrase = ((data.title ?? data.term) as string | undefined)?.trim()
        if (phrase && phrase.length >= MIN_PHRASE_LENGTH) {
          map.set(phrase, url)
        }
      } catch {
        // Skip unreadable files silently
      }
    }
  } catch (e) {
    console.error('auto-entity-links: could not read glossary directory', e)
  }

  // Apply manual aliases (only if the slug's file actually exists)
  for (const [phrase, url] of Object.entries(MANUAL_ALIASES)) {
    if (!map.has(phrase)) {
      const slug = url.split('/').pop() ?? ''
      const filePath = path.join(contentRoot, 'glossary', `${slug}.mdx`)
      if (fs.existsSync(filePath)) {
        map.set(phrase, url)
      }
    }
  }

  return map
}

function getLinkMap(): Map<string, string> {
  if (!_linkMap) _linkMap = buildLinkMap()
  return _linkMap
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Replace known glossary terms in `content` with Markdown links.
 *
 * @param content   Raw MDX body (frontmatter already stripped by gray-matter)
 * @param selfSlug  The current article's slug — prevents self-linking
 */
export function autoLinkEntities(content: string, selfSlug?: string): string {
  const map = getLinkMap()
  if (map.size === 0) return content

  // Sort phrases longest-first so "Extended Producer Responsibility" matches
  // before "EPR" if both appear in the same text node.
  const phrases = Array.from(map.keys())
    .filter((p) => p.length >= MIN_PHRASE_LENGTH)
    .sort((a, b) => b.length - a.length)

  // ── Step 1: Stash skip-zones behind null-byte sentinels ─────────────────
  const stash: string[] = []

  function hide(s: string): string {
    const id = `\x00SK${stash.length}\x00`
    stash.push(s)
    return id
  }

  let src = content

  // Code fences (``` ... ```) — must come before inline code
  src = src.replace(/```[\s\S]*?```/g, hide)
  // Inline code
  src = src.replace(/`[^`\n]+`/g, hide)
  // Existing Markdown links  [text](url)
  src = src.replace(/\[[^\]\n]+\]\([^)\n]+\)/g, hide)
  // Markdown images  ![alt](url)
  src = src.replace(/!\[[^\]\n]*\]\([^)\n]+\)/g, hide)

  // ── Step 2: Line-level processing ────────────────────────────────────────
  const linked = new Set<string>()

  const lines = src.split('\n').map((line) => {
    const trimmed = line.trimStart()
    // Skip ATX headings, blockquotes (AI summary blockquote uses > **AI Summary**)
    if (/^#{1,6}\s/.test(trimmed) || /^>\s/.test(trimmed)) return line

    let result = line
    for (const phrase of phrases) {
      const key = phrase.toLowerCase()
      if (linked.has(key)) continue

      const url = map.get(phrase)
      if (!url) continue

      // Never link to the article's own glossary entry
      if (selfSlug && url === `/wiki/glossary/${selfSlug}`) continue

      const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i')
      if (!re.test(result)) continue

      result = result.replace(re, (match) => {
        linked.add(key)
        return `[${match}](${url})`
      })
    }

    return result
  })

  src = lines.join('\n')

  // ── Step 3: Restore stashed zones ────────────────────────────────────────
  src = src.replace(/\x00SK(\d+)\x00/g, (_, i) => stash[parseInt(i, 10)])

  return src
}

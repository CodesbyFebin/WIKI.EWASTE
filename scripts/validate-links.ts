import fs from 'fs'
import path from 'path'
import { routeExists, getAllRoutes } from '../lib/wiki/slug-registry'

function findLinksInText(text: string) {
  // naive href matcher for internal links
  const regex = /href=["']([^"']+)["']/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(text))) {
    out.push(m[1])
  }
  // also look for markdown style links
  const md = /\[.*?\]\((\/wiki[^)]+)\)/g
  while ((m = md.exec(text))) {
    out.push(m[1])
  }
  return out
}

function walkFiles(dir: string): string[] {
  const res: string[] = []
  if (!fs.existsSync(dir)) return res
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) res.push(...walkFiles(full))
    else res.push(full)
  }
  return res
}

async function main() {
  const contentRoot = path.join(process.cwd(), 'content')
  const files = walkFiles(contentRoot).filter((f) => /\.mdx?$/.test(f))
  const broken: Array<{ file: string; link: string }> = []
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8')
    const links = findLinksInText(text)
    for (const l of links) {
      if (l.startsWith('/')) {
        if (!routeExists(l)) broken.push({ file: f, link: l })
      }
    }
  }

  // check related references from registry (e.g., ensure glossary referenced exist)
  const all = getAllRoutes()

  if (broken.length) {
    console.error('Broken links found:')
    for (const b of broken) console.error(`${b.file} -> ${b.link}`)
    process.exitCode = 2
  } else {
    console.log('No broken internal links found.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

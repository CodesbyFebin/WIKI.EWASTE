import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { articleExists } from '../../../../lib/wiki/slug-registry'

type Props = { params: { category: string; slug: string } }

export async function generateStaticParams() {
  // build params from content on disk
  const contentDir = path.join(process.cwd(), 'content', 'wiki')
  const params: Array<{ category: string; slug: string }> = []
  if (!fs.existsSync(contentDir)) return params
  for (const category of fs.readdirSync(contentDir)) {
    const catPath = path.join(contentDir, category)
    if (!fs.statSync(catPath).isDirectory()) continue
    for (const f of fs.readdirSync(catPath)) {
      const slug = f.replace(/\.[^/.]+$/, '')
      params.push({ category, slug })
    }
  }
  return params
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const route = `/wiki/${category}/${slug}`
  if (!articleExists(route)) return notFound()

  const filePath = path.join(process.cwd(), 'content', 'wiki', category, `${slug}.mdx`)
  let body = ''
  if (fs.existsSync(filePath)) {
    body = fs.readFileSync(filePath, 'utf8')
  } else {
    // fallback to .md
    const md = filePath.replace(/\.mdx$/, '.md')
    if (fs.existsSync(md)) body = fs.readFileSync(md, 'utf8')
  }

  return (
    <article>
      <h1>{slug.replace(/-/g, ' ')}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{body}</pre>
    </article>
  )
}

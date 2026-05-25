import React from 'react'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { glossaryExists } from '../../../../lib/wiki/slug-registry'

type Props = { params: { term: string } }

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'glossary')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).map((f) => ({ term: f.replace(/\.[^/.]+$/, '') }))
}

export default async function GlossaryPage({ params }: Props) {
  const { term } = await params
  const route = `/wiki/glossary/${term}`
  if (!glossaryExists(route)) return notFound()

  const filePath = path.join(process.cwd(), 'content', 'glossary', `${term}.mdx`)
  const body = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''

  return (
    <article>
      <h1>{term}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{body}</pre>
    </article>
  )
}

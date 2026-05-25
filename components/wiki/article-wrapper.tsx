'use client'

import type React from 'react'
import { Clock, User, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ResolvedRelated {
  slug: string
  category: string
  href: string
}

interface ArticleWrapperProps {
  children: React.ReactNode
  category: string
  categoryName: string
  resolvedRelated?: ResolvedRelated[]
  metadata: {
    title: string
    category: string
    tier: string
    author: string
    reviewer?: string
    datePublished: string
    dateUpdated: string
    readTime: number
    description: string
    keywords: string[]
    entities: string[]
    relatedArticles: string[]
  }
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Category → service CTA mapping
const SERVICE_CTAS: Record<
  string,
  { headline: string; body: string; cta: string; href: string; accent: string }
> = {
  compliance: {
    headline: 'Need help with EPR or CPCB compliance?',
    body: 'Our compliance specialists guide you through authorization, EPR registration, and audit preparation.',
    cta: 'Get Compliance Support',
    href: '/services/epr-compliance',
    accent: 'border-blue-200 bg-blue-50',
  },
  itad: {
    headline: 'Ready to decommission IT assets?',
    body: 'Certified ITAD with chain-of-custody documentation, NIST 800-88 destruction, and ESG reporting.',
    cta: 'Start Enterprise ITAD',
    href: '/services/enterprise-itad',
    accent: 'border-violet-200 bg-violet-50',
  },
  'data-destruction': {
    headline: 'Certified NIST 800-88 data destruction',
    body: 'On-site and off-site media sanitization with certificate of destruction and audit trail.',
    cta: 'Schedule Destruction',
    href: '/services/certified-destruction',
    accent: 'border-red-200 bg-red-50',
  },
  recycling: {
    headline: 'Ready to recycle your e-waste?',
    body: 'Kochi-based doorstep pickup for businesses and institutions. CPCB-authorized facility.',
    cta: 'Schedule a Pickup',
    href: '/services/schedule-pickup',
    accent: 'border-emerald-200 bg-emerald-50',
  },
  esg: {
    headline: 'Need an e-waste ESG report?',
    body: 'Track your recycling weight, CO₂ offset, and generate ESG-ready certificates for investors and regulators.',
    cta: 'Get ESG Reporting',
    href: '/services/esg-reporting',
    accent: 'border-green-200 bg-green-50',
  },
  materials: {
    headline: 'Maximise your material recovery value',
    body: 'Precious metal assay, transparent pricing, and material recovery statements for your finance team.',
    cta: 'Request Assessment',
    href: '/services/material-recovery',
    accent: 'border-amber-200 bg-amber-50',
  },
  localities: {
    headline: 'Pickup available across Kerala',
    body: 'All 14 districts covered. Scheduled fleet pickups for enterprises, hospitals, and institutions.',
    cta: 'Book a Pickup',
    href: '/services/schedule-pickup',
    accent: 'border-cyan-200 bg-cyan-50',
  },
}

export default function ArticleWrapper({
  children,
  category,
  categoryName,
  resolvedRelated,
  metadata,
}: ArticleWrapperProps) {
  const relatedArticles = resolvedRelated?.length
    ? resolvedRelated
    : (metadata.relatedArticles ?? []).map((slug) => ({ slug, category, href: `/wiki/${category}/${slug}` }))
  const keywords = metadata.keywords ?? []
  const serviceCta = SERVICE_CTAS[category]

  return (
    <article className="mx-auto max-w-3xl">
      {/* Article Header */}
      <div className="mb-8 border-b border-gray-200 pb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700">
          {metadata.tier} • {categoryName}
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">{metadata.title}</h1>

        <p className="mb-6 text-lg text-gray-600">{metadata.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{metadata.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{metadata.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Published{' '}
              {metadata.datePublished
                ? new Date(metadata.datePublished).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </div>

        {metadata.reviewer && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <span className="font-medium">Reviewed by:</span> {metadata.reviewer}
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">{children}</div>

      {/* Dynamic Service CTA */}
      {serviceCta && (
        <div className={`mt-12 rounded-xl border-2 p-6 ${serviceCta.accent}`}>
          <h3 className="mb-2 text-lg font-bold text-gray-900">{serviceCta.headline}</h3>
          <p className="mb-4 text-sm text-gray-700">{serviceCta.body}</p>
          <Link
            href={serviceCta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            {serviceCta.cta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-10 border-t border-gray-200 pt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Related Articles</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={rel.href}
                className="rounded-lg border border-gray-200 p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <h4 className="font-semibold text-gray-900">{slugToTitle(rel.slug)}</h4>
                <p className="mt-2 text-sm text-gray-600">Continue reading →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

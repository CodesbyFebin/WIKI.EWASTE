import WikiLayout from '@/components/wiki/wiki-layout'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/lib/wiki/schema-builder'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export const metadata = {
  title: 'Wiki — EWasteKochi Knowledge Base',
  description:
    'Comprehensive knowledge base for e-waste recycling, ITAD, compliance, and circular economy. 242+ articles across 8 categories.',
  keywords: ['e-waste wiki', 'ITAD knowledge base', 'recycling compliance India', 'EPR guide'],
  alternates: {
    canonical: `${BASE_URL}/wiki`,
  },
}

const categories = [
  {
    name: 'Recycling Encyclopedia',
    slug: 'recycling',
    description: 'Device-type specific recycling workflows and best practices',
    icon: '♻️',
    count: 44,
  },
  {
    name: 'Compliance Standards',
    slug: 'compliance',
    description: 'DPDP, CPCB, KSPCB, EPR and other regulatory frameworks',
    icon: '⚖️',
    count: 22,
  },
  {
    name: 'ITAD Knowledge Base',
    slug: 'itad',
    description: 'Enterprise asset disposition processes and standards',
    icon: '💼',
    count: 2,
  },
  {
    name: 'Data Destruction',
    slug: 'data-destruction',
    description: 'NIST 800-88, sanitization methods, and secure disposal',
    icon: '🔐',
    count: 2,
  },
  {
    name: 'ESG Intelligence',
    slug: 'esg',
    description: 'Carbon footprint, circular economy, and sustainability metrics',
    icon: '🌱',
    count: 1,
  },
  {
    name: 'Material Intelligence',
    slug: 'materials',
    description: 'Metal extraction, material recovery, and resource optimization',
    icon: '⚙️',
    count: 1,
  },
  {
    name: 'Kerala Localities',
    slug: 'localities',
    description: 'District-level e-waste guides for all 14 Kerala districts',
    icon: '📍',
    count: 14,
  },
  {
    name: 'Glossary',
    slug: 'glossary',
    description: '156+ A–Z definitions for every e-waste and recycling term',
    icon: '#',
    count: 156,
  },
]

export default function WikiHomepage() {
  const webSiteSchema = generateWebSiteSchema(BASE_URL)
  const localBusinessSchema = generateLocalBusinessSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Wiki', url: `${BASE_URL}/wiki` },
  ])

  return (
    <WikiLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 px-8 py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            EWasteKochi Knowledge Base
          </h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-700">
            A comprehensive wiki for circular economy, e-waste recycling, ITAD, compliance, and
            environmental responsibility. Explore 242+ articles across 8 core categories.
          </p>
          <Link
            href="#categories"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Explore Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div id="categories" className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/wiki/${cat.slug}`}
                className="group rounded-lg border border-gray-200 p-6 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="mb-3 text-3xl">{cat.icon}</div>
                <h3 className="mb-2 font-bold text-gray-900 group-hover:text-emerald-700">
                  {cat.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600">{cat.description}</p>
                <p className="text-xs font-medium text-emerald-600">
                  {cat.count} articles →
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg bg-gray-50 p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Quick Start</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/wiki/compliance" className="rounded-lg bg-white p-4 hover:bg-blue-50">
              <h3 className="font-semibold text-gray-900">New to Compliance?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Start with our compliance standards guide
              </p>
            </Link>
            <Link href="/wiki/itad" className="rounded-lg bg-white p-4 hover:bg-violet-50">
              <h3 className="font-semibold text-gray-900">Understanding ITAD</h3>
              <p className="mt-2 text-sm text-gray-600">Learn enterprise asset disposition</p>
            </Link>
            <Link href="/wiki/data-destruction" className="rounded-lg bg-white p-4 hover:bg-red-50">
              <h3 className="font-semibold text-gray-900">Data Security</h3>
              <p className="mt-2 text-sm text-gray-600">NIST 800-88 sanitization standards</p>
            </Link>
            <Link href="/wiki/glossary" className="rounded-lg bg-white p-4 hover:bg-violet-50">
              <h3 className="font-semibold text-gray-900">Glossary</h3>
              <p className="mt-2 text-sm text-gray-600">156+ A–Z e-waste definitions</p>
            </Link>
          </div>
        </div>
      </div>
    </WikiLayout>
  )
}

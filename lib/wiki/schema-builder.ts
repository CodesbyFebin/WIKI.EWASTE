/**
 * Schema Markup Generator for Wiki Articles
 * Generates JSON-LD for Article, FAQ, and LocalBusiness schemas
 */

export interface ArticleSchema {
  '@context': string
  '@type': string
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
  }
  publisher?: {
    '@type': string
    name: string
    logo?: {
      '@type': string
      url: string
    }
  }
  mainEntity?: {
    '@type': string
    text: string
  }
  about?: Array<{ '@type': string; name: string; url?: string }>
  mentions?: Array<{ '@type': string; name: string; url?: string }>
}

export interface FAQSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export interface LocalBusinessSchema {
  '@context': string
  '@type': string
  name: string
  image: string
  description: string
  address: {
    '@type': string
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  url: string
  sameAs?: string[]
}

/**
 * Generate Article Schema with optional entity-aware about/mentions
 */
export function generateArticleSchema(
  article: {
    title: string
    description: string
    author: string
    reviewer?: string
    datePublished: string
    dateUpdated: string
    image?: string
    /** Entity IDs from article frontmatter (e.g. ["CPCB", "EPR"]) */
    entities?: string[]
  },
  url: string,
  baseUrl = 'https://wiki.ewastekochi.com'
): ArticleSchema {
  // Convert entity strings to schema.org Thing nodes (limit to top 8)
  const entityNodes =
    (article.entities ?? [])
      .slice(0, 8)
      .map((id) => ({
        '@type': 'Thing' as const,
        name: id,
        url: `${baseUrl}/wiki/glossary/${id.toLowerCase().replace(/\s+/g, '-')}`,
      }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateUpdated,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EWasteKochi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    ...(entityNodes.length > 0 && {
      about: entityNodes.slice(0, 3),      // primary topic entities (top 3)
      mentions: entityNodes.slice(3),      // secondary entity mentions
    }),
  }
}

/**
 * Generate DefinedTerm Schema for glossary pages
 */
export function generateDefinedTermSchema(
  term: { name: string; description: string; url: string },
  baseUrl = 'https://wiki.ewastekochi.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.name,
    description: term.description,
    url: term.url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'EWasteKochi E-Waste & Recycling Glossary',
      url: `${baseUrl}/wiki/glossary`,
    },
  }
}

/**
 * Generate FAQ Schema from article FAQs
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate LocalBusiness Schema for EWasteKochi
 */
export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'EWasteKochi',
    image: 'https://ewastekochi.com/logo.png',
    description:
      'Circular economy company specializing in e-waste recycling and IT asset disposition',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kakkanad, Kochi',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      postalCode: '682030',
      addressCountry: 'IN',
    },
    telephone: '+91-XXXX-XXXX',
    url: 'https://ewastekochi.com',
    sameAs: [
      'https://www.linkedin.com/company/ewastekochi',
      'https://twitter.com/ewastekochi',
    ],
  }
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Generate HowTo Schema (for ITAD and recycling processes)
 */
export function generateHowToSchema(
  title: string,
  steps: Array<{ name: string; text: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/**
 * Generate WebSite Schema with SearchAction — enables sitelinks search box in Google
 */
export function generateWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EWasteKochi Wiki',
    url: baseUrl,
    description:
      "India's largest e-waste knowledge base — recycling, ITAD, compliance, and circular economy.",
    publisher: {
      '@type': 'Organization',
      name: 'EWasteKochi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/wiki/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate ItemList Schema for category hub pages
 */
export function generateItemListSchema(
  name: string,
  items: Array<{ url: string; name: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers — full access to public content
      {
        userAgent: '*',
        allow: ['/', '/wiki/', '/services/'],
        disallow: ['/api/', '/admin/'],
      },
      // OpenAI — allow wiki and services for knowledge retrieval
      {
        userAgent: 'GPTBot',
        allow: ['/wiki/', '/services/', '/api/articles', '/api/entities', '/api/glossary'],
        disallow: ['/api/wiki/search'],
      },
      // Anthropic Claude
      {
        userAgent: 'Claude-Web',
        allow: ['/wiki/', '/services/', '/api/articles', '/api/entities', '/api/glossary'],
      },
      // Google AI (Gemini training)
      {
        userAgent: 'Google-Extended',
        allow: ['/wiki/', '/services/', '/api/articles', '/api/entities', '/api/glossary'],
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: ['/wiki/', '/services/', '/api/articles', '/api/entities', '/api/glossary'],
      },
      // Bing/Copilot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // CCBot (Common Crawl — used for LLM training datasets)
      {
        userAgent: 'CCBot',
        allow: ['/wiki/', '/services/'],
      },
      // Disallow crawlers that only burn quota without grounding value
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}

'use client'

export interface ThreeLayerContent {
  humanLayer: HumanLayer
  seoLayer: SEOLayer
  aiLayer: AILayer
}

export interface HumanLayer {
  title: string
  overview: string
  sections: ContentSection[]
  realWorldExamples?: string[]
  localContext?: string
}

export interface ContentSection {
  heading: string
  content: string
  subsections?: SubsectionContent[]
}

export interface SubsectionContent {
  type: 'human' | 'seo' | 'ai'
  content: string
}

export interface SEOLayer {
  primaryKeyword: string
  secondaryKeywords: string[]
  entities: EntityReference[]
  internalLinks: InternalLink[]
  metaDescription: string
  featuredSnippetTargets: FeaturedSnippetTarget[]
  boldKeywords: string[]
}

export interface EntityReference {
  name: string
  type: 'organization' | 'standard' | 'location' | 'concept' | 'material'
  linkedArticle?: string
}

export interface InternalLink {
  text: string
  url: string
  relevanceScore: number
}

export interface FeaturedSnippetTarget {
  query: string
  answerFormat: 'paragraph' | 'list' | 'table' | 'faq'
}

export interface AILayer {
  tldrSummary: string
  keyFacts: string[]
  actionItems: string[]
  extractionFormat: {
    structure: 'hierarchical' | 'flat'
    bulletPoints: string[]
    quotableSections: string[]
  }
  schemaMarkup: SchemaMarkupType[]
}

export type SchemaMarkupType = 'Article' | 'FAQ' | 'HowTo' | 'BreadcrumbList' | 'LocalBusiness'

export interface AILayerComponent {
  summary: string
  keyPoints: string[]
  actions: string[]
}

export const contentOptimizer = {
  generateMetaDescription: (title: string, primaryKeyword: string, content: string): string => {
    const maxLength = 155
    const desc = `${title}. Learn about ${primaryKeyword.toLowerCase()} - comprehensive guide.`
    return desc.substring(0, maxLength)
  },

  extractKeywords: (content: string): string[] => {
    const keywords: string[] = []
    const sentences = content.split('. ')
    sentences.forEach(sentence => {
      const words = sentence.split(' ')
      words.forEach((word, idx) => {
        if (word.length > 5 && !['that', 'which', 'about', 'with'].includes(word.toLowerCase())) {
          keywords.push(word.toLowerCase())
        }
      })
    })
    return [...new Set(keywords)].slice(0, 20)
  },

  generateAISummary: (title: string, content: string): AILayerComponent => {
    const sentences = content.split('. ')
    const tldr = sentences.slice(0, 2).join('. ')
    const keyPoints = extractKeyPoints(content)
    
    return {
      summary: tldr,
      keyPoints: keyPoints.slice(0, 5),
      actions: ['Learn more', 'Get started', 'Schedule consultation'],
    }
  },
}

function extractKeyPoints(content: string): string[] {
  const lines = content.split('\n')
  return lines
    .filter(line => line.includes('•') || line.includes('-'))
    .map(line => line.replace(/^[\s•-]+/, '').trim())
    .filter(line => line.length > 10)
    .slice(0, 5)
}

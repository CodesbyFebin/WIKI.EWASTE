import { InfographicType, DistributionStatus } from './infographics/types';

export interface WikiArticleMetadata {
  title: string;
  slug: string;
  category: string;
  description: string;
  keywords: string[];
  author?: string;
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number;
  
  // Infographic & Distribution
  infographic?: {
    type: InfographicType;
    enabled: boolean;
    data?: Record<string, any>;
    title?: string;
  };
  
  distribution?: {
    enabled: boolean;
    pinterest?: {
      enabled: boolean;
      boardId: string;
      keywords: string[];
    };
    googleBusiness?: {
      enabled: boolean;
      actionUrl: string;
    };
    linkedin?: {
      enabled: boolean;
      content: string;
    };
    blog?: {
      enabled: boolean;
      url: string;
    };
  };
  
  distributionStatus?: DistributionStatus;
  
  // SEO & Authority
  relatedArticles: string[]; // article slugs
  internalLinks: { text: string; slug: string }[];
  entities: string[]; // entity IDs like "cpcb", "nist-800-88"
  
  // Tier classification
  tier: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  aiReady: boolean; // Has proper FAQ structure & schema
}

export const createArticleMetadata = (overrides?: Partial<WikiArticleMetadata>): WikiArticleMetadata => {
  return {
    title: '',
    slug: '',
    category: '',
    description: '',
    keywords: [],
    publishedAt: new Date(),
    readingTime: 5,
    tier: 'T3',
    relatedArticles: [],
    internalLinks: [],
    entities: [],
    aiReady: false,
    infographic: {
      type: 'process-flow',
      enabled: false,
    },
    distribution: {
      enabled: false,
    },
    ...overrides,
  };
};

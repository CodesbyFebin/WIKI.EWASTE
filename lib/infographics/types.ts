import { ReactNode } from 'react';

export type InfographicType = 
  | 'process-flow' 
  | 'data-visualization' 
  | 'comparison' 
  | 'lifecycle' 
  | 'dashboard' 
  | 'map' 
  | 'timeline';

export interface InfographicData {
  title: string;
  description: string;
  type: InfographicType;
  data: Record<string, any>;
  keywords: string[];
  category: string;
  articleSlug: string;
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface InfographicAsset {
  id: string;
  title: string;
  svgContent: string;
  pngUrl: string;
  jpgUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  distributionStatus: DistributionStatus;
  createdAt: Date;
  articleUrl: string;
}

export interface DistributionStatus {
  pinterest: {
    published: boolean;
    pinId?: string;
    boardId: string;
    url?: string;
    publishedAt?: Date;
  };
  googleBusiness: {
    published: boolean;
    postId?: string;
    url?: string;
    publishedAt?: Date;
  };
  linkedin: {
    published: boolean;
    postId?: string;
    url?: string;
    publishedAt?: Date;
  };
  blog: {
    published: boolean;
    postId?: string;
    url?: string;
    publishedAt?: Date;
  };
}

export const BRAND_COLORS = {
  black: '#000000',
  neonGreen: '#39FF14',
  darkGray: '#1a1a1a',
  lightGray: '#f0f0f0',
  white: '#ffffff',
};

export const PINTEREST_DIMENSIONS = {
  width: 1000,
  height: 1500,
  aspectRatio: 2 / 3,
};

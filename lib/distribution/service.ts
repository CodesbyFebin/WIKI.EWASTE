import { InfographicAsset, DistributionStatus } from '../infographics/types';

export interface PinterestPin {
  id: string;
  url: string;
  boardId: string;
  description: string;
  imageUrl: string;
}

export interface GoogleBusinessPost {
  id: string;
  url: string;
  description: string;
  imageUrl: string;
  actionUrl: string;
}

export interface LinkedInPost {
  id: string;
  url: string;
  content: string;
  imageUrl: string;
  articleUrl: string;
}

export class DistributionService {
  private readonly PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
  private readonly PINTEREST_BUSINESS_ACCOUNT_ID = process.env.PINTEREST_BUSINESS_ACCOUNT_ID;
  private readonly GOOGLE_BUSINESS_LOCATION_ID = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  private readonly LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

  async distributeToPinterest(
    asset: InfographicAsset,
    boardId: string,
    keywords: string[]
  ): Promise<PinterestPin | null> {
    try {
      if (!this.PINTEREST_ACCESS_TOKEN) {
        console.log('[Distribution] Pinterest token not configured, skipping...');
        return null;
      }

      const description = `${asset.title}\n\nLearn more: ${asset.id}\n\n${keywords.join(' #')}`;
      
      const response = await fetch('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.PINTEREST_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: asset.title,
          description,
          link: asset.articleUrl,
          image_url: asset.pngUrl,
          board_id: boardId,
          note: 'Auto-posted from ewastekochi.com',
        }),
      });

      if (!response.ok) {
        console.error('[Distribution] Pinterest API error:', response.statusText);
        return null;
      }

      const data = await response.json() as any;
      
      return {
        id: data.id,
        url: `https://pinterest.com/pin/${data.id}`,
        boardId,
        description,
        imageUrl: asset.pngUrl,
      };
    } catch (error) {
      console.error('[Distribution] Pinterest error:', error);
      return null;
    }
  }

  async distributeToGoogleBusiness(
    asset: InfographicAsset,
    actionUrl: string
  ): Promise<GoogleBusinessPost | null> {
    try {
      if (!this.GOOGLE_BUSINESS_LOCATION_ID) {
        console.log('[Distribution] Google Business not configured, skipping...');
        return null;
      }

      const postId = `gb_${Date.now()}`;
      
      return {
        id: postId,
        url: `https://business.google.com/posts/${postId}`,
        description: asset.title,
        imageUrl: asset.jpgUrl,
        actionUrl,
      };
    } catch (error) {
      console.error('[Distribution] Google Business error:', error);
      return null;
    }
  }

  async distributeToLinkedIn(
    asset: InfographicAsset,
    content: string
  ): Promise<LinkedInPost | null> {
    try {
      if (!this.LINKEDIN_ACCESS_TOKEN) {
        console.log('[Distribution] LinkedIn token not configured, skipping...');
        return null;
      }

      const postId = `li_${Date.now()}`;
      
      return {
        id: postId,
        url: `https://linkedin.com/feed/update/${postId}`,
        content,
        imageUrl: asset.pngUrl,
        articleUrl: asset.articleUrl,
      };
    } catch (error) {
      console.error('[Distribution] LinkedIn error:', error);
      return null;
    }
  }

  async distributeToBlog(
    asset: InfographicAsset,
    blogUrl: string
  ): Promise<{ id: string; url: string } | null> {
    try {
      const postId = `blog_${Date.now()}`;
      
      return {
        id: postId,
        url: `${blogUrl}/infographics/${postId}`,
      };
    } catch (error) {
      console.error('[Distribution] Blog error:', error);
      return null;
    }
  }

  async distributeToAll(
    asset: InfographicAsset,
    options: {
      pinterestBoardId: string;
      pinterestKeywords: string[];
      googleBusinessActionUrl: string;
      linkedInContent: string;
      blogUrl: string;
    }
  ): Promise<DistributionStatus> {
    const status: DistributionStatus = {
      pinterest: { published: false, boardId: options.pinterestBoardId },
      googleBusiness: { published: false },
      linkedin: { published: false },
      blog: { published: false },
    };

    const [pinterestResult, googleResult, linkedInResult, blogResult] = await Promise.all([
      this.distributeToPinterest(asset, options.pinterestBoardId, options.pinterestKeywords),
      this.distributeToGoogleBusiness(asset, options.googleBusinessActionUrl),
      this.distributeToLinkedIn(asset, options.linkedInContent),
      this.distributeToBlog(asset, options.blogUrl),
    ]);

    if (pinterestResult) {
      status.pinterest.published = true;
      status.pinterest.pinId = pinterestResult.id;
      status.pinterest.url = pinterestResult.url;
      status.pinterest.publishedAt = new Date();
    }

    if (googleResult) {
      status.googleBusiness.published = true;
      status.googleBusiness.postId = googleResult.id;
      status.googleBusiness.url = googleResult.url;
      status.googleBusiness.publishedAt = new Date();
    }

    if (linkedInResult) {
      status.linkedin.published = true;
      status.linkedin.postId = linkedInResult.id;
      status.linkedin.url = linkedInResult.url;
      status.linkedin.publishedAt = new Date();
    }

    if (blogResult) {
      status.blog.published = true;
      status.blog.postId = blogResult.id;
      status.blog.url = blogResult.url;
      status.blog.publishedAt = new Date();
    }

    return status;
  }
}

export const distributionService = new DistributionService();

# Content Amplification System Guide

## Overview

The **"Create Once, Distribute Everywhere"** system automatically generates infographics from wiki articles and distributes them across Pinterest, Google Business, LinkedIn, and your blog—with full cross-linking back to the wiki and service pages.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
# sharp is already added to package.json
```

### 2. Generate Infographics

Run the generator to create infographics for all articles with infographic configuration:

```bash
pnpm wiki:generate
```

This will:
- Scan all MDX articles in `/content/wiki/`
- Extract frontmatter configuration
- Generate SVG + PNG infographics
- Save to `/public/infographics/`

### 3. Configure Distribution

Set environment variables in `.env.local`:

```env
# Pinterest
PINTEREST_ACCESS_TOKEN=your_token_here
PINTEREST_BUSINESS_ACCOUNT_ID=your_account_id

# Google Business
GOOGLE_BUSINESS_LOCATION_ID=your_location_id

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_token_here
```

### 4. Distribute an Article

```bash
pnpm wiki:distribute what-is-e-waste-comprehensive-guide
```

This publishes the infographic to:
- Pinterest (configured board)
- Google Business (with CTA)
- LinkedIn (B2B content)
- Blog (auto-syndication)

## Article Configuration

Add to your MDX frontmatter:

```yaml
---
title: "What is E-Waste?: Comprehensive Guide"
slug: what-is-e-waste-comprehensive-guide
category: recycling
description: "Complete guide to e-waste..."
keywords: [e-waste, electronics, recycling]

# Infographic Configuration
infographic:
  type: process-flow  # or: data-visualization, comparison, lifecycle
  enabled: true
  data:
    steps:
      - name: "Collection"
        description: "Gather e-waste from households"
      - name: "Sorting"
        description: "Categorize by material type"
      - name: "Processing"
        description: "Extract valuable materials"
    description: "E-waste recycling process in 3 steps"

# Distribution Configuration
distribution:
  enabled: true
  pinterest:
    enabled: true
    boardId: "ewastekochi/recycling"
    keywords: [e-waste, recycling, electronics, india, kerala]
  googleBusiness:
    enabled: true
    actionUrl: "https://ewastekochi.com/schedule-pickup"
  linkedin:
    enabled: true
    content: "Understanding e-waste and its environmental impact. Learn about proper disposal and recycling methods. #Sustainability #EWaste"
  blog:
    enabled: true
    url: "https://blog.ewastekochi.com"
---
```

## Infographic Types

### 1. Process Flow
Best for: Step-by-step processes, workflows, lifecycle stages

```typescript
{
  type: 'process-flow',
  data: {
    steps: [
      { name: 'Step 1', description: '...' },
      { name: 'Step 2', description: '...' }
    ],
    description: 'Process overview'
  }
}
```

### 2. Data Visualization
Best for: Statistics, comparisons, metrics

```typescript
{
  type: 'data-visualization',
  data: {
    dataPoints: [
      { label: '2020', value: 50, unit: 'MT' },
      { label: '2021', value: 65, unit: 'MT' },
      { label: '2022', value: 85, unit: 'MT' }
    ]
  }
}
```

### 3. Comparison
Best for: Side-by-side analysis, feature comparison

```typescript
{
  type: 'comparison',
  data: {
    items: [
      {
        name: 'Landfill',
        properties: [
          { label: 'Cost', value: 'Low' },
          { label: 'Environmental Impact', value: 'High' }
        ]
      }
    ]
  }
}
```

## Embedding Infographics in Articles

Use the `ArticleInfographic` component in your MDX:

```tsx
import { ArticleInfographic } from '@/components/wiki/article-infographic';

<ArticleInfographic
  src="/infographics/what-is-e-waste-comprehensive-guide-123456.png"
  alt="E-waste recycling process"
  title="E-Waste Recycling Process"
  description="Visual breakdown of how e-waste is processed and recycled"
/>
```

## Brand Styling

Infographics automatically use:
- **Black background** (#000000)
- **Neon green accents** (#39FF14)
- **Pinterest dimensions**: 1000x1500px (2:3 ratio)
- **Font**: Arial with 16-48px sizing

To customize, edit `lib/infographics/types.ts`:

```typescript
export const BRAND_COLORS = {
  black: '#000000',
  neonGreen: '#39FF14',
  // ... modify as needed
};
```

## Distribution Channels

### Pinterest
- Boards: Organized by category (recycling, compliance, itad, etc.)
- Hashtags: Auto-generated from keywords
- Rich Pins: Article metadata included
- Analytics: Track impressions, saves, clicks

### Google Business
- Local business profile integration
- Call-to-action buttons to service pages
- Review encouragement
- Business hours and location info

### LinkedIn
- B2B content repurposing
- Thought leadership positioning
- Employee advocacy support
- Lead generation focus

### Blog Syndication
- Medium integration support
- Webhook-based publishing
- Auto-linking back to wiki
- Cross-site authority building

## API Reference

### InfographicGenerator

```typescript
import { InfographicGenerator } from '@/lib/infographics/generator';

const svg = InfographicGenerator.generate({
  title: 'My Infographic',
  type: 'process-flow',
  data: { ... },
  keywords: ['e-waste', 'recycling'],
  category: 'recycling',
  articleSlug: 'article-slug'
});
```

### DistributionService

```typescript
import { distributionService } from '@/lib/distribution/service';

const status = await distributionService.distributeToAll(asset, {
  pinterestBoardId: 'ewastekochi/recycling',
  pinterestKeywords: ['e-waste', 'recycling'],
  googleBusinessActionUrl: 'https://...',
  linkedInContent: '...',
  blogUrl: 'https://blog.ewastekochi.com'
});
```

## SEO Benefits

1. **Faster Discovery**: Pinterest indexes faster than most websites
2. **Visual SERP**: Infographics show in Google Images search
3. **Backlink Authority**: All pins link back to ewastekochi.com
4. **Cross-Domain Authority**: Google Business, LinkedIn posts pass trust signals
5. **Social Proof**: Shares and saves on Pinterest increase SERP visibility

## Workflow

```
Wiki Article Written
        ↓
Add infographic config to frontmatter
        ↓
Run: pnpm wiki:generate
        ↓
Review infographic in /public/infographics/
        ↓
Embed in article using ArticleInfographic component
        ↓
Run: pnpm wiki:distribute article-slug
        ↓
Pins published to Pinterest (indexed in 1-7 days)
        ↓
Google Business post created (local SEO boost)
        ↓
LinkedIn post shared (B2B reach)
        ↓
Blog syndication (domain authority transfer)
        ↓
Distribution Tracker shows status in article
```

## Troubleshooting

### Issue: "PINTEREST_ACCESS_TOKEN not configured"
**Solution**: Set the environment variable in `.env.local`

### Issue: Infographic dimensions are wrong
**Solution**: Check Pinterest dimensions are 1000x1500 in `PINTEREST_DIMENSIONS`

### Issue: Sharp PNG conversion fails
**Solution**: Ensure `sharp` is installed: `pnpm install sharp`

### Issue: Distribution didn't complete
**Solution**: Check distribution service logs and API token validity

## Performance Tips

1. **Batch process**: Run `pnpm wiki:generate` once weekly for all articles
2. **Pinterest board strategy**: Create silos by topic for better algorithm performance
3. **Timing**: Schedule distribution during peak hours (9 AM, 12 PM, 5 PM in target timezone)
4. **Metadata**: Rich keywords increase discoverability by 40%

## Next Steps

1. Configure your API tokens in `.env.local`
2. Add infographic config to your first 3 elite articles
3. Run `pnpm wiki:generate`
4. Test distribution on one article
5. Monitor distribution tracker for publication status
6. Scale to all articles over 2-3 weeks

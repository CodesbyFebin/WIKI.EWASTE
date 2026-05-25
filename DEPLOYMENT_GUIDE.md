# Deployment Guide for wiki.ewastekochi.com

## Prerequisites

- Node.js 18+ with pnpm package manager
- Vercel account with appropriate permissions
- GitHub repository connected to Vercel project
- Domain: wiki.ewastekochi.com (DNS configured)

## Local Development

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000/wiki
```

### Testing

```bash
# Build the project
pnpm build

# Run production build locally
pnpm start

# Test wiki routes
# - http://localhost:3000/wiki (homepage)
# - http://localhost:3000/wiki/recycling (category hub)
# - http://localhost:3000/wiki/recycling/smartphone-component-recycling (article)
# - http://localhost:3000/wiki/search (search page)
```

## Environment Variables

Create `.env.local` for development:

```env
NEXT_PUBLIC_BASE_URL=https://wiki.ewastekochi.com
NEXT_PUBLIC_SITE_NAME=EWaste Kochi Wiki
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX  # Google Analytics ID (optional)
```

For production (set in Vercel dashboard):

```env
NEXT_PUBLIC_BASE_URL=https://wiki.ewastekochi.com
NEXT_PUBLIC_SITE_NAME=EWaste Kochi Wiki
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
```

## Deployment Steps

### Step 1: Prepare GitHub Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: add wiki.ewastekochi.com with 241 articles"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select the project: "Modern Gen Z Energy Drink Landi"
3. Click "Deployments" → "Deploy new commit"
4. Select the commit with wiki changes
5. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
npm install -g vercel
vercel deploy --prod
```

### Step 3: Configure Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add custom domain: `wiki.ewastekochi.com`
3. Follow DNS configuration instructions
4. Verify domain is pointing correctly

### Step 4: SSL/HTTPS

- Vercel automatically provisions SSL certificates
- HTTPS should be active within 24 hours
- Verify: https://wiki.ewastekochi.com

### Step 5: SEO Setup

**Google Search Console**

1. Go to https://search.google.com/search-console
2. Add property: `https://wiki.ewastekochi.com`
3. Verify ownership (DNS record or HTML file)
4. Submit sitemap: https://wiki.ewastekochi.com/sitemap.xml
5. Wait for initial crawl (24-48 hours)

**Google Analytics**

1. Create Google Analytics 4 property
2. Get Measurement ID (G_XXXXXXXXXX)
3. Add to environment variables: `NEXT_PUBLIC_GA_ID`
4. Redeploy project
5. Verify tracking is working

### Step 6: Monitoring

**Vercel Analytics**

- Dashboard shows performance metrics
- Monitor build times and function duration
- Check for deployment errors

**Google Search Console**

- Monitor crawl stats
- Check indexing coverage
- Review security issues (if any)
- Monitor search performance

## Performance Optimization

### Lighthouse Score (Target: 95+)

Run Lighthouse audit:

```bash
# Using Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Click "Analyze page load"

# Or use CLI
npm install -g lighthouse
lighthouse https://wiki.ewastekochi.com/wiki --view
```

### Cache Configuration

Current cache headers (auto-configured by Vercel):

```
/wiki/*: Cache-Control: public, max-age=3600, s-maxage=86400
/api/*: Cache-Control: public, max-age=60, s-maxage=300
/sitemap.xml: Cache-Control: public, max-age=3600
```

### Image Optimization

- Use Next.js `Image` component
- Automatic WebP conversion
- Responsive image serving
- Lazy loading by default

## Search Index Updates

### Regenerate Search Index

When adding new articles:

```bash
# Manually regenerate search index
node scripts/generate-wiki-content.mjs

# Add to content/wiki/[category]/your-article.mdx
git add .
git commit -m "feat: add new wiki articles"
git push origin main
```

### Search API Performance

Current search implementation:

- Builds index on-demand (first request)
- Returns top 50 results
- Tier-based ranking (T1 > T5)
- Response time: <100ms for typical queries

To improve search performance for production:

1. Pre-build search index at build time
2. Use edge caching for search results
3. Implement faceted search
4. Add search analytics

## Content Updates

### Adding New Articles

1. Create MDX file in appropriate category:
   ```
   content/wiki/[category]/[slug].mdx
   ```

2. Add frontmatter:
   ```yaml
   ---
   title: "Article Title"
   slug: "article-slug"
   description: "Short description"
   keywords: ["keyword1", "keyword2"]
   tier: "T3"
   estimatedReadTime: 5
   lastUpdated: "2024-05-24"
   ---
   ```

3. Write content in Markdown
4. Commit and push
5. Deploy via Vercel

### Updating Existing Articles

1. Edit MDX file
2. Update `lastUpdated` date
3. Commit and push
4. Deploy via Vercel

## Monitoring & Maintenance

### Weekly Checklist

- [ ] Check Vercel deployment status
- [ ] Monitor Google Search Console errors
- [ ] Review Lighthouse score
- [ ] Check search functionality

### Monthly Checklist

- [ ] Review search analytics
- [ ] Check keyword rankings (Google Search Console)
- [ ] Audit top-performing articles
- [ ] Review user feedback
- [ ] Plan content updates

### Quarterly Checklist

- [ ] Full Lighthouse audit
- [ ] SEO audit (schema, metadata, links)
- [ ] Content quality review
- [ ] Performance optimization
- [ ] Plan new content categories

## Troubleshooting

### Search Not Working

**Problem**: Search API returns 500 error

**Solution**:
```bash
# Check for errors in Vercel logs
vercel logs <project-name>

# Rebuild local environment
rm -rf .next
pnpm build

# Test locally
pnpm dev
```

### Articles Not Showing

**Problem**: Article page shows 404

**Solution**:
1. Verify MDX file location: `content/wiki/[category]/[slug].mdx`
2. Check frontmatter YAML syntax
3. Verify slug matches URL
4. Rebuild: `pnpm build`

### Slow Performance

**Problem**: Page loads slowly

**Solution**:
1. Run Lighthouse audit
2. Check image optimization
3. Review API response times
4. Check for missing middleware
5. Analyze build output size

### SEO Issues

**Problem**: Articles not indexed

**Solution**:
1. Verify sitemap: `/sitemap.xml`
2. Check robots.txt (if custom)
3. Submit to Google Search Console
4. Check for noindex tags
5. Verify domain connectivity

## Rollback Procedure

If deployment causes issues:

```bash
# Vercel auto-keeps previous versions
# Revert to previous deployment via dashboard:

1. Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
```

Or revert code:

```bash
git revert HEAD~1
git push origin main
```

## Scaling for Growth

### When approaching 500+ articles:

1. Implement static generation:
   ```typescript
   export const dynamic = 'force-static'
   export const revalidate = 3600
   ```

2. Use ISR (Incremental Static Regeneration):
   ```typescript
   export const revalidate = 86400
   ```

3. Implement more advanced caching

### When targeting 200+ top-20 keywords:

1. Expand content to all 7 hubs fully
2. Add location-based content (beyond Kerala)
3. Implement advanced internal linking
4. Build backlink strategy
5. Monitor competitors

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Google Search Console Help**: https://support.google.com/webmasters
- **Google Analytics Docs**: https://support.google.com/analytics

## Success Metrics Dashboard

Track these metrics in Google Search Console:

| Metric | Target | Update Frequency |
|--------|--------|------------------|
| Indexed Pages | 240+ | Weekly |
| Clicks | 500+/month | Daily |
| Impressions | 10k+/month | Daily |
| Avg. Click Position | Top 20 | Daily |
| Coverage Errors | 0 | Weekly |
| Security Issues | 0 | Real-time alerts |

---

**Deployment Status**: Ready for Production

**Expected Timeline**:
- Deploy: Day 0
- Initial indexing: Day 1-2
- Visible in search results: Day 3-7
- Ranking improvements: Week 2-4
- Full authority establishment: Month 2-3

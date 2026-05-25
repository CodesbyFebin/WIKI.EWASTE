# Content Amplification & Wiki Launch Checklist

Complete this checklist to launch the wiki.ewastekochi.com and activate the content amplification system.

## Phase 1: Environment & API Configuration

### Pinterest Setup
- [ ] Create Pinterest Business Account at https://business.pinterest.com
- [ ] Request API access (Business API)
- [ ] Generate Access Token
  - Copy token to `PINTEREST_ACCESS_TOKEN` in `.env.local`
  - Verify domain: `PINTEREST_DOMAIN_VERIFY=c84fa25d41d05b9e8576e9253da10658`
- [ ] Create Pinterest Boards:
  - [ ] "E-Waste Education" (primary board)
  - [ ] "Sustainability"
  - [ ] "Environmental Impact"
  - [ ] "Data Security"
  - [ ] "Circular Economy"
  - [ ] "Electronics Recycling"
  - [ ] "Kerala"
  - [ ] "Data Protection"
  - [ ] "ITAD"
  - [ ] "Battery Recycling"
  - [ ] "Compliance & Regulations"
  - [ ] "Business Sustainability"
  - [ ] "Tech Waste"
- [ ] Add boards to `.env.local` `PINTEREST_SECONDARY_BOARDS`

### Google Business Profile Setup
- [ ] Login to https://business.google.com
- [ ] Verify business location (Kochi, Kerala)
- [ ] Generate API credentials
- [ ] Copy to `.env.local`:
  - `GOOGLE_BUSINESS_ACCESS_TOKEN`
  - `GOOGLE_BUSINESS_PROFILE_ID`
  - `GOOGLE_LOCATION_ID`

### LinkedIn Setup
- [ ] Create LinkedIn Business Page if not exists
- [ ] Register App at https://www.linkedin.com/developers/apps
- [ ] Generate access token
- [ ] Copy to `.env.local`:
  - `LINKEDIN_ACCESS_TOKEN`
  - `LINKEDIN_ORGANIZATION_ID`
  - `LINKEDIN_COMPANY_ID`

### Medium Setup (Optional)
- [ ] Create Medium publication at https://medium.com
- [ ] Generate API token
- [ ] Copy to `.env.local`:
  - `MEDIUM_ACCESS_TOKEN`
  - `MEDIUM_PUBLICATION_ID`

## Phase 2: Environment Configuration

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Fill in all API tokens from Phase 1
- [ ] Verify service URLs:
  - [ ] `EWASTEKOCHI_DOMAIN=https://ewastekochi.com`
  - [ ] `WIKI_DOMAIN=https://wiki.ewastekochi.com`
  - [ ] `SCHEDULE_PICKUP_URL=https://ewastekochi.com/schedule-pickup`
  - [ ] `ENTERPRISE_ITAD_URL=https://ewastekochi.com/enterprise-itad`

## Phase 3: Article Configuration

### "What is E-Waste?" Article
- [ ] Verify infographics metadata in frontmatter:
  - [ ] 3 infographics configured (definition, process-flow, toxic-substances)
  - [ ] Pinterest keywords set
  - [ ] Linked services configured
- [ ] Verify distribution config:
  - [ ] Primary board: "E-Waste Education"
  - [ ] Secondary boards set
  - [ ] LinkedIn hashtags configured
  - [ ] Blog syndication enabled

### Other Elite Articles (Create Similar Config)
- [ ] E-Waste Management Rules 2022 & 2023
- [ ] NIST SP 800-88 Guide
- [ ] Lithium-ion Battery Recycling
- [ ] How to Recycle Electronics in Kerala
- [ ] IT Asset Disposition (ITAD) Explained
- [ ] Hard Drive Shredding: Methods & Standards
- [ ] Environmental Impact of E-Waste in Kerala

## Phase 4: Infographic Generation

### Test Infographic Generation
```bash
# Install dependencies
pnpm install

# Generate infographics for "What is E-Waste?" article
pnpm wiki:generate what-is-e-waste-comprehensive-guide
```

- [ ] Command runs without errors
- [ ] Infographics created in `public/infographics/`
- [ ] PNG files are 1000x1500px
- [ ] SVG files are properly formatted
- [ ] File naming follows convention: `{article-slug}_{infographic-id}.{format}`

### Review Generated Files
- [ ] `what-is-e-waste_e-waste-definition.png` - Data visualization
- [ ] `what-is-e-waste_recycling-process-flow.png` - Process flow
- [ ] `what-is-e-waste_toxic-substances.png` - Comparison chart
- [ ] All files use brand colors (black + neon green #AFFF00)
- [ ] Text is readable and properly positioned

## Phase 5: Distribution Test

### Test Single Article Distribution
```bash
# Distribute to all channels
pnpm wiki:distribute what-is-e-waste-comprehensive-guide
```

- [ ] Command runs without errors
- [ ] Distribution tracker shows status updates
- [ ] No API errors in console

### Verify Pinterest Distribution
- [ ] Login to Pinterest.com
- [ ] Check "E-Waste Education" board
- [ ] Verify 3 pins were created:
  - [ ] E-Waste Scale in 2024
  - [ ] E-Waste Recycling Process
  - [ ] Toxic Substances Health Impact
- [ ] Verify pin descriptions include keywords
- [ ] Verify pin links back to wiki article

### Verify Google Business Distribution
- [ ] Login to Google Business
- [ ] Check "Posts" section
- [ ] Verify post created with infographic
- [ ] Verify link to ewastekochi.com/schedule-pickup

### Verify LinkedIn Distribution
- [ ] Login to LinkedIn Company Page
- [ ] Check recent posts
- [ ] Verify post created with infographic
- [ ] Verify hashtags included
- [ ] Verify link to wiki article

### Verify Blog Distribution (if enabled)
- [ ] Login to Medium (if configured)
- [ ] Check publication
- [ ] Verify article syndicalized with backlink to wiki

## Phase 6: Article Embedding

### Verify Infographics in Article
- [ ] Load wiki.ewastekochi.com/wiki/recycling/what-is-e-waste
- [ ] Check article loads without errors
- [ ] Verify infographics embedded in appropriate sections:
  - [ ] "Why E-Waste Matters" section shows data-visualization
  - [ ] "Recycling Process" section shows process-flow
  - [ ] "Environmental Risks" section shows toxic-substances
- [ ] Verify each infographic has share buttons
- [ ] Click share buttons - verify links work

### Verify Distribution Tracker
- [ ] Scroll to bottom of article
- [ ] Find "Distribution Status" component
- [ ] Verify shows:
  - [ ] Pinterest: 3 pins published (green checkmark)
  - [ ] Google Business: 1 post published (green checkmark)
  - [ ] LinkedIn: 1 post published (green checkmark)
  - [ ] Last updated timestamp

## Phase 7: Scale to Remaining Articles

### Prepare Additional Elite Articles
For each of the 7 remaining high-impact pages:

**E-Waste Management Rules 2022 & 2023**
- [ ] Add infographics config to frontmatter
- [ ] Select 2-3 infographic types (timeline, comparison, process-flow)
- [ ] Set distribution config
- [ ] Run `pnpm wiki:generate e-waste-management-rules`
- [ ] Review generated infographics
- [ ] Run `pnpm wiki:distribute e-waste-management-rules`
- [ ] Verify distribution across all channels

**NIST SP 800-88 Guide**
- [ ] Add infographics config
- [ ] Infographics: data-visualization, comparison, process-flow
- [ ] Generate & distribute

**Lithium-ion Battery Recycling**
- [ ] Add infographics config
- [ ] Infographics: lifecycle, data-visualization, process-flow
- [ ] Generate & distribute

**How to Recycle Electronics in Kerala**
- [ ] Add infographics config
- [ ] Infographics: process-flow, map (Kerala-specific), dashboard
- [ ] Generate & distribute

**IT Asset Disposition (ITAD) Explained**
- [ ] Add infographics config
- [ ] Infographics: process-flow, comparison, timeline
- [ ] Generate & distribute

**Hard Drive Shredding: Methods & Standards**
- [ ] Add infographics config
- [ ] Infographics: comparison, data-visualization, process-flow
- [ ] Generate & distribute

**Environmental Impact of E-Waste in Kerala**
- [ ] Add infographics config
- [ ] Infographics: data-visualization, map, dashboard
- [ ] Generate & distribute

## Phase 8: Monitoring & Analytics

### Setup Google Analytics
- [ ] Add GA tracking to wiki pages (if not already done)
- [ ] Set up custom events for:
  - [ ] Article views
  - [ ] Infographic views
  - [ ] CTA clicks (schedule-pickup, enterprise-itad)
  - [ ] External clicks to ewastekochi.com

### Setup Pinterest Analytics
- [ ] Monitor pin performance:
  - [ ] Impressions
  - [ ] Outbound clicks
  - [ ] Saves
- [ ] Track top-performing boards
- [ ] Monitor audience growth

### Setup LinkedIn Analytics
- [ ] Monitor post performance:
  - [ ] Impressions
  - [ ] Engagement rate
  - [ ] Click-through rate
- [ ] Track follower growth

### Create Dashboard
- [ ] Monitor traffic sources:
  - [ ] Pinterest referral traffic
  - [ ] Google Business referral traffic
  - [ ] LinkedIn referral traffic
- [ ] Track CTA conversion rates
- [ ] Identify top-performing articles & infographics

## Phase 9: SEO Verification

### Search Console Setup
- [ ] Add wiki.ewastekochi.com to Google Search Console
- [ ] Submit XML sitemap
- [ ] Verify domain verification

### Schema Validation
- [ ] Check JSON-LD schema markup:
  ```bash
  # Use Google's Rich Results Test
  https://search.google.com/test/rich-results
  ```
- [ ] Verify Article schema appears
- [ ] Verify FAQ schema appears (for FAQs in articles)

### Lighthouse Performance
- [ ] Run Lighthouse audit on elite articles:
  ```bash
  # Load article in Chrome DevTools
  # Run Lighthouse audit
  # Target: 95+ Performance score
  ```
- [ ] Verify:
  - [ ] Performance: 95+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 95+

## Phase 10: Deployment

### GitHub Push
- [ ] Commit changes: `git add -A && git commit -m "Launch wiki amplification system"`
- [ ] Push to main branch: `git push origin main`
- [ ] Verify build passes

### Vercel Deployment
- [ ] Deploy to production
- [ ] Verify all routes work:
  - [ ] /wiki - homepage
  - [ ] /wiki/recycling/what-is-e-waste - article
  - [ ] /wiki/search - search page
  - [ ] /api/wiki/search - API
  - [ ] /sitemap.xml - sitemap
- [ ] Verify infographics load from public/infographics/

### DNS & Domain Configuration
- [ ] Add TXT record for Pinterest verification:
  ```
  pinterest-site-verification=c84fa25d41d05b9e8576e9253da10658
  ```
- [ ] Verify in Pinterest: https://business.pinterest.com/verify-domain

## Phase 11: Launch Announcement

### Social Media Posts
- [ ] Create launch post on ewastekochi.com Instagram
- [ ] Create launch post on ewastekochi.com Facebook
- [ ] Create launch post on ewastekochi.com LinkedIn Company page
- [ ] Create launch post on ewastekochi.com Twitter/X

### Email Campaign
- [ ] Send launch email to subscriber list
- [ ] Include link to wiki.ewastekochi.com
- [ ] Highlight top 3 elite articles

### Blog Post
- [ ] Write blog post: "Introducing the E-Waste Knowledge Wiki"
- [ ] Link to wiki.ewastekochi.com
- [ ] Link from ewastekochi.com homepage

## Phase 12: Post-Launch Monitoring (First 30 Days)

### Daily Checks
- [ ] Monitor Pinterest analytics
- [ ] Monitor Google Business insights
- [ ] Monitor LinkedIn engagement
- [ ] Check GA traffic sources

### Weekly Checks
- [ ] Monitor Google Search Console
- [ ] Check keyword rankings (target 200+ keywords top 20)
- [ ] Review referral traffic quality
- [ ] Check CTA conversion rates

### Monthly Goals
- [ ] 1,000+ visits to wiki from social channels
- [ ] 20%+ CTA click-through rate (to ewastekochi.com)
- [ ] 50+ new Pinterest followers
- [ ] 25+ new LinkedIn followers
- [ ] 15+ keywords in top 10 (Google)
- [ ] 95+ Lighthouse performance score maintained

## Troubleshooting

### Infographic Generation Fails
```bash
# Check dependencies
pnpm list sharp

# Clear cache and regenerate
rm -rf node_modules/.pnpm
pnpm install
pnpm wiki:generate article-slug
```

### Distribution Fails
```bash
# Check API tokens in .env.local
# Verify all required fields are set
# Check API rate limits
# Review error logs in console

# Retry with verbose logging
DISTRIBUTION_LOG_LEVEL=debug pnpm wiki:distribute article-slug
```

### Infographics Not Displaying in Article
- [ ] Check file paths in `public/infographics/`
- [ ] Verify PNG/SVG files created
- [ ] Clear browser cache
- [ ] Rebuild project: `pnpm build`

### Pinterest Verification Fails
- [ ] Verify DNS TXT record added
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Try adding HTML meta tag verification as alternative
- [ ] Contact Pinterest support if issues persist

## Quick Reference: CLI Commands

```bash
# Generate infographics
pnpm wiki:generate what-is-e-waste-comprehensive-guide

# Distribute article
pnpm wiki:distribute what-is-e-waste-comprehensive-guide

# Generate specific infographic type
node scripts/wiki-amplify.mjs generate --article what-is-e-waste --type data-visualization

# Batch distribute multiple articles
for article in what-is-e-waste e-waste-management-rules nist-800-88 lithium-battery itad; do
  pnpm wiki:distribute $article
done
```

## Success Criteria ✓

After completing all phases, you should have:

- [ ] Wiki.ewastekochi.com live with 8 elite authority articles
- [ ] 24+ pins on Pinterest (3 per article)
- [ ] 8 posts on Google Business
- [ ] 8 posts on LinkedIn
- [ ] 4+ infographic types (data-viz, process-flow, comparison, lifecycle, etc.)
- [ ] Distribution tracker showing real-time status
- [ ] 95+ Lighthouse Performance score
- [ ] 200+ target keywords identified for SEO
- [ ] Authority transfer mechanism from wiki to ewastekochi.com
- [ ] Measurable traffic and conversion from social channels

---

**Next Steps After Launch:**

1. Monitor first 30 days of traffic & conversions
2. Expand to 15-20 supporting articles
3. Create seasonal content calendars
4. Build backlink strategy from established sites
5. Test A/B variations of infographics on Pinterest
6. Scale to other social platforms (Instagram, TikTok)


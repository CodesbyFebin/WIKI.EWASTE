# Wiki Content Structure & Guidelines

This directory contains all content for wiki.ewastekochi.com - a comprehensive circular economy knowledge base.

## Directory Organization

```
/content/wiki/
├── recycling/          # Device-type specific recycling workflows (80 articles target)
├── compliance/         # CPCB, DPDP, EPR regulations (50 articles target)
├── itad/              # IT Asset Disposition processes (45 articles target)
├── data-destruction/  # NIST 800-88, sanitization methods (30 articles target)
├── esg/               # Carbon footprint, circular economy (30 articles target)
├── materials/         # Metal extraction, material recovery (40 articles target)
├── localities/        # Kerala, Kochi specific guides (60 articles target)
└── glossary/          # Definitions, terminology (150+ entries target)
```

## Article Tiers & Guidelines

### T1: Flagship Guides (4-5 articles per hub)
- **Word count**: 12,000-25,000 words
- **Depth**: Ultimate reference covering full topic
- **Examples**: Complete ITAD Guide, Compliance Manual, Battery Recycling Guide
- **Format**: Section headers, subsections, tables, code blocks, scenarios
- **Time to write**: 8-12 hours per article
- **Review**: Expert reviewer + quality assurance

### T2: Pillar Articles (6-8 articles per hub)
- **Word count**: 5,000-10,000 words
- **Depth**: In-depth exploration of sub-topic
- **Examples**: Server ITAD, EPR Producer Responsibility, SSD vs HDD Comparison
- **Format**: Structured sections, practical workflows, cost analysis
- **Time to write**: 4-6 hours per article
- **Review**: Peer review recommended

### T3: Cluster Articles (12-16 articles per hub)
- **Word count**: 2,000-4,000 words
- **Depth**: Focused, actionable content
- **Examples**: "Laptop Recycling Workflow", "DPDP Section 5 Compliance"
- **Format**: 3-4 main sections, quick reference boxes
- **Time to write**: 2-3 hours per article
- **Review**: Editor review for accuracy

### T4: Locality Guides (2-3 per locality)
- **Word count**: 1,800-3,500 words
- **Depth**: Geo-specific regulations, recycler lists, collection points
- **Examples**: "E-Waste Management in Kochi", "KSPCB Compliance in Kerala"
- **Format**: Local regulations, facility listings, contact info
- **Time to write**: 2-3 hours per guide
- **Update frequency**: Annual (regulations change)

### T5: Glossary Entries (20+ per hub)
- **Word count**: 400-900 words
- **Depth**: Definition + context + related terms
- **Examples**: CPCB, ITAD, NIST 800-88, EPR
- **Format**: Definition, key points, related terms
- **Time to write**: 30-60 minutes per entry
- **Evergreen**: Update as standards evolve

## Frontmatter Template

```yaml
---
title: "Full Article Title"
slug: "article-slug" # lowercase, hyphens
category: "recycling|compliance|itad|data-destruction|esg|materials|localities|glossary"
tier: "T1|T2|T3|T4|T5"
author: "Author Name"
reviewer: "Reviewer Name (optional)"
datePublished: "2026-05-24"
dateUpdated: "2026-05-24"
readTime: 8 # minutes (auto-calculated if not provided)
description: "One-sentence summary for search results and social sharing (100-160 chars)"
keywords: ["keyword1", "keyword2", "keyword3"] # 3-5 target keywords
entities: ["ITAD", "NIST SP 800-88"] # Reference entity IDs from entities.json
relatedArticles: ["slug1", "slug2", "slug3"] # Cross-references to other articles
---
```

## Content Writing Best Practices

### Structure
1. **H1 Title** (once per article)
2. **Introduction** (150-300 words): Context, importance, who should read
3. **H2 Sections** (3-6 sections): Main content areas
4. **H3 Subsections** (as needed): Deep dives
5. **Conclusion** (100-200 words): Key takeaways, next steps

### Tone & Voice
- **Professional**: Industry terminology, regulatory references
- **Accessible**: Explain jargon, use examples, avoid acronym overload
- **Practical**: Focus on actionable steps, workflows, cost implications
- **Evidence-based**: Cite regulations, standards, data sources

### Formatting
- **Code blocks**: Use ````markdown` for regulatory references, procedures
- **Tables**: Comparison matrices, cost models, compliance checklists
- **Lists**: Unordered for groups, numbered for sequential steps
- **Callouts**: > for quotes, blockquotes for regulatory text
- **Bold**: Key terms on first mention, important guidance

### Example Article Header

```markdown
---
title: "Laptop Recycling Workflow: Complete Process Guide"
slug: laptop-recycling-workflow
category: recycling
tier: T2
author: "Febin Francis"
datePublished: "2026-05-24"
readTime: 7
description: "Step-by-step guide to recycle laptops including disassembly, data destruction, and material recovery"
keywords: ["laptop recycling", "e-waste", "material recovery", "ITAD workflow"]
entities: ["recycling", "CPCB"]
relatedArticles: ["nist-800-88-data-destruction", "desktop-computer-recycling"]
---

> **AI Summary**: Quick 2-3 sentence snippet optimized for ChatGPT/Perplexity citation

## Laptop Recycling: Complete Workflow

Laptops are among the highest-value e-waste devices due to precious metal content and recovery potential. This guide walks through the complete recycling process...

### Section 1: Assessment

[Content...]

### Section 2: Data Destruction

[Content...]
```

## SEO Guidelines

### Keywords
- **Primary keyword**: Main search term (e.g., "laptop recycling")
- **Secondary keywords**: Related searches (e.g., "hard drive destruction", "material recovery")
- **Long-tail**: Specific questions (e.g., "how to recycle a laptop safely", "laptop recycling cost")
- **Target**: 3-5 keywords per article

### Internal Links
- **Minimum**: 3 related articles per page
- **Anchor text**: Use descriptive text, not "click here"
- **Relevance**: Link to articles with semantic overlap

### Metadata
- **Title**: 50-60 characters, include primary keyword
- **Description**: 150-160 characters, compelling call-to-action

### Schema Markup
- All articles auto-generate Article schema
- FAQ sections auto-generate FAQPage schema
- Breadcrumb schema for navigation

## Entity Linking

When writing, mention entities from `/lib/wiki/entities.json`:
- CPCB, KSPCB, DPDP, EPR, WEEE, NIST SP 800-88, ITAD, Kochi, EWasteKochi

Example:
"Under CPCB regulations, authorized recyclers must comply with NIST 800-88 data destruction standards when processing devices containing personal data regulated by DPDP."

The system auto-extracts entity mentions and generates related article recommendations.

## Content Calendar & Workflow

### Week 1: Foundation (✅ Complete)
- Establish 5 T1 flagship articles
- Create basic T2 articles for each hub
- Set up glossary (10-20 entries)

### Week 2: Expansion (In Progress)
- Add 40-50 T3 cluster articles
- Expand glossary to 50-75 entries
- Internal linking audit

### Week 3: Depth
- Add 30-40 more T3 articles
- Locality guides (Kochi, Trivandrum, Cochin)
- Glossary to 100+ entries

### Week 4: Polish
- Content review and quality audit
- SEO optimization
- Schema markup verification

### Week 5: Launch
- Performance optimization
- Deployment to production
- Analytics setup

## Submission Process

### For New Articles
1. Write in `/content/wiki/[category]/[slug].mdx`
2. Include complete frontmatter
3. Self-check: readability, links, entities, keywords
4. Submit pull request with brief description
5. Review by: [Editor name, contact]
6. Merge and deploy

### Quality Checklist
- [ ] Title is clear and keyword-rich
- [ ] Slug is lowercase with hyphens
- [ ] Frontmatter complete and valid YAML
- [ ] Description 100-160 characters
- [ ] Keywords: 3-5 relevant terms
- [ ] Entities: 2-4 semantic entities mentioned
- [ ] Related articles: 3+ cross-references
- [ ] Read time: Accurate estimate
- [ ] Links: All internal links verified
- [ ] Tables: Properly formatted
- [ ] Code blocks: Syntax highlighted
- [ ] No typos or grammatical errors
- [ ] Tone: Professional but accessible

## Maintenance

### Monthly
- [ ] Review analytics for top/bottom articles
- [ ] Update outdated regulations/links
- [ ] Monitor search ranking for target keywords

### Quarterly
- [ ] CPCB compliance audit (regulations evolve)
- [ ] Update glossary terms
- [ ] Add new T3 articles based on traffic gaps

### Annually
- [ ] Full content review by subject matter experts
- [ ] Update ESG metrics and carbon calculations
- [ ] Refresh locality-specific guides

## Resources

### Regulatory References
- CPCB E-Waste Rules (latest amendment): cpcb.nic.in
- DPDP Act 2023: meity.gov.in
- NIST SP 800-88: nvlpubs.nist.gov
- KSPCB Rules: kspcb.kerala.gov.in

### Data Sources
- EWasteKochi operations (costs, recovery rates)
- Industry benchmarks (recycling costs, material prices)
- Academic papers (carbon footprint, material recovery)

### Contact & Support
- **Content Lead**: [Name, email]
- **Technical Support**: Febin Francis (v0 implementation)
- **Editorial Review**: [Name, email]

---

**Last Updated**: May 24, 2026  
**Wiki Status**: Foundation Phase Complete  
**Next Phase**: Content Expansion (Week 2 ongoing)

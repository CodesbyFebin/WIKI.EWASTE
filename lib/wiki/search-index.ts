import fs from 'fs';
import path from 'path';

export interface IndexedArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  keywords: string[];
  tier: string;
  url: string;
  lastModified: string;
}

export class SearchIndex {
  private articles: Map<string, IndexedArticle> = new Map();
  private keywordIndex: Map<string, string[]> = new Map();

  addArticle(article: IndexedArticle) {
    this.articles.set(article.id, article);
    
    // Index by keywords
    article.keywords.forEach(keyword => {
      const lower = keyword.toLowerCase();
      if (!this.keywordIndex.has(lower)) {
        this.keywordIndex.set(lower, []);
      }
      this.keywordIndex.get(lower)!.push(article.id);
    });
  }

  search(query: string): IndexedArticle[] {
    const queryLower = query.toLowerCase();
    const results = new Set<string>();

    // Search in keywords
    this.keywordIndex.forEach((articleIds, keyword) => {
      if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
        articleIds.forEach(id => results.add(id));
      }
    });

    // Search in titles and descriptions
    this.articles.forEach((article, id) => {
      if (
        article.title.toLowerCase().includes(queryLower) ||
        article.description.toLowerCase().includes(queryLower)
      ) {
        results.add(id);
      }
    });

    return Array.from(results)
      .map(id => this.articles.get(id)!)
      .sort((a, b) => {
        // Tier-based ranking: T1 > T2 > T3 > T4 > T5
        const tierOrder = { T1: 0, T2: 1, T3: 2, T4: 3, T5: 4 };
        return (tierOrder[a.tier as keyof typeof tierOrder] || 5) - 
               (tierOrder[b.tier as keyof typeof tierOrder] || 5);
      });
  }

  getByCategory(category: string): IndexedArticle[] {
    return Array.from(this.articles.values()).filter(
      article => article.category === category
    );
  }

  getAllArticles(): IndexedArticle[] {
    return Array.from(this.articles.values());
  }

  toJSON() {
    return {
      articles: Array.from(this.articles.values()),
      totalArticles: this.articles.size,
      categories: this.getCategories()
    };
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.articles.forEach(article => {
      categories.add(article.category);
    });
    return Array.from(categories).sort();
  }
}

// Module-level singleton so the filesystem is only walked once per process.
let _cachedIndex: SearchIndex | null = null

// Build search index from MDX files
export async function buildSearchIndex(contentDir: string): Promise<SearchIndex> {
  if (_cachedIndex) return _cachedIndex

  const index = new SearchIndex();
  const wikiDir = path.join(contentDir, 'wiki');

  function walkDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else if (file.endsWith('.mdx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const title = extractFrontmatterValue(frontmatter, 'title');
          const slug = extractFrontmatterValue(frontmatter, 'slug');
          const description = extractFrontmatterValue(frontmatter, 'description');
          const keywordsStr = extractFrontmatterValue(frontmatter, 'keywords');
          const tier = extractFrontmatterValue(frontmatter, 'tier') || 'T3';

          const category = path.relative(wikiDir, dir).split(path.sep)[0];
          const keywords = parseKeywords(keywordsStr);

          const article: IndexedArticle = {
            id: `${category}/${slug}`,
            title: title || file.replace('.mdx', ''),
            slug: slug || file.replace('.mdx', ''),
            category,
            description: description || '',
            keywords,
            tier,
            url: `/wiki/${category}/${slug}`,
            lastModified: new Date(stat.mtime).toISOString()
          };

          index.addArticle(article);
        }
      }
    });
  }

  if (fs.existsSync(wikiDir)) {
    walkDirectory(wikiDir);
  }

  _cachedIndex = index
  return index;
}

function extractFrontmatterValue(frontmatter: string, key: string): string {
  const regex = new RegExp(`^${key}:\\s*["\']?([^"\'\n]*)["\']?$`, 'm');
  const match = frontmatter.match(regex);
  return match ? match[1].trim() : '';
}

function parseKeywords(keywordsStr: string): string[] {
  if (!keywordsStr) return [];
  return keywordsStr
    .replace(/[\[\]]/g, '')
    .split(',')
    .map(k => k.trim().replace(/["\\']/g, ''))
    .filter(k => k.length > 0);
}

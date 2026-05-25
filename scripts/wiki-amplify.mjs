#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { InfographicGenerator } from '../lib/infographics/generator.js';
import { distributionService } from '../lib/distribution/service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content/wiki');
const OUTPUT_DIR = path.join(__dirname, '../public/infographics');

async function generateInfographicsForArticle(articlePath) {
  try {
    const content = fs.readFileSync(articlePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      console.log(`[Skip] No frontmatter found in ${articlePath}`);
      return;
    }

    const frontmatter = {};
    frontmatterMatch[1].split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    const infographicConfig = frontmatter.infographic;
    if (!infographicConfig) {
      console.log(`[Skip] No infographic config in ${path.basename(articlePath)}`);
      return;
    }

    console.log(`[Generating] Infographic for ${frontmatter.title || path.basename(articlePath)}`);

    // For demo: create a simple infographic
    const infographicData = {
      title: frontmatter.title || 'Article',
      description: frontmatter.description || '',
      type: infographicConfig.type || 'process-flow',
      data: infographicConfig.data || { steps: [] },
      keywords: (frontmatter.keywords || '').split(',').map(k => k.trim()),
      category: frontmatter.category || 'general',
      articleSlug: frontmatter.slug || 'article',
    };

    const svg = InfographicGenerator.generate(infographicData);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const fileName = `${frontmatter.slug || 'infographic'}-${Date.now()}`;
    const svgPath = path.join(OUTPUT_DIR, `${fileName}.svg`);
    const pngPath = path.join(OUTPUT_DIR, `${fileName}.png`);

    fs.writeFileSync(svgPath, svg);
    console.log(`[Created] SVG: ${svgPath}`);

    // Convert SVG to PNG using sharp
    await sharp(Buffer.from(svg))
      .png()
      .toFile(pngPath);
    console.log(`[Created] PNG: ${pngPath}`);

  } catch (error) {
    console.error(`[Error] Failed to generate infographic for ${articlePath}:`, error);
  }
}

async function processAllArticles() {
  console.log('[Start] Processing all articles for infographic generation...\n');

  const walkDir = (dir) => {
    const files = [];
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (entry.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }

    return files;
  };

  const articles = walkDir(CONTENT_DIR);
  console.log(`[Found] ${articles.length} MDX articles\n`);

  for (const article of articles) {
    await generateInfographicsForArticle(article);
  }

  console.log('\n[Complete] Infographic generation finished');
}

async function distributeInfographic(articleSlug) {
  console.log(`[Start] Distributing infographic for ${articleSlug}...\n`);

  // Find the article
  const walkDir = (dir) => {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const result = walkDir(fullPath);
        if (result) return result;
      } else if (entry.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes(`slug: ${articleSlug}`)) {
          return fullPath;
        }
      }
    }
    return null;
  };

  const articlePath = walkDir(CONTENT_DIR);
  if (!articlePath) {
    console.error(`[Error] Article not found: ${articleSlug}`);
    return;
  }

  console.log(`[Found] Article: ${articlePath}`);
  console.log(`[Info] Distribution requires API tokens to be configured`);
  console.log(`[Info] Set PINTEREST_ACCESS_TOKEN, GOOGLE_BUSINESS_LOCATION_ID, LINKEDIN_ACCESS_TOKEN env vars`);
}

const command = process.argv[2];
const arg = process.argv[3];

if (command === 'generate') {
  await processAllArticles();
} else if (command === 'distribute') {
  if (!arg) {
    console.error('Usage: pnpm wiki:distribute <article-slug>');
    process.exit(1);
  }
  await distributeInfographic(arg);
} else {
  console.log('Usage:');
  console.log('  pnpm wiki:generate       - Generate infographics for all articles');
  console.log('  pnpm wiki:distribute <slug> - Distribute article infographic to all channels');
}

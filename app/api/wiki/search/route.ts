import { buildSearchIndex } from '@/lib/wiki/search-index';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const contentDir = path.join(process.cwd(), 'content');
    const searchIndex = await buildSearchIndex(contentDir);
    const results = searchIndex.search(q);

    return NextResponse.json({
      results: results.slice(0, 50), // Limit to top 50 results
      total: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

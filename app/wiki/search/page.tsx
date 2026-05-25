'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  url: string;
  tier: string;
}

export default function WikiSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/wiki/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const tierColors = {
    T1: 'bg-red-100 text-red-800',
    T2: 'bg-orange-100 text-orange-800',
    T3: 'bg-yellow-100 text-yellow-800',
    T4: 'bg-blue-100 text-blue-800',
    T5: 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Wiki Search</h1>
          <p className="text-slate-600">Search through 240+ articles on e-waste management and recycling</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-2 bg-white rounded-lg shadow-md p-2">
            <Input
              type="text"
              placeholder="Search articles, categories, glossary terms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 focus:ring-0 px-4 py-3 text-lg"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {!searched && (
            <div className="text-center text-slate-500">
              <p className="text-lg">Enter a search query to find articles</p>
            </div>
          )}

          {searched && loading && (
            <div className="text-center text-slate-500">
              <p className="text-lg">Searching...</p>
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div className="text-center text-slate-500">
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords or browse categories</p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-6">Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
              <div className="space-y-4">
                {results.map((result) => (
                  <Link key={result.id} href={result.url}>
                    <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">{result.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierColors[result.tier as keyof typeof tierColors] || tierColors.T3}`}>
                          {result.tier}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2 line-clamp-2">{result.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded capitalize">{result.category}</span>
                        <span>{result.url}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

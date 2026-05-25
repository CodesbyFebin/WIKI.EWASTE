'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState, useMemo } from 'react'

interface GlossaryEntry {
  term: string
  slug: string
  definition: string
  relatedTerms: string[]
  category: string
}

interface GlossaryProps {
  entries: GlossaryEntry[]
}

export default function GlossaryComponent({ entries }: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => [...new Set(entries.map((e) => e.category))],
    [entries]
  )

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        !selectedCategory || entry.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [entries, searchQuery, selectedCategory])

  const groupedByLetter = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {}
    filteredEntries.forEach((entry) => {
      const letter = entry.term.charAt(0).toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(entry)
    })
    return groups
  }, [filteredEntries])

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search glossary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Entries Grouped by Letter */}
      <div className="space-y-8">
        {Object.entries(groupedByLetter)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, letterEntries]) => (
            <div key={letter}>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {letter}
              </h2>
              <div className="space-y-4">
                {letterEntries.map((entry) => (
                  <div
                    key={entry.slug}
                    className="rounded-lg border border-gray-200 p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                  >
                    <Link
                      href={`/wiki/glossary/${entry.slug}`}
                      className="block font-semibold text-emerald-700 hover:underline"
                    >
                      {entry.term}
                    </Link>
                    <p className="mt-2 text-sm text-gray-700">
                      {entry.definition}
                    </p>
                    {entry.relatedTerms.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.relatedTerms.map((related) => (
                          <span
                            key={related}
                            className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">No glossary entries found.</p>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  )
}

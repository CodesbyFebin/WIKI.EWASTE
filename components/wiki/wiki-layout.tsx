'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface WikiLayoutProps {
  children: React.ReactNode
}

export default function WikiLayout({ children }: WikiLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: 'Recycling', slug: 'recycling' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'ITAD', slug: 'itad' },
    { name: 'Data Destruction', slug: 'data-destruction' },
    { name: 'ESG', slug: 'esg' },
    { name: 'Materials', slug: 'materials' },
    { name: 'Localities', slug: 'localities' },
    { name: 'Glossary', slug: 'glossary' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">wiki</div>
              <div className="text-xs text-gray-500">ewastekochi</div>
            </Link>

            <div className="hidden flex-1 md:flex md:justify-center">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const q = searchQuery.trim()
                  if (q) router.push(`/wiki/search?q=${encodeURIComponent(q)}`)
                }}
                className="relative w-full max-w-md"
              >
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </form>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="flex gap-8 px-4 sm:px-6 lg:px-8 py-8">
          {/* Sidebar Navigation */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } w-full md:block md:w-48 flex-shrink-0`}
          >
            <nav className="space-y-1">
              <Link
                href="/wiki"
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                  pathname === '/wiki'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/wiki/entities"
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                  pathname === '/wiki/entities'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Entity Hub
              </Link>
              <Link
                href="/wiki/updates"
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                  pathname === '/wiki/updates'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Recently Updated
              </Link>

              <div className="pt-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categories
                </p>
                <div className="mt-2 space-y-1">
                  {categories.map((cat) => {
                    const isActive = pathname.includes(`/wiki/${cat.slug}`)
                    return (
                      <Link
                        key={cat.slug}
                        href={`/wiki/${cat.slug}`}
                        className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">About</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    About Wiki
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 EWasteKochi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

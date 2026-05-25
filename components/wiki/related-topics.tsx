'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface RelatedTopic {
  title: string
  href: string
  description?: string
}

interface RelatedTopicsProps {
  topics: RelatedTopic[]
  title?: string
}

export function RelatedTopics({
  topics,
  title = 'Related Topics & Deep Dives'
}: RelatedTopicsProps) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="space-y-3">
        {topics.map((topic, idx) => (
          <div key={idx}>
            <Link
              href={topic.href}
              className="flex items-center justify-between p-3 rounded hover:bg-white transition-colors group"
            >
              <span className="font-medium text-blue-600 group-hover:text-blue-700">
                {topic.title}
              </span>
              <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
            </Link>
            {topic.description && (
              <p className="text-xs text-gray-600 px-3 mb-2">{topic.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

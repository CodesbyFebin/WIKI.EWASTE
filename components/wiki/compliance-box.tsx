'use client'

import Link from 'next/link'
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'

interface ComplianceBoxProps {
  title?: string
  regulations: string[]
  docLink?: string
  highlight?: boolean
}

export function ComplianceBox({
  title = 'Regulatory Compliance References',
  regulations,
  docLink,
  highlight = false
}: ComplianceBoxProps) {
  return (
    <div
      className={`rounded-lg p-6 border-l-4 mb-8 ${
        highlight
          ? 'bg-yellow-50 border-l-yellow-400 border border-yellow-200'
          : 'bg-slate-50 border-l-blue-400 border border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        {highlight ? (
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        ) : (
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <ul className="space-y-2 mb-4">
        {regulations.map((reg, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            {reg}
          </li>
        ))}
      </ul>

      {docLink && (
        <Link
          href={docLink}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Documentation →
        </Link>
      )}
    </div>
  )
}

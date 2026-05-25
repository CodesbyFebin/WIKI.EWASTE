'use client'

interface KeyFactsPanelProps {
  items: string[]
}

export default function KeyFactsPanel({ items }: KeyFactsPanelProps) {
  return (
    <div className="my-8 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
      <h3 className="mb-4 font-semibold text-emerald-900">Key Facts</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-emerald-900">
            <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

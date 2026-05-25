import type React from 'react'

interface AIAnswerProps {
  question: string
  children: React.ReactNode
  /** Optional — hints what schema type to apply. Defaults to FAQPage answer. */
  type?: 'faq' | 'definition' | 'howto'
}

const TYPE_LABEL: Record<NonNullable<AIAnswerProps['type']>, string> = {
  faq: 'AI Answer',
  definition: 'Definition',
  howto: 'How To',
}

const TYPE_COLORS: Record<NonNullable<AIAnswerProps['type']>, string> = {
  faq: 'border-emerald-200 bg-emerald-50',
  definition: 'border-violet-200 bg-violet-50',
  howto: 'border-blue-200 bg-blue-50',
}

const LABEL_COLORS: Record<NonNullable<AIAnswerProps['type']>, string> = {
  faq: 'bg-emerald-100 text-emerald-700',
  definition: 'bg-violet-100 text-violet-700',
  howto: 'bg-blue-100 text-blue-700',
}

/**
 * Retrieval-optimised Q&A block.
 *
 * Use in MDX articles to create self-contained answer units that
 * AI Overview, featured snippets, and voice assistants can extract:
 *
 * ```mdx
 * <AIAnswer question="What is EPR compliance in India?">
 *   Extended Producer Responsibility (EPR) compliance requires manufacturers
 *   and importers to register with CPCB, set annual e-waste collection targets,
 *   and submit quarterly reports via the EPRMGMT portal.
 * </AIAnswer>
 * ```
 *
 * The `question` prop maps to FAQPage JSON-LD `name` and the children map to
 * `acceptedAnswer.text` when the parent page harvests these blocks.
 */
export function AIAnswer({ question, children, type = 'faq' }: AIAnswerProps) {
  return (
    <div
      className={`not-prose my-8 rounded-xl border-2 p-6 ${TYPE_COLORS[type]}`}
      data-ai-question={question}
      data-ai-type={type}
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`mt-0.5 flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LABEL_COLORS[type]}`}
        >
          {TYPE_LABEL[type]}
        </span>
        <p className="text-base font-semibold leading-snug text-gray-900">{question}</p>
      </div>

      {/* Answer */}
      <div className="space-y-2 text-sm leading-relaxed text-gray-700">{children}</div>
    </div>
  )
}

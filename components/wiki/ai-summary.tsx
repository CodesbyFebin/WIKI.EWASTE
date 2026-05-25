'use client'

export interface AISummaryProps {
  summary: string
  keyFacts: string[]
  actionItems: string[]
}

export function AISummary({ summary, keyFacts, actionItems }: AISummaryProps) {
  return (
    <section className="my-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm uppercase text-primary mb-2">In 30 Seconds</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>
        </div>

        {keyFacts.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm uppercase text-primary mb-2">Key Facts</h3>
            <ul className="space-y-2">
              {keyFacts.map((fact, i) => (
                <li key={i} className="text-sm text-foreground/70 flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {actionItems.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm uppercase text-primary mb-2">Next Steps</h3>
            <ul className="space-y-2">
              {actionItems.map((item, i) => (
                <li key={i} className="text-sm text-foreground/70 flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

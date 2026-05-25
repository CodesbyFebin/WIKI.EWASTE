'use client'

interface ProcessStep {
  number: number
  title: string
  description: string
  icon?: React.ReactNode
}

interface ProcessSectionProps {
  title: string
  description?: string
  steps: ProcessStep[]
}

export function ProcessSection({
  title,
  description,
  steps,
}: ProcessSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
          {description && <p className="text-foreground/70 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {step.icon || <span className="text-lg font-bold text-primary">{step.number}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-foreground/60 text-sm mt-2">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-4 w-8 h-0.5 bg-border"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

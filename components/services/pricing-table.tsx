'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

interface PricingTableProps {
  title: string
  tiers: PricingTier[]
}

export function PricingTable({ title, tiers }: PricingTableProps) {
  return (
    <section className="py-20 px-4 bg-foreground/2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl border p-8 flex flex-col ${
                tier.highlighted
                  ? 'bg-foreground/5 border-primary/30 ring-1 ring-primary/20'
                  : 'bg-background border-border'
              }`}
            >
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-foreground/60 text-sm mt-2">{tier.description}</p>
              <div className="mt-6 mb-6">
                <span className="text-3xl font-bold">{tier.price}</span>
              </div>
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8" variant={tier.highlighted ? 'default' : 'outline'}>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

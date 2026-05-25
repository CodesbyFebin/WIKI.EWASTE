'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface ServiceHeroProps {
  title: string
  subtitle: string
  description: string
  ctaText?: string
  ctaHref?: string
  image?: string
  stats?: Array<{ label: string; value: string }>
}

export function ServiceHero({
  title,
  subtitle,
  description,
  ctaText = 'Get Started',
  ctaHref = '#contact',
  image,
  stats = [],
}: ServiceHeroProps) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-background to-background/95">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">{subtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            {title}
          </h1>

          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <a href={ctaHref}>
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 mt-12 border-t border-border">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect } from 'react'
import { conversionEvents } from '@/lib/analytics/conversion-events'
import { Button } from '@/components/ui/button'
import { ArrowRight, ExternalLink } from 'lucide-react'

export interface WikiServiceCTAProps {
  title: string
  description: string
  serviceUrl: string
  serviceLabel: string
  articleSlug?: string
  sectionName?: string
  position?: 'top' | 'middle' | 'bottom'
}

export function WikiServiceCTA({
  title,
  description,
  serviceUrl,
  serviceLabel,
  articleSlug = 'unknown',
  sectionName = 'cta',
  position = 'middle',
}: WikiServiceCTAProps) {
  
  const handleCtaClick = () => {
    conversionEvents.wikiServiceClick(articleSlug, serviceUrl, sectionName)
  }

  return (
    <div className="my-8 rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-foreground/70 text-sm mb-4">{description}</p>
          <Button asChild className="gap-2" size="sm" onClick={handleCtaClick}>
            <a href={serviceUrl} target="_blank" rel="noopener noreferrer">
              {serviceLabel}
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function EmbedServiceCTA({
  articleSlug,
  ctaConfig,
  position = 'middle',
}: {
  articleSlug: string
  ctaConfig: WikiServiceCTAProps
  position?: 'top' | 'middle' | 'bottom'
}) {
  return (
    <WikiServiceCTA
      {...ctaConfig}
      articleSlug={articleSlug}
      position={position}
    />
  )
}

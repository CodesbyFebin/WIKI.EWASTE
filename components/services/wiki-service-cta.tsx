'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface WikiServiceCTAProps {
  title: string
  description: string
  serviceUrl: string
  serviceLabel: string
}

export function WikiServiceCTA({
  title,
  description,
  serviceUrl,
  serviceLabel,
}: WikiServiceCTAProps) {
  return (
    <div className="my-8 rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-foreground/70 text-sm mb-4">{description}</p>
          <Button asChild className="gap-2" size="sm">
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

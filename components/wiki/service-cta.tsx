'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServiceCTAProps {
  title: string
  description: string
  serviceLink: string
  buttonText?: string
  variant?: 'primary' | 'secondary'
}

export function ServiceCTA({
  title,
  description,
  serviceLink,
  buttonText = 'Get Started',
  variant = 'primary'
}: ServiceCTAProps) {
  const baseStyles =
    'rounded-lg p-6 mb-8 border transition-all hover:shadow-lg'
  const variantStyles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400'
      : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:border-slate-400'

  return (
    <div className={`${baseStyles} ${variantStyles}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <Link
        href={serviceLink}
        className={`inline-flex items-center gap-2 font-medium transition-colors ${
          variant === 'primary'
            ? 'text-blue-600 hover:text-blue-700'
            : 'text-slate-600 hover:text-slate-700'
        }`}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { leadFormSchema, SERVICE_TYPES, SERVICE_LABELS } from '@/lib/schemas/lead'
import type { LeadFormValues, ServiceType } from '@/lib/schemas/lead'
import { conversionEvents } from '@/lib/analytics/conversion-events'

interface ContactFormProps {
  /** Pre-select a service type */
  defaultService?: ServiceType
  /** Whether to show the service selector */
  showServiceSelect?: boolean
  /** Optional title rendered above the form */
  title?: string
  /** Call-to-action label on the submit button */
  ctaLabel?: string
  /** Tailwind accent class applied to the submit button */
  accentClass?: string
}

export function ContactForm({
  defaultService = 'general',
  showServiceSelect = true,
  title,
  ctaLabel = 'Get Free Quote',
  accentClass = 'bg-emerald-600 hover:bg-emerald-700',
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { service: defaultService },
  })

  // Capture UTM params + referrer on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source')
    const utmMedium = params.get('utm_medium')
    const utmCampaign = params.get('utm_campaign')
    const utmContent = params.get('utm_content')

    if (utmSource) setValue('utmSource', utmSource)
    if (utmMedium) setValue('utmMedium', utmMedium)
    if (utmCampaign) setValue('utmCampaign', utmCampaign)
    if (utmContent) setValue('utmContent', utmContent)

    setValue('sourceUrl', window.location.href)

    const ref = document.referrer
    if (ref) setValue('referrer', ref)
  }, [setValue])

  const onSubmit = async (data: LeadFormValues) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Submission failed')
    }

    conversionEvents.formSubmission(data.service, window.location.pathname)
  }

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="text-lg font-bold text-emerald-800">Enquiry received!</h3>
        <p className="text-sm text-emerald-700">
          We'll get back to you within 24 hours. Check your inbox for a confirmation email.
        </p>
        <button
          onClick={() => reset()}
          className="mt-2 text-xs text-emerald-600 underline underline-offset-2"
        >
          Submit another enquiry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Honeypot — hidden from humans, visible to bots */}
        <div
          aria-hidden="true"
          tabIndex={-1}
          className="absolute left-[-9999px] top-[-9999px] overflow-hidden"
          style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            {...register('website')}
          />
        </div>

        {/* Hidden attribution fields */}
        <input type="hidden" {...register('sourceUrl')} />
        <input type="hidden" {...register('referrer')} />
        <input type="hidden" {...register('utmSource')} />
        <input type="hidden" {...register('utmMedium')} />
        <input type="hidden" {...register('utmCampaign')} />
        <input type="hidden" {...register('utmContent')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              autoComplete="name"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="Rajesh Kumar"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cf-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="cf-email"
              type="email"
              autoComplete="email"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="rajesh@company.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="cf-phone"
              type="tel"
              autoComplete="tel"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="+91 98765 43210"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cf-company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="cf-company"
              type="text"
              autoComplete="organization"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Optional"
              {...register('company')}
            />
          </div>
        </div>

        {showServiceSelect && (
          <div>
            <label htmlFor="cf-service" className="block text-sm font-medium text-gray-700 mb-1">
              Service Interest
            </label>
            <select
              id="cf-service"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('service')}
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SERVICE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="cf-message" className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cf-message"
            rows={4}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
              errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            }`}
            placeholder="Tell us about your e-waste volume, devices, or compliance requirements..."
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${accentClass}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            ctaLabel
          )}
        </button>

        <p className="text-center text-xs text-gray-500">
          We respond within 24 hours. No spam, ever.
        </p>
      </form>
    </div>
  )
}

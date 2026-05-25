'use client'

export type ConversionEventType = 
  | 'form_submission'
  | 'cta_click'
  | 'phone_click'
  | 'whatsapp_click'
  | 'form_start'
  | 'field_complete'
  | 'form_error'
  | 'wiki_service_click'

export interface ConversionEvent {
  event: ConversionEventType
  service_type?: string
  source_page?: string
  article_slug?: string
  section_name?: string
  cta_text?: string
  cta_position?: 'top' | 'middle' | 'bottom'
  field_name?: string
  phone_number?: string
  timestamp: number
  device_type?: string
}

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
  }
}

export function trackConversion(event: ConversionEvent) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event.event, {
      service_type: event.service_type,
      source_page: event.source_page,
      article_slug: event.article_slug,
      section_name: event.section_name,
      cta_text: event.cta_text,
      cta_position: event.cta_position,
      device_type: event.device_type,
    })
  }
}

export const conversionEvents = {
  formStart: (serviceName: string, sourcePage: string) => 
    trackConversion({
      event: 'form_start',
      service_type: serviceName,
      source_page: sourcePage,
      timestamp: Date.now(),
    }),

  formSubmission: (serviceName: string, sourcePage: string) =>
    trackConversion({
      event: 'form_submission',
      service_type: serviceName,
      source_page: sourcePage,
      timestamp: Date.now(),
    }),

  ctaClick: (ctaText: string, servicePath: string, articleSlug?: string, position?: 'top' | 'middle' | 'bottom') =>
    trackConversion({
      event: 'cta_click',
      cta_text: ctaText,
      source_page: servicePath,
      article_slug: articleSlug,
      cta_position: position,
      timestamp: Date.now(),
    }),

  phoneClick: (phone: string, servicePage: string) =>
    trackConversion({
      event: 'phone_click',
      phone_number: phone,
      source_page: servicePage,
      timestamp: Date.now(),
    }),

  whatsappClick: (phone: string, servicePage: string) =>
    trackConversion({
      event: 'whatsapp_click',
      phone_number: phone,
      source_page: servicePage,
      timestamp: Date.now(),
    }),

  wikiServiceClick: (articleSlug: string, servicePath: string, sectionName: string) =>
    trackConversion({
      event: 'wiki_service_click',
      article_slug: articleSlug,
      source_page: servicePath,
      section_name: sectionName,
      timestamp: Date.now(),
    }),

  fieldComplete: (fieldName: string, serviceName: string) =>
    trackConversion({
      event: 'field_complete',
      field_name: fieldName,
      service_type: serviceName,
      timestamp: Date.now(),
    }),
}

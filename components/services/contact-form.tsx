'use client'

import { Phone, MessageSquare } from 'lucide-react'
import { ContactForm as LeadForm } from '@/components/forms/contact-form'
import { BUSINESS } from '@/lib/config/business'
import { conversionEvents } from '@/lib/analytics/conversion-events'
import type { ServiceType } from '@/lib/schemas/lead'

interface ServiceContactFormProps {
  title: string
  description?: string
  serviceType?: ServiceType
}

export function ContactForm({
  title,
  description,
  serviceType = 'general',
}: ServiceContactFormProps) {
  const handlePhoneClick = () => {
    conversionEvents.phoneClick(BUSINESS.phone, window.location.pathname)
  }

  const handleWhatsappClick = () => {
    conversionEvents.whatsappClick(BUSINESS.whatsapp, window.location.pathname)
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
          {description && <p className="text-foreground/70">{description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <LeadForm
            defaultService={serviceType}
            showServiceSelect={true}
            ctaLabel="Get Free Quote"
          />

          <div className="space-y-6">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-semibold">Quick Contact</h3>

              <a
                href={`tel:${BUSINESS.phone}`}
                onClick={handlePhoneClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition"
              >
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground/60">Call Us</p>
                  <p className="font-medium">{BUSINESS.phonePretty}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${BUSINESS.whatsapp}`}
                onClick={handleWhatsappClick}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition"
              >
                <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground/60">WhatsApp Us</p>
                  <p className="font-medium">{BUSINESS.phonePretty}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

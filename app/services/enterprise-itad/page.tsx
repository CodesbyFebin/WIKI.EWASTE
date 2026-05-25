import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { ContactForm } from '@/components/services/contact-form'
import { Laptop, Zap, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Enterprise ITAD Solutions | Kochi Infopark & Data Centers',
  description: 'IT Asset Disposition for enterprises. Complete ITAD, data destruction, and material recovery for IT equipment in Kochi.',
}

export default function EnterpriseITAD() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="Enterprise ITAD Solutions" subtitle="For Large Organizations" description="Complete IT Asset Disposition for enterprises in Kochi Infopark and data centers. Bulk collections, on-site destruction, and value recovery." ctaText="Contact Enterprise Team" ctaHref="#contact" stats={[{ label: 'Enterprise Clients', value: '150+' }, { label: 'Annual Volume', value: '500+ Tons' }]} />
      <ProcessSection title="ITAD Process" steps={[{ number: 1, title: 'Assessment', description: 'Complete IT asset inventory audit.', icon: <Laptop className="w-6 h-6" /> }, { number: 2, title: 'Data Security', description: 'NIST compliant secure destruction.', icon: <Zap className="w-6 h-6" /> }, { number: 3, title: 'Value Recovery', description: 'Extract and recover asset value.', icon: <TrendingUp className="w-6 h-6" /> }, { number: 4, title: 'Reporting', description: 'Detailed compliance documentation.', icon: <Users className="w-6 h-6" /> }]} />
      <ContactForm title="Enterprise ITAD Inquiry" description="Dedicated team for your bulk IT asset disposition needs." />
    </main>
  )
}

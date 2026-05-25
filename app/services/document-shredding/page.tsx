import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { ContactForm } from '@/components/services/contact-form'
import { FileText, Lock, Trash2, FileCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Document & Paper Shredding Services | Kochi',
  description: 'Secure document shredding and paper disposal. Confidentiality assured. Certificate of destruction for compliance.',
}

export default function DocumentShredding() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="Secure Document Shredding" subtitle="Confidentiality Assured" description="Professional document and paper shredding services for businesses. Complete confidentiality, legal compliance, and certificate of destruction provided." ctaText="Get Service" ctaHref="#contact" stats={[{ label: 'Documents Shredded', value: '1M+' }, { label: 'Confidentiality', value: '100%' }]} />
      <ProcessSection title="Shredding Service" steps={[{ number: 1, title: 'Collection', description: 'Secure collection of paper materials.', icon: <FileText className="w-6 h-6" /> }, { number: 2, title: 'Security', description: 'Locked containers and transport.', icon: <Lock className="w-6 h-6" /> }, { number: 3, title: 'Shredding', description: 'Industrial shredding and disposal.', icon: <Trash2 className="w-6 h-6" /> }, { number: 4, title: 'Certification', description: 'Certificate of destruction.', icon: <FileCheck className="w-6 h-6" /> }]} />
      <ContactForm title="Schedule Shredding Service" description="Get secure document shredding for your business." />
    </main>
  )
}

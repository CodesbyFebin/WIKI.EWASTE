import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { PricingTable } from '@/components/services/pricing-table'
import { ContactForm } from '@/components/services/contact-form'
import { Lock, HardDrive, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Secure Data Destruction Services | E-Waste Kochi',
  description: 'NIST 800-88 compliant data destruction. Hard drives, SSDs, and all data-bearing devices. Certificate of destruction included.',
}

export default function DataDestruction() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="Secure Data Destruction Services" subtitle="NIST Compliant" description="Professional data destruction services for hard drives, SSDs, and all data-bearing devices. NIST 800-88 compliant with certificate of destruction." ctaText="Get Quote" ctaHref="#contact" stats={[{ label: 'Devices Secured', value: '10000+' }, { label: 'Compliance', value: 'NIST 800-88' }]} />
      <ProcessSection title="Destruction Methods" steps={[{ number: 1, title: 'Secure Transport', description: 'Encrypted devices to our facility.', icon: <Lock className="w-6 h-6" /> }, { number: 2, title: 'Physical Destruction', description: 'Hard drive shredding and crushing.', icon: <HardDrive className="w-6 h-6" /> }, { number: 3, title: 'Verification', description: 'Certified destruction verification.', icon: <CheckCircle className="w-6 h-6" /> }, { number: 4, title: 'Documentation', description: 'Complete audit trail provided.', icon: <AlertCircle className="w-6 h-6" /> }]} />
      <ContactForm title="Schedule Data Destruction" description="Protect your data with certified destruction services." />
    </main>
  )
}

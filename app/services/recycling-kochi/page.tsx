import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { ContactForm } from '@/components/services/contact-form'
import { Truck, Building2, Leaf, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'E-Waste Recycling Kochi | Professional Services',
  description: 'Expert e-waste recycling services in Kochi. Certified facilities, data security, material recovery. KSPCB compliant.',
}

export default function RecyclingKochi() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="E-Waste Recycling Services in Kochi" subtitle="Professional & Certified" description="Comprehensive e-waste recycling solutions with certified facilities, NIST-compliant data destruction, and material recovery for Kochi businesses and residents." ctaText="Learn More" ctaHref="#contact" stats={[{ label: 'Tons Recycled', value: '2500+' }, { label: 'KSPCB Approved', value: '✓' }]} />
      <ProcessSection title="Our Recycling Process" steps={[{ number: 1, title: 'Collection', description: 'Safe collection from your location.', icon: <Truck className="w-6 h-6" /> }, { number: 2, title: 'Assessment', description: 'Item evaluation and data security check.', icon: <Building2 className="w-6 h-6" /> }, { number: 3, title: 'Processing', description: 'Certified recycling and material separation.', icon: <Leaf className="w-6 h-6" /> }, { number: 4, title: 'Certification', description: 'Complete documentation and reporting.', icon: <Award className="w-6 h-6" /> }]} />
      <ContactForm title="Start Your Recycling Program" description="Contact our team for customized e-waste recycling solutions." />
    </main>
  )
}

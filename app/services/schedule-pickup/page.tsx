import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { PricingTable } from '@/components/services/pricing-table'
import { ContactForm } from '@/components/services/contact-form'
import { Truck, Clock, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Schedule E-Waste Pickup | E-Waste Kochi',
  description: 'Free, convenient e-waste pickup service in Kochi. Schedule online in 2 minutes. Secure data destruction guaranteed.',
}

export default function SchedulePickup() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="Schedule Your Free E-Waste Pickup" subtitle="Quick & Convenient" description="Get your electronic waste collected from your home or office. Free for residential customers, secure data destruction guaranteed." ctaText="Schedule Now" ctaHref="#contact" stats={[{ label: 'Free Pickups', value: '5000+' }, { label: 'Rating', value: '4.9★' }]} />
      <ProcessSection title="How It Works" steps={[{ number: 1, title: 'Schedule Online', description: 'Fill out our quick form. Takes just 2 minutes.', icon: <Clock className="w-6 h-6" /> }, { number: 2, title: 'Confirm Details', description: 'We call to confirm time and location.', icon: <Truck className="w-6 h-6" /> }, { number: 3, title: 'Free Pickup', description: 'Our team arrives on schedule.', icon: <Zap className="w-6 h-6" /> }, { number: 4, title: 'Certified Disposal', description: 'Receive a disposal certificate.', icon: <Shield className="w-6 h-6" /> }]} />
      <ContactForm title="Schedule Your Pickup Today" description="Get a free quote and confirm your pickup appointment." />
    </main>
  )
}

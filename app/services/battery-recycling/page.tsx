import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/service-hero'
import { ProcessSection } from '@/components/services/process-section'
import { ContactForm } from '@/components/services/contact-form'
import { Zap, Leaf, Recycle, TrendingDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lithium-Ion Battery Recycling | E-Waste Kochi',
  description: 'Professional battery recycling with free pickup. Lithium-ion, lead-acid, and all battery types. Environmental & economic recovery.',
}

export default function BatteryRecycling() {
  return (
    <main className="min-h-screen bg-background">
      <ServiceHero title="Lithium-Ion Battery Recycling" subtitle="Free Pickup Available" description="Professional battery recycling with environmental responsibility. Free pickup for bulk quantities. Material recovery and proper disposal of all battery types." ctaText="Schedule Pickup" ctaHref="#contact" stats={[{ label: 'Batteries Recycled', value: '50000+' }, { label: 'Material Recovery', value: '85%' }]} />
      <ProcessSection title="Battery Recycling Process" steps={[{ number: 1, title: 'Collection', description: 'Free pickup for bulk batteries.', icon: <Zap className="w-6 h-6" /> }, { number: 2, title: 'Sorting', description: 'Categorized by type and chemistry.', icon: <Leaf className="w-6 h-6" /> }, { number: 3, title: 'Processing', description: 'Advanced recycling technology.', icon: <Recycle className="w-6 h-6" /> }, { number: 4, title: 'Recovery', description: 'Material extraction for reuse.', icon: <TrendingDown className="w-6 h-6" /> }]} />
      <ContactForm title="Battery Recycling Quote" description="Get your bulk batteries recycled responsibly." />
    </main>
  )
}

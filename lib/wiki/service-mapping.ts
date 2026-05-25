export const wikiToServiceMapping: Record<string, Array<{
  title: string
  description: string
  serviceUrl: string
  serviceLabel: string
}>> = {
  'what-is-e-waste-comprehensive-guide': [
    {
      title: 'Ready to Recycle?',
      description: 'Schedule a free e-waste pickup from your location in Kochi. We handle collection, data destruction, and certified recycling.',
      serviceUrl: '/services/schedule-pickup',
      serviceLabel: 'Schedule Free Pickup',
    },
    {
      title: 'Business Solutions',
      description: 'For offices and enterprises, we offer comprehensive ITAD solutions with bulk collection and compliance documentation.',
      serviceUrl: '/services/enterprise-itad',
      serviceLabel: 'Enterprise ITAD',
    },
  ],
  'nist-800-88-data-destruction': [
    {
      title: 'Secure Data Destruction',
      description: 'Professional NIST 800-88 compliant data destruction for hard drives, SSDs, and all data-bearing devices.',
      serviceUrl: '/services/data-destruction',
      serviceLabel: 'Schedule Destruction',
    },
  ],
  'lithium-ion-battery-recycling-guide': [
    {
      title: 'Battery Recycling Service',
      description: 'Free pickup available for bulk lithium-ion and lead-acid batteries. Professional recycling with material recovery.',
      serviceUrl: '/services/battery-recycling',
      serviceLabel: 'Get Battery Quote',
    },
  ],
  'e-waste-management-rules-2022': [
    {
      title: 'Compliance-Ready Recycling',
      description: 'Our KSPCB-approved facilities ensure your e-waste disposal meets all regulatory requirements in Kerala.',
      serviceUrl: '/services/recycling-kochi',
      serviceLabel: 'View Our Facility',
    },
  ],
  'complete-itad-guide-india': [
    {
      title: 'Enterprise ITAD',
      description: 'Complete IT Asset Disposition for enterprises. Data destruction, bulk collection, and compliance documentation.',
      serviceUrl: '/services/enterprise-itad',
      serviceLabel: 'Enterprise ITAD',
    },
  ],
  'hard-drive-shredding-methods-standards': [
    {
      title: 'Professional Shredding',
      description: 'Secure hard drive destruction and document shredding services with certificate of destruction.',
      serviceUrl: '/services/data-destruction',
      serviceLabel: 'Schedule Service',
    },
  ],
  'environmental-impact-e-waste-kerala': [
    {
      title: 'Support Responsible Recycling',
      description: 'Every recycled device prevents environmental hazards. Schedule your pickup to make a positive impact.',
      serviceUrl: '/services/schedule-pickup',
      serviceLabel: 'Schedule Pickup',
    },
  ],
}

export function getServiceCTAsForArticle(slug: string) {
  return wikiToServiceMapping[slug] ?? []
}

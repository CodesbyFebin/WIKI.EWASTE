export interface SemanticEntity {
  id: string
  name: string
  type: EntityType
  description: string
  linkedArticles: string[]
  relatedEntities: string[]
  metadata?: Record<string, any>
}

export type EntityType = 
  | 'organization'
  | 'standard'
  | 'location'
  | 'concept'
  | 'material'
  | 'process'
  | 'legislation'

export const semanticGraph: Record<string, SemanticEntity> = {
  // Organizations
  'cpcb': {
    id: 'cpcb',
    name: 'Central Pollution Control Board',
    type: 'organization',
    description: 'Indian regulatory body for pollution control',
    linkedArticles: ['/wiki/compliance/e-waste-compliance-india', '/wiki/recycling/what-is-e-waste'],
    relatedEntities: ['kspcb', 'moef', 'weee-rules'],
  },
  'kspcb': {
    id: 'kspcb',
    name: 'Kerala State Pollution Control Board',
    type: 'organization',
    description: 'Kerala state regulatory body for pollution control',
    linkedArticles: ['/wiki/localities/kerala-kspcb-rules'],
    relatedEntities: ['cpcb', 'moef'],
  },
  'moef': {
    id: 'moef',
    name: 'Ministry of Environment, Forest and Climate Change',
    type: 'organization',
    description: 'Central government ministry for environmental regulation',
    linkedArticles: ['/wiki/compliance/e-waste-compliance-india', '/wiki/esg/esg-impact-circular-economy'],
    relatedEntities: ['cpcb', 'kspcb'],
  },

  // Standards & Legislation
  'nist-800-88': {
    id: 'nist-800-88',
    name: 'NIST SP 800-88 Guide',
    type: 'standard',
    description: 'Guidelines for media sanitization and data destruction',
    linkedArticles: ['/wiki/data-destruction/nist-800-88-data-destruction', '/wiki/data-destruction/ssd-vs-hdd-destruction'],
    relatedEntities: ['data-security', 'hard-drive-destruction'],
  },
  'weee-rules': {
    id: 'weee-rules',
    name: 'E-Waste Management Rules',
    type: 'legislation',
    description: 'Indian regulations for electronic waste management',
    linkedArticles: ['/wiki/compliance/e-waste-compliance-india'],
    relatedEntities: ['cpcb', 'kspcb', 'epr'],
  },
  'dpdp-act': {
    id: 'dpdp-act',
    name: 'Digital Personal Data Protection Act 2023',
    type: 'legislation',
    description: 'Indian data protection legislation',
    linkedArticles: ['/wiki/data-destruction/nist-800-88-data-destruction', '/wiki/recycling/what-is-e-waste'],
    relatedEntities: ['data-security', 'nist-800-88'],
  },
  'epr': {
    id: 'epr',
    name: 'Extended Producer Responsibility',
    type: 'concept',
    description: 'Regulatory framework requiring producers to manage end-of-life products',
    linkedArticles: ['/wiki/compliance/epr-producer-responsibility', '/wiki/compliance/e-waste-compliance-india'],
    relatedEntities: ['weee-rules', 'circular-economy'],
  },

  // Processes & Concepts
  'itad': {
    id: 'itad',
    name: 'IT Asset Disposition',
    type: 'process',
    description: 'Process of responsibly decommissioning and recycling IT equipment',
    linkedArticles: ['/wiki/itad/complete-itad-guide-india', '/wiki/itad/server-itad-data-center'],
    relatedEntities: ['data-destruction', 'recycling', 'nist-800-88'],
  },
  'data-destruction': {
    id: 'data-destruction',
    name: 'Data Destruction',
    type: 'process',
    description: 'Secure elimination of data from storage devices',
    linkedArticles: ['/wiki/data-destruction/nist-800-88-data-destruction', '/wiki/data-destruction/ssd-vs-hdd-destruction'],
    relatedEntities: ['nist-800-88', 'dpdp-act', 'hard-drive-shredding'],
  },
  'recycling': {
    id: 'recycling',
    name: 'E-Waste Recycling',
    type: 'process',
    description: 'Process of recovering materials and components from electronic waste',
    linkedArticles: ['/wiki/recycling/what-is-e-waste', '/wiki/recycling/desktop-computer-recycling'],
    relatedEntities: ['circular-economy', 'material-recovery', 'environmental-impact'],
  },
  'circular-economy': {
    id: 'circular-economy',
    name: 'Circular Economy',
    type: 'concept',
    description: 'Economic model focused on eliminating waste and maximizing resource use',
    linkedArticles: ['/wiki/esg/esg-impact-circular-economy', '/wiki/recycling/what-is-e-waste'],
    relatedEntities: ['sustainability', 'environmental-impact', 'material-recovery'],
  },

  // Materials & Components
  'lithium-ion': {
    id: 'lithium-ion',
    name: 'Lithium-Ion Batteries',
    type: 'material',
    description: 'Rechargeable battery technology used in modern devices',
    linkedArticles: ['/wiki/recycling/lithium-ion-battery-recycling-guide'],
    relatedEntities: ['battery-recycling', 'material-recovery', 'hazardous-waste'],
  },
  'hard-drive': {
    id: 'hard-drive',
    name: 'Hard Drives',
    type: 'material',
    description: 'Data storage devices containing sensitive information',
    linkedArticles: ['/wiki/data-destruction/hard-drive-shredding-methods-standards'],
    relatedEntities: ['data-destruction', 'nist-800-88', 'ssd'],
  },
  'precious-metals': {
    id: 'precious-metals',
    name: 'Precious Metals Recovery',
    type: 'material',
    description: 'Extraction of gold, silver, and other valuable metals from e-waste',
    linkedArticles: ['/wiki/materials/precious-metals-recovery-economics'],
    relatedEntities: ['material-recovery', 'recycling', 'circular-economy'],
  },

  // Locations
  'kerala': {
    id: 'kerala',
    name: 'Kerala',
    type: 'location',
    description: 'Southern Indian state with specific e-waste regulations',
    linkedArticles: ['/wiki/localities/e-waste-management-rules-kerala-kspcb'],
    relatedEntities: ['kspcb', 'kochi'],
  },
  'kochi': {
    id: 'kochi',
    name: 'Kochi',
    type: 'location',
    description: 'Major city in Kerala with IT infrastructure',
    linkedArticles: ['/wiki/recycling/what-is-e-waste', '/services/recycling-kochi'],
    relatedEntities: ['kerala', 'infopark'],
  },

  // General Concepts
  'esg': {
    id: 'esg',
    name: 'Environmental, Social, and Governance',
    type: 'concept',
    description: 'Framework for measuring corporate sustainability',
    linkedArticles: ['/wiki/esg/esg-impact-circular-economy'],
    relatedEntities: ['circular-economy', 'environmental-impact'],
  },
  'environmental-impact': {
    id: 'environmental-impact',
    name: 'Environmental Impact',
    type: 'concept',
    description: 'Effects of e-waste on ecosystems and human health',
    linkedArticles: ['/wiki/recycling/what-is-e-waste', '/wiki/esg/esg-impact-circular-economy'],
    relatedEntities: ['sustainability', 'hazardous-waste', 'circular-economy'],
  },
}

export function getEntity(id: string): SemanticEntity | undefined {
  return semanticGraph[id.toLowerCase()]
}

export function getRelatedEntities(id: string): SemanticEntity[] {
  const entity = getEntity(id)
  if (!entity) return []
  return entity.relatedEntities
    .map(relatedId => getEntity(relatedId))
    .filter((e): e is SemanticEntity => e !== undefined)
}

export function getArticlesForEntity(id: string): string[] {
  const entity = getEntity(id)
  return entity?.linkedArticles || []
}

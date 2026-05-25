import fs from 'fs';
import path from 'path';

export interface ArticleTemplate {
  category: string;
  title: string;
  slug: string;
  description: string;
  keyFacts: string[];
  keywords: string[];
  tier: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  estimatedReadTime: number;
  sections: {
    name: string;
    content: string;
  }[];
}

export interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
  relatedTerms: string[];
  sources?: string[];
}

// Content templates for generating articles
export const RECYCLING_CLUSTER_TEMPLATES = [
  {
    pattern: 'smartphone-component-recycling',
    title: 'Smartphone Component Recycling and Material Recovery',
    description: 'Deep dive into smartphone disassembly, component classification, and precious metal extraction processes.',
    keyFacts: [
      'Smartphones contain ~60 elements including gold, silver, copper, and rare earths',
      'Average smartphone yields 3-4g of precious metals per device',
      'Component-level recycling increases recovery rates by 40%',
      'Display recycling is critical for reducing environmental footprint'
    ]
  },
  {
    pattern: 'laptop-battery-recycling',
    title: 'Laptop Battery Recycling and Li-ion Management',
    description: 'Comprehensive guide to lithium-ion battery recycling from laptops, including safety protocols and material recovery.',
    keyFacts: [
      'Laptop batteries contain 5-8% cobalt, essential for new battery production',
      'Improper disposal poses fire risks in landfills',
      'Pyrometallurgical processes recover 98% of metal content',
      'Battery recycling reduces mining demand by 30%'
    ]
  },
  {
    pattern: 'printer-cartridge-recovery',
    title: 'Printer and Copier Cartridge Recovery Systems',
    description: 'Guide to printer and copier cartridge recycling, including ink recovery and plastic reuse.',
    keyFacts: [
      '350 million printer cartridges discarded annually in India',
      'Cartridge plastic can be reused 5-6 times before degradation',
      'Ink recovery yields high-value toner for remanufacturing',
      'Cartridge refurbishment reduces e-waste by 70%'
    ]
  },
  {
    pattern: 'monitor-lcd-panel-recycling',
    title: 'Monitor and LCD Panel Glass Recovery',
    description: 'Technical guide to monitor and LCD panel glass separation and reuse in new applications.',
    keyFacts: [
      'Monitor glass contains lead and other hazardous materials',
      'Specialized glass recovery processes extract 95% recyclable material',
      'LED backlights contain mercury that requires separate management',
      'Recovered glass used in new monitors and decorative products'
    ]
  },
  {
    pattern: 'keyboard-mouse-peripherals',
    title: 'Keyboard and Peripheral Device Recycling',
    description: 'Comprehensive breakdown of recycling keyboards, mice, and other computer peripherals.',
    keyFacts: [
      'Keyboards average 200-300g of recyclable plastics',
      'Mechanical keyboards contain valuable copper components',
      'Wireless peripherals require battery extraction before processing',
      'Plastic reuse in keyboard production creates circular supply chain'
    ]
  },
  {
    pattern: 'cable-connector-recovery',
    title: 'Cable and Connector Precious Metal Recovery',
    description: 'Detailed process for extracting copper and gold from various electronic cables and connectors.',
    keyFacts: [
      'Copper wiring comprises 40-60% of cable weight',
      'Gold plated connectors yield 2-5g per kg processed',
      'Cable sorting by material type improves recovery efficiency',
      'Recovered copper used in electrical and construction industries'
    ]
  },
  {
    pattern: 'power-supply-recycling',
    title: 'Power Supply and Adapter Recycling',
    description: 'Guide to safely disassembling and recycling power supplies and charging adapters.',
    keyFacts: [
      'Power supplies contain transformers with copper and iron cores',
      'Average PSU contains 500g+ of recyclable metal',
      'Hazardous capacitors require specialized extraction',
      'Metal recovery rate: 85% for ferrous, 95% for copper'
    ]
  },
  {
    pattern: 'usb-device-recycling',
    title: 'USB Drives and Flash Memory Device Recycling',
    description: 'Process for recycling USB drives, SD cards, and flash memory devices with secure data destruction.',
    keyFacts: [
      'USB devices contain high-density circuit boards with rare earths',
      'Average USB stick: 2-3g precious metals, 15-20g plastics',
      'NAND flash memory requires secure data destruction before recycling',
      'Plastic recovery: up to 85% suitable for injection molding'
    ]
  },
  {
    pattern: 'router-modem-recycling',
    title: 'Network Equipment (Routers/Modems) Recycling',
    description: 'Comprehensive guide to recycling routers, modems, and network equipment.',
    keyFacts: [
      'Network devices contain circuit boards worth 15-25 per unit',
      'Average router: 100-150g copper wiring, 30-50g ferrous metal',
      'Capacitors may contain PCBs requiring hazardous waste handling',
      'Data destruction protocols essential before equipment recycling'
    ]
  },
  {
    pattern: 'scanner-printer-recycling',
    title: 'Scanner and Multifunction Device Recycling',
    description: 'Technical breakdown of recycling scanners and multifunction office devices.',
    keyFacts: [
      'Multifunction devices combine multiple hazardous components',
      'Average device weight: 8-15kg with 30-40% recoverable material',
      'Light source bulbs contain mercury requiring hazardous handling',
      'Motors and metal chassis contribute significant scrap value'
    ]
  },
  {
    pattern: 'external-hard-drive-recycling',
    title: 'External Hard Drive Recycling and Secure Destruction',
    description: 'Guide to external hard drive recycling with emphasis on secure data destruction.',
    keyFacts: [
      'External drives average 400-600g valuable metals and materials',
      'Platters contain rare earth elements critical for technology',
      'Three-layer destruction ensures data security and environmental compliance',
      'Motor recovery yields high-purity copper and iron'
    ]
  },
  {
    pattern: 'gaming-console-recycling',
    title: 'Gaming Console Recycling (PlayStation, Xbox, Nintendo)',
    description: 'Detailed guide to recycling gaming consoles across all major platforms.',
    keyFacts: [
      'Gaming consoles contain specialized processors and high-grade copper',
      'Average console: 1-2kg recyclable material, 30-40 potential value',
      'Storage drives and controllers require separate processing',
      'GPU recovery valuable for technology sector repurposing'
    ]
  },
  {
    pattern: 'webcam-microphone-recycling',
    title: 'Webcam and Microphone Device Recycling',
    description: 'Process for recycling webcams, microphones, and audio peripherals.',
    keyFacts: [
      'Microphones contain rare earth magnets in speaker components',
      'Webcams average 100-150g plastic, 20-30g metals',
      'Optical components require careful extraction and cleaning',
      'Recovered magnets reused in motor and electronics manufacturing'
    ]
  },
  {
    pattern: 'audio-speaker-recycling',
    title: 'Audio Speaker and Amplifier Recycling',
    description: 'Comprehensive guide to recycling speakers, amplifiers, and audio equipment.',
    keyFacts: [
      'Speakers contain rare earth magnets worth 5-15 per unit',
      'Copper wiring in coils average 100-200g per speaker',
      'Large amplifiers contain transformers with significant scrap value',
      'Voice coils reprocessed for acoustic and automotive applications'
    ]
  },
  {
    pattern: 'touch-screen-digitizer-recycling',
    title: 'Touch Screen and Digitizer Panel Recycling',
    description: 'Technical process for recycling touchscreen panels and digitizer components.',
    keyFacts: [
      'Touchscreen glass contains indium tin oxide (ITO) with scrap value',
      'Average panel: 200-300g glass, 50-100g plastics, 10-20g metals',
      'ITO recovery yields specialty materials for electronics industry',
      'Polarizer films separated for alternative material applications'
    ]
  },
  {
    pattern: 'circuit-board-sorting',
    title: 'Electronic Circuit Board Sorting and Classification',
    description: 'Methodology for sorting and classifying circuit boards by material composition.',
    keyFacts: [
      'Circuit boards range from 2-8 layers affecting recycling value',
      'High-density boards contain 5-10x more precious metals than standard',
      'Classification improves process efficiency and recovery rates',
      'Material sorting reduces contamination in downstream processing'
    ]
  },
  {
    pattern: 'transformer-coil-recovery',
    title: 'Transformer and Coil Metal Recovery',
    description: 'Guide to safely extracting and recovering metal from transformers and coils.',
    keyFacts: [
      'Transformers contain 40-60% copper by weight',
      'Average transformer: 5-15kg recoverable copper per unit',
      'Oil extraction and safe handling critical for environmental compliance',
      'Recovered copper purity: 99.5%, suitable for direct reuse'
    ]
  },
  {
    pattern: 'capacitor-handling-recovery',
    title: 'Electronic Capacitor Safe Handling and Recovery',
    description: 'Specialized guide to safely handling and recovering materials from electronic capacitors.',
    keyFacts: [
      'Electrolytic capacitors may contain toxic electrolyte solutions',
      'Aluminum capacitors average 60-80% recoverable aluminum content',
      'PCB contamination from capacitors requires special handling',
      'Recovered aluminum purity: 95-98% after processing'
    ]
  },
  {
    pattern: 'led-backlight-mercury-recovery',
    title: 'LED Backlight and Mercury Recovery from Display Units',
    description: 'Technical guide to extracting mercury and LED components from display devices.',
    keyFacts: [
      'CCFL bulbs contain 3-5mg mercury requiring hazardous collection',
      'Mercury recovery rate: 95% when using proper procedures',
      'LED recovery yields semiconductor materials for industry',
      'Compliance with Basel Convention requires certified handling'
    ]
  },
  {
    pattern: 'motherboard-component-extraction',
    title: 'Motherboard Component Extraction and Sorting',
    description: 'Detailed methodology for extracting valuable components from computer motherboards.',
    keyFacts: [
      'Motherboards contain 15-20 distinct component types',
      'Component-level extraction increases recovery value by 40-60%',
      'CPUs and RAM contain concentrated precious metals',
      'Proper sorting essential for achieving commodity pricing'
    ]
  }
];

export const COMPLIANCE_TEMPLATES = [
  {
    pattern: 'weee-rules-2016-compliance',
    title: 'WEEE Rules 2016: Complete Compliance Framework',
    description: 'Comprehensive guide to Indian WEEE Rules 2016 requirements and compliance obligations.',
    keyFacts: [
      'Manufacturers responsible for collection of 30%, 40%, 50% by Year 1-3',
      'Registration with State Pollution Control Board mandatory',
      'Extended Producer Responsibility (EPR) covers product life cycle',
      'Non-compliance penalties: up to ₹5 lakhs per violation'
    ]
  },
  {
    pattern: 'hazardous-waste-classification',
    title: 'Hazardous E-Waste Classification and Handling',
    description: 'Technical classification of hazardous components in electronic waste.',
    keyFacts: [
      'Mercury, lead, cadmium classified as Class I hazardous',
      'CRTs contain lead phosphate requiring special handling',
      'Hazardous fraction: 2-5% by weight in typical e-waste stream',
      'CPCB guidelines define transport and storage requirements'
    ]
  },
  {
    pattern: 'epr-certification-process',
    title: 'EPR Certification and Authorization Process',
    description: 'Step-by-step guide to obtaining Extended Producer Responsibility certification.',
    keyFacts: [
      'Registration validity: 3 years from issue date',
      'Annual reporting to SPCB required by March 31',
      'Certification requires minimum collection infrastructure',
      'Cost: ₹500-2000 depending on product category'
    ]
  },
  {
    pattern: 'collection-center-setup-requirements',
    title: 'E-Waste Collection Center Setup and Compliance',
    description: 'Requirements for establishing authorized e-waste collection centers.',
    keyFacts: [
      'Minimum storage capacity: 50-100 tons depending on location',
      'Segregation facilities mandatory before forwarding to recyclers',
      'Staff training on hazardous material handling required',
      'Monthly reporting of collected quantity and disposal pathway'
    ]
  },
  {
    pattern: 'itad-compliance-india',
    title: 'ITAD Compliance Framework for India',
    description: 'Regulatory requirements and best practices for IT Asset Disposition in India.',
    keyFacts: [
      'Data sanitization per NIST 800-88 required for all devices',
      'Chain of custody documentation mandatory',
      'Audit trails for all device movement and processing',
      'Liability protection requires certified ITAD providers'
    ]
  },
  {
    pattern: 'data-protection-rules-IITECH',
    title: 'Data Protection and Information Security in E-Waste',
    description: 'Legal requirements for protecting data during e-waste recycling.',
    keyFacts: [
      'IT Rules 2021 mandate secure data destruction',
      'Liability remains with data owner until destruction verified',
      'Certificate of destruction required for compliance',
      'Penalties: up to ₹50 lakhs for data breach negligence'
    ]
  },
  {
    pattern: 'cross-border-ewaste-regulations',
    title: 'Cross-Border E-Waste Export and Import Regulations',
    description: 'International regulations and Indian restrictions on e-waste movement.',
    keyFacts: [
      'Basel Convention restricts hazardous waste export to developing nations',
      'India prohibits e-waste import (with limited exceptions)',
      'Export classification: complete devices vs. component scrap',
      'Documentation required: origin certification, waste codes'
    ]
  },
  {
    pattern: 'recycler-authorization-criteria',
    title: 'Authorized Recycler Authorization and Criteria',
    description: 'Requirements for becoming an authorized e-waste recycler.',
    keyFacts: [
      'State SPCB authorization mandatory before operations',
      'Minimum infrastructure: segregation, storage, basic processing',
      'Annual training and compliance audit required',
      'Financial liability coverage: ₹10-50 lakhs depending on capacity'
    ]
  },
  {
    pattern: 'manufacturer-responsibility-sharing',
    title: 'Manufacturer Responsibility and Sharing Mechanisms',
    description: 'Framework for manufacturer collective responsibility in e-waste management.',
    keyFacts: [
      'Manufacturers must form EPR organizations or contribute individually',
      'Collection targets increase annually: 30% Year 1, 40% Year 2, 50% Year 3',
      'Cost sharing based on market share among producers',
      'Producer-extended liability covers take-back and safe recycling'
    ]
  },
  {
    pattern: 'inventory-tracking-documentation',
    title: 'E-Waste Inventory Tracking and Documentation',
    description: 'Systems and procedures for tracking e-waste from collection to disposal.',
    keyFacts: [
      'Digital tracking systems reduce documentation errors by 80%',
      'Batch-level tracking enables better process control',
      'Real-time inventory visibility required by regulators',
      'Annual audits verify accuracy of tracking data'
    ]
  },
  {
    pattern: 'occupational-health-safety-ewaste',
    title: 'Occupational Health and Safety in E-Waste Recycling',
    description: 'Worker protection standards specific to e-waste handling.',
    keyFacts: [
      'PPE requirements: respirators, gloves, full-body protection',
      'Hazard assessment required for each processing stage',
      'Health monitoring program for workers: medical checkups',
      'OSHA/ILO standards adapted for Indian context'
    ]
  },
  {
    pattern: 'environmental-impact-assessment',
    title: 'Environmental Impact Assessment for Recycling Facilities',
    description: 'EIA requirements and environmental compliance for e-waste recyclers.',
    keyFacts: [
      'EIA mandatory for facilities processing >100 tons/day',
      'Air emission monitoring: dust, heavy metals, volatile compounds',
      'Water quality testing: discharge standards per State SPCB',
      'Soil contamination surveys required annually'
    ]
  },
  {
    pattern: 'quality-standards-recycled-materials',
    title: 'Quality Standards for Recycled Materials from E-Waste',
    description: 'Standards and specifications for accepting recycled materials.',
    keyFacts: [
      'Precious metal purity standards: 99%+ for bulk buyers',
      'Plastic grading system: A, B, C based on contamination',
      'Copper cathode specs: ASTM B115 compliance',
      'Testing requirements before material sale'
    ]
  }
];

export function generateArticleFromTemplate(
  template: typeof RECYCLING_CLUSTER_TEMPLATES[0],
  category: string,
  tier: 'T2' | 'T3' = 'T3'
): ArticleTemplate {
  return {
    category,
    title: template.title,
    slug: template.pattern,
    description: template.description,
    keyFacts: template.keyFacts,
    keywords: [
      'e-waste',
      'recycling',
      'India',
      template.pattern.replace(/-/g, ' '),
      ...template.description.split(' ').slice(0, 5)
    ],
    tier,
    estimatedReadTime: tier === 'T2' ? 8 : 5,
    sections: [
      {
        name: 'Overview',
        content: `# ${template.title}\n\n${template.description}`
      },
      {
        name: 'Key Facts',
        content: template.keyFacts.map(fact => `- ${fact}`).join('\n')
      },
      {
        name: 'Process Details',
        content: 'Detailed process information and best practices for handling and recovery.'
      },
      {
        name: 'Regulatory Compliance',
        content: 'Compliance requirements and certifications needed for operations.'
      },
      {
        name: 'Related Resources',
        content: 'Links to related articles, standards, and organizations.'
      }
    ]
  };
}

export function generateGlossaryEntry(term: string, definition: string, relatedTerms: string[] = []): GlossaryEntry {
  return {
    term,
    slug: term.toLowerCase().replace(/\s+/g, '-'),
    definition,
    relatedTerms,
  };
}

export const GLOSSARY_TERMS = [
  { term: 'WEEE', definition: 'Waste of Electrical and Electronic Equipment - EU directive establishing producer responsibility for e-waste.' },
  { term: 'ITAD', definition: 'IT Asset Disposition - process of securely retiring and recycling IT equipment.' },
  { term: 'EPR', definition: 'Extended Producer Responsibility - framework making manufacturers responsible for product lifecycle and disposal.' },
  { term: 'CPCB', definition: 'Central Pollution Control Board - India\'s apex organization for environmental protection.' },
  { term: 'RoHS', definition: 'Restriction of Hazardous Substances - EU directive limiting use of hazardous materials in electronics.' },
  { term: 'NIST 800-88', definition: 'Guidelines for Media Sanitization by US National Institute of Standards and Technology.' },
  { term: 'Data Sanitization', definition: 'Process of securely removing data from storage media to prevent recovery.' },
  { term: 'Pyrometallurgy', definition: 'High-temperature metal extraction and refining process.' },
  { term: 'Hydrometallurgy', definition: 'Aqueous solution-based metal extraction process.' },
  { term: 'CRT', definition: 'Cathode Ray Tube - older display technology containing lead and other hazardous materials.' },
  { term: 'PCB', definition: 'Printed Circuit Board - core component in electronic devices containing copper and rare earth elements.' },
  { term: 'ITO', definition: 'Indium Tin Oxide - transparent conductive material used in touchscreens and displays.' },
  { term: 'CCFL', definition: 'Cold Cathode Fluorescent Lamp - backlight technology in LCD screens containing mercury.' },
  { term: 'Chain of Custody', definition: 'Documentation system tracking movement and handling of materials or items.' },
  { term: 'Hazmat', definition: 'Hazardous Material - substances requiring special handling and disposal procedures.' },
  { term: 'Circular Economy', definition: 'Economic model maximizing resource efficiency through reuse and recycling.' },
];

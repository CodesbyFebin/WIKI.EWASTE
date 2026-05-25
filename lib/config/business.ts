/**
 * Single source of truth for all EWasteKochi business identity.
 *
 * Replace env-var fallbacks with real values via .env.local.
 * NEVER hardcode real phone/email directly in components.
 */

export const BUSINESS = {
  name: 'EWasteKochi',
  legalName: 'EWasteKochi Pvt. Ltd.',
  tagline: "India's E-Waste Intelligence Platform",

  // ── Contact ──────────────────────────────────────────────────
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+91-XXXX-XXXXXX',
  phonePretty: process.env.NEXT_PUBLIC_PHONE_PRETTY ?? '+91 XXXX XXXXXX',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '+91XXXXXXXXXX',  // digits only for wa.me
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'contact@ewastekochi.com',
  emailSales: process.env.NEXT_PUBLIC_EMAIL_SALES ?? 'sales@ewastekochi.com',
  emailCompliance: process.env.NEXT_PUBLIC_EMAIL_COMPLIANCE ?? 'compliance@ewastekochi.com',

  // ── Address ──────────────────────────────────────────────────
  address: {
    street: process.env.NEXT_PUBLIC_ADDRESS_STREET ?? 'Kakkanad',
    city: 'Kochi',
    state: 'Kerala',
    pin: '682030',
    country: 'India',
    countryCode: 'IN',
  },

  coordinates: {
    lat: 10.0261,
    lng: 76.3125,
  },

  // ── Regulatory ───────────────────────────────────────────────
  gst: process.env.NEXT_PUBLIC_GST ?? 'XXXXXXXXXXXX',
  cpcbAuth: 'CPCB Authorised Recycler',
  iso14001: true,
  iso27001: true,
  nist88Certified: true,

  // ── Social ───────────────────────────────────────────────────
  social: {
    linkedin: 'https://www.linkedin.com/company/ewastekochi',
    twitter: 'https://twitter.com/ewastekochi',
    youtube: 'https://youtube.com/@ewastekochi',
    instagram: 'https://instagram.com/ewastekochi',
  },

  // ── Domain ───────────────────────────────────────────────────
  url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com',
  mainUrl: 'https://ewastekochi.com',

  // ── Service areas ────────────────────────────────────────────
  serviceAreas: [
    'Kochi', 'Ernakulam', 'Thrissur', 'Kozhikode', 'Thiruvananthapuram',
    'Kollam', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kannur',
    'Kasaragod', 'Kottayam', 'Pathanamthitta', 'Idukki',
  ],

  // ── Schema.org JSON-LD representation ────────────────────────
  get schemaOrg() {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: this.name,
      legalName: this.legalName,
      description: 'CPCB-authorised e-waste recycler offering ITAD, data destruction, EPR compliance, and circular economy services across Kerala, India.',
      url: this.mainUrl,
      telephone: this.phone,
      email: this.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.address.street,
        addressLocality: this.address.city,
        addressRegion: this.address.state,
        postalCode: this.address.pin,
        addressCountry: this.address.countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: this.coordinates.lat,
        longitude: this.coordinates.lng,
      },
      sameAs: Object.values(this.social),
      areaServed: this.serviceAreas.map((area) => ({
        '@type': 'City',
        name: area,
      })),
      knowsAbout: [
        'E-waste recycling', 'IT Asset Disposition', 'Data destruction',
        'EPR compliance', 'CPCB regulations', 'Circular economy',
      ],
    }
  },
} as const

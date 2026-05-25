import { z } from 'zod'

export const SERVICE_TYPES = [
  'schedule-pickup',
  'enterprise-itad',
  'certified-destruction',
  'epr-compliance',
  'esg-reporting',
  'material-recovery',
  'general',
] as const

export type ServiceType = (typeof SERVICE_TYPES)[number]

export const SERVICE_LABELS: Record<ServiceType, string> = {
  'schedule-pickup': 'Schedule Pickup',
  'enterprise-itad': 'Enterprise ITAD',
  'certified-destruction': 'Certified Data Destruction',
  'epr-compliance': 'EPR Compliance',
  'esg-reporting': 'ESG Reporting',
  'material-recovery': 'Material Recovery',
  'general': 'General Enquiry',
}

/**
 * Shared schema — imported by both the client form and the server API route.
 * Ensures client-side error messages are identical to server-side rejections.
 */
export const leadFormSchema = z.object({
  // Core fields
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .max(255)
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .regex(/^[+\d\s\-().]+$/, 'Invalid phone number format')
    .trim()
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(200, 'Company name is too long')
    .trim()
    .optional()
    .or(z.literal('')),

  service: z.enum(SERVICE_TYPES).default('general'),

  message: z
    .string({ required_error: 'Message is required' })
    .min(10, 'Please provide more detail (at least 10 characters)')
    .max(2000, 'Message is too long (max 2000 characters)')
    .trim(),

  // Attribution — populated automatically by the form, not shown to user
  sourceUrl: z.string().url().optional().or(z.literal('')),
  referrer: z.string().max(500).optional().or(z.literal('')),
  utmSource: z.string().max(100).optional().or(z.literal('')),
  utmMedium: z.string().max(100).optional().or(z.literal('')),
  utmCampaign: z.string().max(100).optional().or(z.literal('')),
  utmContent: z.string().max(100).optional().or(z.literal('')),

  /**
   * Honeypot — must be empty. Visible to bots (no CSS display:none), hidden
   * from humans via aria-hidden + tabIndex=-1 + off-screen positioning.
   * Name is intentionally generic ("website") to attract bot autofill.
   */
  website: z
    .string()
    .max(0, 'Bot detected')
    .optional(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>

/**
 * Server-only: full lead record stored in the database.
 * Extends the form schema with server-appended fields.
 */
export const leadRecordSchema = leadFormSchema.extend({
  ipHash: z.string().optional(),
  userAgent: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).default('new'),
})

export type LeadRecord = z.infer<typeof leadRecordSchema>

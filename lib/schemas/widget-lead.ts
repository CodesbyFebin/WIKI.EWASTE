import { z } from 'zod'
import { SERVICE_TYPES } from './lead'

export const widgetLeadSchema = z.object({
  name:     z.string().min(1).max(100).trim(),
  phone:    z.string().min(6).max(20).regex(/^[+\d\s\-(). ]+$/).trim(),
  email:    z.string().email().max(255).trim().toLowerCase().optional().or(z.literal('')),
  company:  z.string().max(200).trim().optional().or(z.literal('')),
  service:  z.enum(SERVICE_TYPES).default('general'),
  items:    z.string().max(300).trim().optional(),
  qty:      z.string().max(50).trim().optional(),
  location: z.string().max(150).trim().optional(),
  message:  z.string().max(3000).trim(),

  // Semantic context
  pageType:      z.string().max(50).optional(),
  sourcePage:    z.string().max(500).optional(),
  entityContext: z.string().max(500).optional(),

  // UTM attribution
  utmSource:   z.string().max(100).optional(),
  utmMedium:   z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),

  // Honeypot
  website: z.string().max(0, 'Bot detected').optional(),
})

export type WidgetLeadData = z.infer<typeof widgetLeadSchema>

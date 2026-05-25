import { NextRequest, NextResponse } from 'next/server'
import { leadFormSchema } from '@/lib/schemas/lead'
import { saveLead, hashIp } from '@/lib/db/leads'
import type { LeadRecord } from '@/lib/schemas/lead'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = leadFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  // Honeypot — bot check (field must be absent or empty string)
  if (parsed.data.website) {
    // Silent 200 to not tip off bots
    return NextResponse.json({ success: true })
  }

  // Build server-appended fields
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const ipHash = ip !== 'unknown' ? await hashIp(ip) : undefined
  const userAgent = req.headers.get('user-agent') ?? undefined

  const record: LeadRecord = {
    ...parsed.data,
    phone: parsed.data.phone || undefined,
    company: parsed.data.company || undefined,
    sourceUrl: parsed.data.sourceUrl || undefined,
    referrer: parsed.data.referrer || undefined,
    utmSource: parsed.data.utmSource || undefined,
    utmMedium: parsed.data.utmMedium || undefined,
    utmCampaign: parsed.data.utmCampaign || undefined,
    utmContent: parsed.data.utmContent || undefined,
    ipHash,
    userAgent,
    createdAt: new Date().toISOString(),
    status: 'new',
  }

  const result = await saveLead(record)

  if (!result.emailSent && !result.persisted) {
    // Both channels failed — still return success to user, but log loudly
    console.error('[CONTACT] Both persist and email failed for lead:', {
      name: record.name,
      email: record.email,
      service: record.service,
      createdAt: record.createdAt,
    })
  }

  return NextResponse.json({
    success: true,
    id: result.id,
  })
}

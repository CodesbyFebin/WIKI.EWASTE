import { NextRequest, NextResponse } from 'next/server'
import { widgetLeadSchema } from '@/lib/schemas/widget-lead'
import { SERVICE_LABELS } from '@/lib/schemas/lead'
import { hashIp } from '@/lib/db/leads'
import { BUSINESS } from '@/lib/config/business'

export const runtime = 'nodejs'

// Simple in-memory rate limit — per IP, max 5 submissions per 10 min
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = widgetLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  // Honeypot
  if (parsed.data.website) return NextResponse.json({ success: true })

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'

  // Rate limit by IP
  if (rawIp !== 'unknown' && !checkRateLimit(rawIp)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const ipHash    = rawIp !== 'unknown' ? await hashIp(rawIp) : undefined
  const userAgent = req.headers.get('user-agent') ?? undefined
  const d         = parsed.data
  const label     = SERVICE_LABELS[d.service] ?? d.service

  /* ── Supabase persist ──────────────────────────────────────── */
  let leadId: string | null = null
  const supaUrl = process.env.SUPABASE_URL
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supaUrl && supaKey) {
    try {
      const res = await fetch(`${supaUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          name:         d.name,
          email:        d.email    || null,
          phone:        d.phone,
          company:      d.company  || null,
          service:      d.service,
          message:      d.message,
          source_url:   d.sourcePage   || null,
          utm_source:   d.utmSource    || null,
          utm_medium:   d.utmMedium    || null,
          utm_campaign: d.utmCampaign  || null,
          ip_hash:      ipHash         || null,
          user_agent:   userAgent      || null,
          status:       'new',
          created_at:   new Date().toISOString(),
        }),
      })
      if (res.ok) {
        const rows = (await res.json()) as Array<{ id: string }>
        leadId = rows[0]?.id ?? null
      } else {
        console.error('[WIDGET] Supabase error:', res.status, await res.text())
      }
    } catch (e) {
      console.error('[WIDGET] Supabase threw:', e)
    }
  }

  /* ── Internal notification (no auto-reply — no confirmed email) ── */
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const to   = process.env.LEAD_NOTIFY_EMAIL ?? BUSINESS.emailSales
    const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@ewastekochi.com'
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    `EWasteKochi Widget <${from}>`,
          to:      [to],
          subject: `[Widget] ${label} — ${d.name} · ${d.phone}`,
          html: `
<h2 style="color:#059669">🤖 Widget Lead — ${label}</h2>
<table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
  <tr><td><b>Name</b></td><td>${d.name}</td></tr>
  <tr><td><b>Phone</b></td><td><a href="tel:${d.phone}">${d.phone}</a></td></tr>
  ${d.email   ? `<tr><td><b>Email</b></td><td>${d.email}</td></tr>` : ''}
  ${d.company ? `<tr><td><b>Company</b></td><td>${d.company}</td></tr>` : ''}
  <tr><td><b>Service</b></td><td>${label}</td></tr>
  <tr><td><b>Items</b></td><td>${d.items    || '—'}</td></tr>
  <tr><td><b>Qty</b></td><td>${d.qty      || '—'}</td></tr>
  <tr><td><b>Area</b></td><td>${d.location || '—'}</td></tr>
  <tr><td colspan="2" style="padding-top:8px"><b>Message</b><br/><pre style="margin:4px 0;white-space:pre-wrap;font-family:inherit">${d.message}</pre></td></tr>
  <tr style="background:#f0fdf4"><td><b>Page type</b></td><td>${d.pageType    || '—'}</td></tr>
  <tr style="background:#f0fdf4"><td><b>Source URL</b></td><td style="font-size:12px">${d.sourcePage  || '—'}</td></tr>
  ${d.entityContext ? `<tr style="background:#f0fdf4"><td><b>Entities</b></td><td>${d.entityContext}</td></tr>` : ''}
  ${d.utmSource     ? `<tr style="background:#f0fdf4"><td><b>UTM</b></td><td>${d.utmSource} / ${d.utmMedium ?? '—'} / ${d.utmCampaign ?? '—'}</td></tr>` : ''}
</table>
<p style="color:#6b7280;font-size:12px;margin-top:16px">
  Received ${new Date().toISOString()} · Lead ID: ${leadId ?? 'not persisted'}
</p>`,
        }),
      })
    } catch (e) {
      console.error('[WIDGET] Notification email threw:', e)
    }
  }

  // Fallback structured log (so no lead is silently lost)
  if (!leadId) {
    console.log('[WIDGET_LEAD]', JSON.stringify({
      name: d.name, phone: d.phone, service: d.service,
      items: d.items, qty: d.qty, location: d.location,
      pageType: d.pageType, ts: new Date().toISOString(),
    }))
  }

  return NextResponse.json({ success: true, id: leadId })
}

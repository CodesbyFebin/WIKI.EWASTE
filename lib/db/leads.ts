/**
 * Lead storage layer.
 *
 * Tries Supabase (REST API — no SDK needed) if the environment variables are
 * present. Falls back to structured console logging so the pipeline works in
 * local development and preview environments without a database.
 *
 * Required env vars for Supabase:
 *   SUPABASE_URL              — https://[project].supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (never expose to client)
 *
 * Required env vars for email notifications:
 *   RESEND_API_KEY            — Resend API key
 *   LEAD_NOTIFY_EMAIL         — where to send internal notifications
 *   RESEND_FROM_EMAIL         — verified sender (e.g. noreply@ewastekochi.com)
 */

import type { LeadRecord } from '@/lib/schemas/lead'
import { SERVICE_LABELS } from '@/lib/schemas/lead'
import { BUSINESS } from '@/lib/config/business'

// ── Supabase ────────────────────────────────────────────────────────────────

async function saveToSupabase(lead: LeadRecord): Promise<string | null> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      company: lead.company || null,
      service: lead.service,
      message: lead.message,
      source_url: lead.sourceUrl || null,
      referrer: lead.referrer || null,
      utm_source: lead.utmSource || null,
      utm_medium: lead.utmMedium || null,
      utm_campaign: lead.utmCampaign || null,
      utm_content: lead.utmContent || null,
      ip_hash: lead.ipHash || null,
      user_agent: lead.userAgent || null,
      status: 'new',
      created_at: lead.createdAt,
    }),
  })

  if (!res.ok) {
    console.error('[DB] Supabase insert failed:', res.status, await res.text())
    return null
  }

  const rows = (await res.json()) as Array<{ id: string }>
  return rows[0]?.id ?? null
}

// ── Email notification ───────────────────────────────────────────────────────

async function sendNotificationEmail(lead: LeadRecord): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL ?? BUSINESS.emailSales
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? `noreply@ewastekochi.com`
  const serviceLabel = SERVICE_LABELS[lead.service as keyof typeof SERVICE_LABELS] ?? lead.service

  const internalHtml = `
    <h2>New Lead — ${serviceLabel}</h2>
    <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif">
      <tr><td><strong>Name</strong></td><td>${lead.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${lead.email}</td></tr>
      ${lead.phone ? `<tr><td><strong>Phone</strong></td><td>${lead.phone}</td></tr>` : ''}
      ${lead.company ? `<tr><td><strong>Company</strong></td><td>${lead.company}</td></tr>` : ''}
      <tr><td><strong>Service</strong></td><td>${serviceLabel}</td></tr>
      <tr><td><strong>Message</strong></td><td style="white-space:pre-wrap">${lead.message}</td></tr>
      <tr style="background:#f9fafb"><td><strong>Source</strong></td><td>${lead.sourceUrl ?? '—'}</td></tr>
      ${lead.utmSource ? `<tr style="background:#f9fafb"><td><strong>UTM Source</strong></td><td>${lead.utmSource}</td></tr>` : ''}
      ${lead.utmCampaign ? `<tr style="background:#f9fafb"><td><strong>UTM Campaign</strong></td><td>${lead.utmCampaign}</td></tr>` : ''}
    </table>
    <p style="color:#6b7280;font-size:12px">Received ${lead.createdAt}</p>
  `

  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#059669">Thank you, ${lead.name.split(' ')[0]}!</h2>
      <p>We've received your enquiry about <strong>${serviceLabel}</strong> and will get back to you within 24 hours.</p>
      <p>If you need immediate assistance:</p>
      <ul>
        <li>Call us: <a href="tel:${BUSINESS.phone}">${BUSINESS.phonePretty}</a></li>
        <li>WhatsApp: <a href="https://wa.me/${BUSINESS.whatsapp}">Chat on WhatsApp</a></li>
      </ul>
      <p style="color:#6b7280;font-size:12px">
        This is an automated confirmation. Please do not reply to this email.<br/>
        EWasteKochi — ${BUSINESS.address.city}, ${BUSINESS.address.state}, India
      </p>
    </div>
  `

  const [internalRes, confirmRes] = await Promise.allSettled([
    // Internal notification
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EWasteKochi Leads <${fromEmail}>`,
        to: [notifyEmail],
        subject: `[Lead] ${serviceLabel} — ${lead.name}`,
        html: internalHtml,
      }),
    }),
    // Auto-reply confirmation
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `EWasteKochi <${fromEmail}>`,
        to: [lead.email],
        subject: `We received your enquiry — ${serviceLabel}`,
        html: confirmHtml,
      }),
    }),
  ])

  if (internalRes.status === 'rejected') {
    console.error('[EMAIL] Internal notification failed:', internalRes.reason)
  }
  if (confirmRes.status === 'rejected') {
    console.error('[EMAIL] Auto-reply failed:', confirmRes.reason)
  }

  return internalRes.status === 'fulfilled'
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface SaveLeadResult {
  id: string | null
  emailSent: boolean
  persisted: boolean
}

export async function saveLead(lead: LeadRecord): Promise<SaveLeadResult> {
  const [id, emailSent] = await Promise.all([
    saveToSupabase(lead),
    sendNotificationEmail(lead),
  ])

  const persisted = id !== null

  if (!persisted) {
    // Operational fallback — at least log to server so no lead is truly lost
    console.log('[LEAD]', JSON.stringify({
      name: lead.name,
      email: lead.email,
      service: lead.service,
      createdAt: lead.createdAt,
    }))
  }

  return { id, emailSent, persisted }
}

/**
 * SHA-256 hash of the IP address for DPDP-compliant storage.
 * We store the hash, not the raw IP.
 */
export async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + (process.env.IP_HASH_SALT ?? ''))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    gtag?: (cmd: string, action: string, params?: Record<string, unknown>) => void
  }
}

const PAGE_TYPE_MAP: [RegExp, string][] = [
  [/\/services\/schedule-pickup/,      'schedule-pickup'],
  [/\/services\/enterprise-itad/,      'itad'],
  [/\/services\/battery/,              'battery'],
  [/\/services\/data-destruction/,     'data-destruction'],
  [/\/services\/document-shredding/,   'shredding'],
  [/\/wiki\/itad/,                     'itad'],
  [/\/wiki\/compliance/,               'compliance'],
  [/\/wiki\/data-destruction/,         'data-destruction'],
  [/\/wiki\/recycling\/lithium/,       'battery'],
  [/\/wiki\/recycling\/.*battery/,     'battery'],
  [/\/wiki\/localities/,               'kochi'],
  [/\/wiki\/esg/,                      'esg'],
]

function getPageType(pathname: string): string {
  for (const [re, type] of PAGE_TYPE_MAP) {
    if (re.test(pathname)) return type
  }
  return pathname.startsWith('/wiki') ? 'wiki' : 'home'
}

export function ChatWidgetEmbed() {
  const pathname   = usePathname()
  const iframeRef  = useRef<HTMLIFrameElement>(null)
  const loadedRef  = useRef(false)

  const sendContext = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    const sp = new URLSearchParams(window.location.search)
    iframe.contentWindow.postMessage(
      {
        type:        'ewk_context',
        page:        getPageType(pathname),
        autoflow:    pathname.includes('/services/schedule-pickup') ? 'pickup' : '',
        sourceUrl:   window.location.href,
        utmSource:   sp.get('utm_source')   ?? '',
        utmMedium:   sp.get('utm_medium')   ?? '',
        utmCampaign: sp.get('utm_campaign') ?? '',
        utmContent:  sp.get('utm_content')  ?? '',
        // Article pages can expose entity IDs via <meta name="page-entities">
        entities: document.querySelector<HTMLMetaElement>('meta[name="page-entities"]')?.content ?? '',
      },
      window.location.origin,
    )
  }, [pathname])

  // Send context once iframe finishes loading
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const onLoad = () => { loadedRef.current = true; sendContext() }
    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [sendContext])

  // Re-send context on every client-side navigation
  useEffect(() => {
    if (loadedRef.current) sendContext()
  }, [pathname, sendContext])

  // Bridge widget GA4 events to the parent page's gtag instance
  const onMessage = useCallback((e: MessageEvent) => {
    if (!e.data || typeof e.data !== 'object') return
    if (e.data.type === 'ewk_event' && typeof window.gtag === 'function') {
      window.gtag('event', e.data.event, e.data.params ?? {})
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onMessage])

  return (
    <iframe
      ref={iframeRef}
      src="/chatbot-widget.html"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
      title="EWaste Kochi AI Chat"
    />
  )
}

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wiki.ewastekochi.com'

// Type can be: article | glossary | entity | service | default
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'default'
  const title = searchParams.get('title') ?? 'EWasteKochi'
  const description = searchParams.get('description') ?? "India's E-Waste Intelligence Platform"
  const category = searchParams.get('category') ?? ''
  const badge = searchParams.get('badge') ?? ''

  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    : ''

  const badgeText =
    badge ||
    (type === 'article' ? categoryLabel : '') ||
    (type === 'glossary' ? 'Glossary' : '') ||
    (type === 'entity' ? 'Entity' : '') ||
    (type === 'service' ? 'Service' : '') ||
    'EWasteKochi'

  // Accent colour per type
  const accent =
    type === 'glossary'
      ? '#8b5cf6'
      : type === 'entity'
        ? '#0ea5e9'
        : type === 'service'
          ? '#f59e0b'
          : '#00d084'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#07120f',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${accent}22 0%, transparent 50%), radial-gradient(circle at 80% 20%, #13b5ec22 0%, transparent 50%)`,
          }}
        />

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${accent}, #13b5ec)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 72px',
            width: '100%',
          }}
        >
          {/* Top: logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: accent,
                letterSpacing: '-0.02em',
              }}
            >
              wiki
            </div>
            <div style={{ fontSize: '14px', color: '#6ee7b7', opacity: 0.6 }}>
              ewastekochi
            </div>
            {badgeText && (
              <div
                style={{
                  marginLeft: 'auto',
                  background: `${accent}22`,
                  border: `1px solid ${accent}44`,
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: accent,
                }}
              >
                {badgeText}
              </div>
            )}
          </div>

          {/* Middle: title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
            <div
              style={{
                fontSize: title.length > 60 ? '40px' : title.length > 40 ? '48px' : '56px',
                fontWeight: 900,
                color: '#ecfdf5',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#a7f3d0',
                  opacity: 0.75,
                  maxWidth: '780px',
                  lineHeight: 1.5,
                  // Truncate
                  overflow: 'hidden',
                  display: '-webkit-box',
                }}
              >
                {description.length > 120 ? description.slice(0, 120) + '…' : description}
              </div>
            )}
          </div>

          {/* Bottom: domain */}
          <div
            style={{
              fontSize: '15px',
              color: '#6ee7b7',
              opacity: 0.5,
            }}
          >
            {BASE_URL.replace('https://', '')}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

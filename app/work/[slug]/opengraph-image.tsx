import { ImageResponse } from 'next/og'
import { PROJECTS, getProject } from '@/lib/projects'

export const runtime     = 'edge'
export const alt         = 'Proyecto — Germán Gómez'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

interface Props {
  params: { slug: string }
}

export default function Image({ params }: Props) {
  const project = getProject(params.slug)

  const number  = project?.number ?? ''
  const title   = project?.title ?? 'Germán Gómez'
  const tagline = project?.tagline ?? 'Automatización & Desarrollo Web'
  const tags    = project?.tags ?? []
  const accent  = project?.accentColor ?? '#7DB892'
  const bg      = project?.placeholderColor ?? '#0a0a0a'

  return new ImageResponse(
    (
      <div
        style={{
          background: bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Número + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <span
            style={{
              display: 'flex',
              color: accent,
              fontSize: 26,
              fontWeight: 700,
              fontFamily: 'serif',
              letterSpacing: '-0.02em',
            }}
          >
            {number}
          </span>
          <div style={{ display: 'flex', width: 28, height: 1, background: `${accent}88` }} />
          <span
            style={{
              display: 'flex',
              color: '#A89F8C',
              fontSize: 18,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'serif',
            }}
          >
            Proyecto de Germán Gómez
          </span>
        </div>

        {/* Título */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 26 ? 60 : 72,
            fontWeight: 800,
            color: '#F5F0E8',
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            maxWidth: 1000,
            fontFamily: 'serif',
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 28,
            color: accent,
            maxWidth: 880,
            lineHeight: 1.35,
            fontFamily: 'serif',
          }}
        >
          {tagline}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  fontSize: 18,
                  color: accent,
                  border: `1px solid ${accent}55`,
                  borderRadius: 4,
                  padding: '8px 16px',
                  fontFamily: 'serif',
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 60,
            left: 80,
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', width: 8, height: 8, borderRadius: 999, background: accent }} />
          <span
            style={{
              display: 'flex',
              color: '#A89F8C',
              fontSize: 18,
              letterSpacing: '0.1em',
              fontFamily: 'serif',
            }}
          >
            GERMAN-GOMEZ.ES
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}

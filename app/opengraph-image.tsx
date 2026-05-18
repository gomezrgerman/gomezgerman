import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Germán Gómez — Automatización & Desarrollo Web'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#152B1C',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
        }}
      >
        {/* Top: nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#7DB892', fontSize: '18px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'serif' }}>
            GERMÁN GÓMEZ
          </span>
          <span style={{ color: 'rgba(125,184,146,0.4)', fontSize: '18px' }}>·</span>
          <span style={{ color: 'rgba(125,184,146,0.6)', fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'serif' }}>
            DÉNIA, ALICANTE
          </span>
        </div>

        {/* Centro: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#F5F0E8',
              fontSize: '88px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              fontFamily: 'serif',
            }}
          >
            Diseño sistemas
            <br />
            para negocios
            <br />
            <span style={{ color: '#7DB892' }}>reales.</span>
          </div>
        </div>

        {/* Bottom: tagline + disponibilidad */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: '#A89F8C', fontSize: '22px', fontFamily: 'serif', letterSpacing: '-0.01em' }}>
            Automatización · IA · Desarrollo web
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7DB892' }} />
            <span style={{ color: '#7DB892', fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'serif' }}>
              Disponible
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

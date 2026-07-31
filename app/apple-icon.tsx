import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#152B1C',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 78,
          fontWeight: 800,
          color: '#F5F0E8',
          letterSpacing: '-0.03em',
          fontFamily: 'sans-serif',
        }}
      >
        GG
      </div>
    ),
    { ...size },
  )
}

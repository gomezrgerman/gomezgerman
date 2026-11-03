'use client'

import { useState, useEffect, useRef } from 'react'

const CARD_W = 420

const FEED_EVENTS = [
  { project: 'NutriFlow', color: '#C4A882', event: 'Dieta generada',           ago: 'ahora' },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Recordatorio enviado',     ago: '12s'   },
  { project: 'G2Fit',     color: '#7DB892', event: 'Bono registrado',          ago: '38s'   },
  { project: 'NutriFlow', color: '#C4A882', event: 'PDF entregado al cliente', ago: '1 min' },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Reserva confirmada',       ago: '2 min' },
  { project: 'G2Fit',     color: '#7DB892', event: 'Sesión completada',        ago: '3 min' },
  { project: 'NutriFlow', color: '#C4A882', event: 'Plan ajustado por Lydia',  ago: '4 min' },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Pago procesado',           ago: '5 min' },
]

export default function HeroCardDeck() {
  const [triggered, setTriggered] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    let count = 0
    const id = setInterval(() => {
      count += 1
      setVisibleCount(count)
      if (count >= FEED_EVENTS.length) clearInterval(id)
    }, 420)
    return () => clearInterval(id)
  }, [triggered])

  return (
    <div style={{ position: 'relative' }}>

      {/* Label */}
      <div
        style={{
          position: 'absolute', top: -30, left: 4, display: 'flex', alignItems: 'center', gap: 7,
          opacity: triggered ? 1 : 0,
          transform: `translateY(${triggered ? 0 : -8}px)`,
          transition: 'opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s',
        }}
      >
        <span
          className="deck-pulse"
          style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block', boxShadow: '0 0 8px #7DB892' }}
        />
        <span style={{ fontSize: 11, color: '#7DB892', fontFamily: 'var(--font-cabinet)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
          Sistemas activos
        </span>
      </div>

      {/* Card */}
      <div
        ref={ref}
        style={{
          opacity: triggered ? 1 : 0,
          transform: `translateY(${triggered ? 0 : 28}px)`,
          transition: 'opacity 0.65s ease-out, transform 0.65s ease-out',
          width: CARD_W,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 20px 56px rgba(0,0,0,0.65)',
          backgroundColor: '#0a0f0b',
          border: '1px solid rgba(125,184,146,0.18)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '11px 16px', borderBottom: '1px solid rgba(125,184,146,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="deck-blink"
            style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block', boxShadow: '0 0 6px #7DB892', flexShrink: 0 }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7DB892', fontFamily: 'var(--font-cabinet)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Automatización activa
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 9, color: '#A89F8C', fontFamily: 'var(--font-cabinet)', letterSpacing: '0.08em' }}>
            LIVE
          </span>
        </div>

        {/* Feed */}
        <div style={{ padding: '4px 0' }}>
          {FEED_EVENTS.map((ev, i) => (
            <div
              key={i}
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transform: `translateX(${i < visibleCount ? 0 : -8}px)`,
                transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ color: ev.color, fontSize: 11, flexShrink: 0, lineHeight: 1 }}>✓</span>

              <span style={{
                fontSize: 9,
                fontWeight: 700,
                color: ev.color,
                fontFamily: 'var(--font-cabinet)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: `${ev.color}14`,
                border: `1px solid ${ev.color}28`,
                borderRadius: 3,
                padding: '2px 6px',
                flexShrink: 0,
              }}>
                {ev.project}
              </span>

              <span style={{ fontSize: 11, color: '#C8C0B0', fontFamily: 'var(--font-cabinet)', flex: 1, lineHeight: 1.3 }}>
                {ev.event}
              </span>

              <span style={{ fontSize: 9, color: '#A89F8C', fontFamily: 'var(--font-cabinet)', flexShrink: 0 }}>
                {ev.ago}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        style={{ position: 'absolute', top: -30, left: 4, display: 'flex', alignItems: 'center', gap: 7 }}
      >
        <motion.span
          style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block', boxShadow: '0 0 8px #7DB892' }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ fontSize: 11, color: '#7DB892', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
          Sistemas activos
        </span>
      </motion.div>

      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{
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
          <motion.span
            style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block', boxShadow: '0 0 6px #7DB892', flexShrink: 0 }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7DB892', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Automatización activa
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 9, color: 'rgba(168,159,140,0.4)', fontFamily: 'sans-serif', letterSpacing: '0.08em' }}>
            LIVE
          </span>
        </div>

        {/* Feed */}
        <div style={{ padding: '4px 0' }}>
          {FEED_EVENTS.map((ev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={i < visibleCount ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
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
                fontFamily: 'sans-serif',
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

              <span style={{ fontSize: 11, color: '#C8C0B0', fontFamily: 'sans-serif', flex: 1, lineHeight: 1.3 }}>
                {ev.event}
              </span>

              <span style={{ fontSize: 9, color: 'rgba(168,159,140,0.38)', fontFamily: 'sans-serif', flexShrink: 0 }}>
                {ev.ago}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

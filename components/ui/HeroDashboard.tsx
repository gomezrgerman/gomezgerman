'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Metric {
  label: string
  value: string
  sub?: string
  color?: string
}

const METRICS: Metric[] = [
  { label: 'reservas esta semana', value: '47', sub: 'sin intervención manual', color: '#7DB892' },
  { label: 'tiempo recuperado', value: '~2.4h', sub: 'por día en coordinación', color: '#F5F0E8' },
  { label: 'mensajes automatizados', value: '183', sub: 'enviados este mes', color: '#7DB892' },
]

export default function HeroDashboard() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: 'clamp(220px, 24vw, 280px)',
        backgroundColor: '#0d1f12',
        border: '1px solid rgba(125, 184, 146, 0.2)',
        borderRadius: 14,
        padding: '14px 16px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 9.5, fontWeight: 700, color: '#7DB892',
            fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          Esta semana
        </span>
        <span
          style={{
            fontSize: 9, color: 'rgba(168, 159, 140, 0.6)',
            fontFamily: 'sans-serif', letterSpacing: '0.04em',
          }}
        >
          automatización activa
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'rgba(125, 184, 146, 0.15)', marginBottom: 12 }} />

      {/* Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -12 }}
            animate={triggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}
          >
            <span
              style={{
                fontSize: 22, fontWeight: 800,
                color: m.color ?? '#F5F0E8',
                fontFamily: 'sans-serif',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                minWidth: 56,
              }}
            >
              {m.value}
            </span>
            <div>
              <div style={{ fontSize: 10, color: '#F5F0E8', fontFamily: 'sans-serif', lineHeight: 1.3 }}>
                {m.label}
              </div>
              {m.sub && (
                <div style={{ fontSize: 9, color: '#A89F8C', fontFamily: 'sans-serif', opacity: 0.7 }}>
                  {m.sub}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: '#A89F8C', fontFamily: 'sans-serif' }}>procesos automatizados</span>
          <span style={{ fontSize: 9, color: '#7DB892', fontFamily: 'sans-serif', fontWeight: 600 }}>94%</span>
        </div>
        <div style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={triggered ? { width: '94%' } : { width: '0%' }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: '#7DB892', borderRadius: 2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

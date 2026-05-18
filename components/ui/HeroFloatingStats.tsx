'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: 47,  suffix: '',  prefix: '',  label: 'reservas / semana',    color: '#7DB892' },
  { value: 95,  suffix: '%', prefix: '–', label: 'menos trabajo manual', color: '#F5F0E8' },
  { value: 183, suffix: '',  prefix: '',  label: 'mensajes al mes',       color: '#7DB892' },
]

function Counter({ target, active }: { target: number; active: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target])
  return <>{n}</>
}

export default function HeroFloatingStats() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.6vw' }}>
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -28 }}
          animate={triggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
          transition={{ duration: 0.55, delay: 0.08 + i * 0.14, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'baseline', gap: '0.7vw' }}
        >
          <span
            className="font-anybody"
            style={{
              fontSize: 'clamp(1.6rem, 3.6vw, 3.8rem)',
              fontWeight: 800,
              color: s.color,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            {s.prefix}<Counter target={s.value} active={triggered} />{s.suffix}
          </span>
          <span
            className="font-cabinet"
            style={{
              fontSize: 'clamp(0.55rem, 0.8vw, 0.75rem)',
              color: 'rgba(168,159,140,0.65)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

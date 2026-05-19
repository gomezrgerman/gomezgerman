'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function HeroLogoReveal() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
      style={{ width: 'clamp(200px, 22vw, 340px)', userSelect: 'none' }}
    >
      <div
        style={{
          background: 'rgba(8, 18, 11, 0.88)',
          border: '1px solid rgba(125, 184, 146, 0.22)',
          borderRadius: 10,
          padding: 'clamp(1.25rem, 2vw, 1.75rem) clamp(1.25rem, 2.2vw, 1.875rem)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(125,184,146,0.1)',
        }}
      >
        <p
          className="font-anybody text-cream"
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {`Construyo\nprocesos\nque hacen\ndinero,\nahorran\ntiempo y\nno piden\nvacaciones.`}
        </p>
      </div>
    </motion.div>
  )
}

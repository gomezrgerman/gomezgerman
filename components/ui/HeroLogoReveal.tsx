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
      initial={{ opacity: 0, scale: 1.06 }}
      animate={triggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.2 }}
      style={{
        width: 'clamp(280px, 60vw, 900px)',
        userSelect: 'none',
        transform: 'rotate(-2deg)',
        filter: 'drop-shadow(0 0 18px rgba(125, 184, 146, 0.12))',
      }}
    >
      {/* Borde exterior — efecto sello */}
      <div
        style={{
          border: '2px dashed rgba(125, 184, 146, 0.5)',
          borderRadius: 2,
          padding: 5,
        }}
      >
        {/* Borde interior */}
        <div
          style={{
            border: '1px solid rgba(125, 184, 146, 0.22)',
            borderRadius: 1,
            background: 'rgba(74, 124, 89, 0.07)',
            padding: 'clamp(1.5rem, 2.5vw, 2.5rem) clamp(1.75rem, 3vw, 3rem)',
          }}
        >
          <p
            className="font-anybody"
            style={{
              fontSize: 'clamp(1.6rem, 3.8vw, 4.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: 0,
              whiteSpace: 'pre-line',
              color: '#7DB892',
            }}
          >
            {`Construyo procesos\nque hacen dinero,\nahorran tiempo y\nno piden vacaciones.`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroLogoReveal() {
  const [triggered, setTriggered] = useState(false)
  const [impacted, setImpacted]   = useState(false)
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

  // Dispara el ripple justo cuando el sello golpea (~56% del animation delay+duration)
  useEffect(() => {
    if (!triggered) return
    const t = setTimeout(() => setImpacted(true), 650)
    return () => clearTimeout(t)
  }, [triggered])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 'clamp(280px, 60vw, 900px)',
        userSelect: 'none',
      }}
    >
      {/* Sello */}
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 1.12, rotate: -2 }}
        animate={
          triggered
            ? {
                // Desciende rápido, aparece de golpe en el impacto, rebota y asienta
                opacity: [0,    0,    1,    1,    1,    1   ],
                y:       [-60, -10,   0,    4,    0,    0   ],
                scale:   [1.12, 1.08, 0.96, 1.03, 1,    1  ],
                rotate:  -2,
                filter: [
                  'drop-shadow(0 0 0px rgba(125,184,146,0))',
                  'drop-shadow(0 0 0px rgba(125,184,146,0))',
                  'drop-shadow(0 0 32px rgba(125,184,146,0.5))',
                  'drop-shadow(0 0 20px rgba(125,184,146,0.25))',
                  'drop-shadow(0 0 18px rgba(125,184,146,0.12))',
                  'drop-shadow(0 0 18px rgba(125,184,146,0.12))',
                ],
              }
            : { opacity: 0, y: -60, scale: 1.12, rotate: -2, filter: 'drop-shadow(0 0 0px rgba(125,184,146,0))' }
        }
        transition={{
          duration: 0.65,
          times:    [0, 0.44, 0.56, 0.70, 0.85, 1],
          delay:    0.3,
        }}
      >
        {/* Borde exterior discontinuo */}
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

      {/* Ripple de impacto — expansión de tinta al golpear */}
      <AnimatePresence>
        {impacted && (
          <motion.div
            key="stamp-ripple"
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1.06, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -8,
              border: '1.5px solid rgba(125, 184, 146, 0.6)',
              borderRadius: 3,
              pointerEvents: 'none',
              rotate: '-2deg',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

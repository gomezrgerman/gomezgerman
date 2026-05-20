'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroLogoReveal() {
  const [triggered, setTriggered] = useState(false)
  const [impacted, setImpacted]   = useState(false)
  const [hovered, setHovered]     = useState(false)
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

  useEffect(() => {
    if (!triggered) return
    const t = setTimeout(() => setImpacted(true), 520)
    return () => clearTimeout(t)
  }, [triggered])

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 'clamp(260px, 52vw, 820px)',
        userSelect: 'none',
      }}
      whileHover={{ scale: 1.025, rotate: -2.8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      {/* Sello — cae y golpea */}
      <motion.div
        initial={{ opacity: 0, y: -80, scale: 1.15, rotate: -2 }}
        animate={
          triggered
            ? {
                opacity: [0,    0,    1,    1,    1,    1   ],
                y:       [-80, -12,   0,    7,   -1,    0   ],
                scale:   [1.15, 1.10, 0.91, 1.07, 0.99, 1  ],
                rotate:  [-2,  -2,   -3.2, -0.8, -2,   -2  ],
                filter: [
                  'drop-shadow(0 0 0px rgba(125,184,146,0))',
                  'drop-shadow(0 0 0px rgba(125,184,146,0))',
                  'drop-shadow(0 0 50px rgba(125,184,146,0.75))',
                  'drop-shadow(0 0 28px rgba(125,184,146,0.35))',
                  'drop-shadow(0 0 18px rgba(125,184,146,0.12))',
                  'drop-shadow(0 0 18px rgba(125,184,146,0.12))',
                ],
              }
            : { opacity: 0, y: -80, scale: 1.15, rotate: -2, filter: 'drop-shadow(0 0 0px rgba(125,184,146,0))' }
        }
        transition={{
          duration: 0.55,
          times:    [0, 0.40, 0.50, 0.66, 0.82, 1],
          ease:     ['easeIn', 'easeIn', 'easeOut', 'easeOut', 'easeOut'],
          delay:    0.25,
        }}
      >
        {/* Borde exterior */}
        <div
          style={{
            border: `2px dashed rgba(125, 184, 146, ${hovered ? 0.85 : 0.5})`,
            borderRadius: 2,
            padding: 5,
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* Borde interior */}
          <div
            style={{
              border: `1px solid rgba(125, 184, 146, ${hovered ? 0.45 : 0.22})`,
              borderRadius: 1,
              background: hovered ? 'rgba(74, 124, 89, 0.13)' : 'rgba(74, 124, 89, 0.07)',
              padding: 'clamp(1.5rem, 2.5vw, 2.5rem) clamp(1.75rem, 3vw, 3rem)',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
          >
            <p
              className="font-anybody"
              style={{
                fontSize: 'clamp(1.1rem, 2.8vw, 3.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: 0,
                whiteSpace: 'pre-line',
                color: hovered ? '#F5F0E8' : '#7DB892',
                transition: 'color 0.3s ease',
              }}
            >
              {`Construyo procesos\nque hacen dinero,\nahorran tiempo y\nno piden vacaciones.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Doble ripple de impacto */}
      <AnimatePresence>
        {impacted && (
          <>
            <motion.div
              key="ripple-1"
              initial={{ scale: 0.90, opacity: 1 }}
              animate={{ scale: 1.12, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: -8,
                border: '2px solid rgba(125, 184, 146, 0.65)',
                borderRadius: 3,
                pointerEvents: 'none',
                rotate: '-2deg',
              }}
            />
            <motion.div
              key="ripple-2"
              initial={{ scale: 0.92, opacity: 0.55 }}
              animate={{ scale: 1.20, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.58, ease: 'easeOut', delay: 0.07 }}
              style={{
                position: 'absolute',
                inset: -8,
                border: '1px solid rgba(125, 184, 146, 0.4)',
                borderRadius: 3,
                pointerEvents: 'none',
                rotate: '-2deg',
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

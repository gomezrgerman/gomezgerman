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

  // Ripple dispara justo en el impacto (50% de 0.55s + 0.25s delay)
  useEffect(() => {
    if (!triggered) return
    const t = setTimeout(() => setImpacted(true), 520)
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
        <div style={{ border: '2px dashed rgba(125, 184, 146, 0.5)', borderRadius: 2, padding: 5 }}>
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
    </div>
  )
}

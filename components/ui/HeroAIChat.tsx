'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 0 | 1 | 2 | 3

export default function HeroAIChat() {
  const [step, setStep] = useState<Step>(0)
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

  useEffect(() => {
    if (!triggered) return
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => setStep(2), 1300)
    const t3 = setTimeout(() => setStep(3), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [triggered])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        width: 'clamp(240px, 26vw, 310px)',
        backgroundColor: '#111',
        border: '1px solid rgba(125, 184, 146, 0.2)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: '#7DB892',
            boxShadow: '0 0 6px #7DB892',
          }}
        />
        <span
          style={{
            fontSize: 11.5, fontWeight: 600,
            color: '#F5F0E8', fontFamily: 'sans-serif',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          Asistente G2Fit
        </span>
        <span
          style={{
            marginLeft: 'auto', fontSize: 9, color: '#7DB892',
            fontFamily: 'sans-serif', letterSpacing: '0.06em',
          }}
        >
          IA activa
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          padding: '12px 12px',
          minHeight: 150,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <AnimatePresence>
          {/* User message */}
          {step >= 1 && (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(125, 184, 146, 0.18)',
                  border: '1px solid rgba(125, 184, 146, 0.25)',
                  borderRadius: '10px 10px 2px 10px',
                  padding: '7px 11px',
                  maxWidth: '80%',
                }}
              >
                <p style={{ fontSize: 11, color: '#F5F0E8', fontFamily: 'sans-serif', lineHeight: 1.45, margin: 0 }}>
                  ¿Qué clientes tienen el bono a punto de vencer esta semana?
                </p>
              </div>
            </motion.div>
          )}

          {/* Typing dots */}
          {step === 2 && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: '#7DB892',
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* AI response */}
          {step >= 3 && (
            <motion.div
              key="response"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px 10px 10px 2px',
                  padding: '8px 11px',
                  maxWidth: '88%',
                }}
              >
                <p style={{ fontSize: 11, color: '#A89F8C', fontFamily: 'sans-serif', lineHeight: 1.5, margin: 0 }}>
                  <span style={{ color: '#7DB892', fontWeight: 600 }}>3 clientes</span> con bono activo y menos de 2 sesiones:{' '}
                  <span style={{ color: '#F5F0E8' }}>Ana M., Julio R. y Pedro G.</span>
                  <br />
                  <span style={{ fontSize: 10, opacity: 0.7 }}>¿Envío recordatorio automático?</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

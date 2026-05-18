'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  {
    id: 1,
    side: 'received' as const,
    text: 'Hola Carmen! Recordatorio: tienes cita mañana martes a las 11:30h en D Bonita. ¿Confirmas? 📅',
    time: '10:15',
    delay: 400,
  },
  {
    id: 2,
    side: 'sent' as const,
    text: 'Confirmada, gracias! ✨',
    time: '10:22',
    delay: 1600,
  },
  {
    id: 3,
    side: 'system' as const,
    text: 'Enviado automáticamente · Bot de D Bonita',
    time: '',
    delay: 2100,
  },
]

export default function HeroWhatsApp() {
  const [visible, setVisible] = useState(0)
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
    const timers = MESSAGES.map((m) =>
      setTimeout(() => setVisible((n) => Math.max(n, m.id)), m.delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [triggered])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ width: 'clamp(220px, 24vw, 290px)' }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#075E54',
          borderRadius: '12px 12px 0 0',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            backgroundColor: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'sans-serif',
            flexShrink: 0,
          }}
        >
          D
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'white', fontFamily: 'sans-serif', lineHeight: 1.3 }}>
            D Bonita
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: 'sans-serif' }}>
            automatización activa ●
          </div>
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          backgroundColor: '#ECE5DD',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3C/svg%3E")',
          borderRadius: '0 0 12px 12px',
          padding: '12px 10px',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        }}
      >
        <AnimatePresence>
          {MESSAGES.map(
            (m) =>
              visible >= m.id && (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    justifyContent:
                      m.side === 'sent' ? 'flex-end'
                      : m.side === 'system' ? 'center'
                      : 'flex-start',
                  }}
                >
                  {m.side === 'system' ? (
                    <span
                      style={{
                        fontSize: 9.5, color: '#9e9e9e',
                        fontFamily: 'sans-serif', letterSpacing: '0.03em',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        padding: '2px 8px', borderRadius: 8,
                      }}
                    >
                      {m.text}
                    </span>
                  ) : (
                    <div
                      style={{
                        backgroundColor: m.side === 'sent' ? '#DCF8C6' : 'white',
                        borderRadius:
                          m.side === 'sent' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                        padding: '7px 10px 5px',
                        maxWidth: '82%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11, color: '#303030',
                          fontFamily: 'sans-serif', lineHeight: 1.45,
                          margin: 0,
                        }}
                      >
                        {m.text}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                        <span style={{ fontSize: 9, color: '#9e9e9e', fontFamily: 'sans-serif' }}>
                          {m.time}
                        </span>
                        {m.side === 'sent' && (
                          <span style={{ fontSize: 9, color: '#4FC3F7', fontFamily: 'sans-serif' }}>✓✓</span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

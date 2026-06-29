'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

// ── Posiciones en la baraja ──────────────────────────────────────────────────
const STACK = [
  { x: 0,   y: 0,  rotate: 4,   scale: 1,    z: 30 },
  { x: 28,  y: 14, rotate: -9,  scale: 0.97, z: 20 },
  { x: -20, y: 24, rotate: 13,  scale: 0.94, z: 10 },
]

const CARD_W      = 590
const CARD_HEIGHT = 535

// ── Typewriter hook ──────────────────────────────────────────────────────────
type TWPhase = 'idle' | 'typing-indicator' | 'typing' | 'done'

function useTypewriter(text: string, active: boolean, speed = 26, preDelay = 900) {
  const [phase, setPhase]     = useState<TWPhase>('idle')
  const [charCount, setCount] = useState(0)

  useEffect(() => {
    if (!active) { setPhase('idle'); setCount(0); return }
    setPhase('typing-indicator')
    const t = setTimeout(() => { setPhase('typing'); setCount(0) }, preDelay)
    return () => clearTimeout(t)
  }, [active, preDelay])

  useEffect(() => {
    if (phase !== 'typing') return
    if (charCount >= text.length) { setPhase('done'); return }
    const t = setTimeout(() => setCount((n) => n + 1), speed)
    return () => clearTimeout(t)
  }, [phase, charCount, text.length, speed])

  return { phase, charCount }
}


// ── Tarjeta 1: WhatsApp ──────────────────────────────────────────────────────
function WhatsAppCard() {
  return (
    <div style={{ width: CARD_W, borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.55)' }}>
      <div style={{ backgroundColor: '#075E54', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'sans-serif', flexShrink: 0 }}>D</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: 'sans-serif', lineHeight: 1.3 }}>D Bonita</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif' }}>automatización activa ●</div>
        </div>
      </div>
      <div style={{ backgroundColor: '#ECE5DD', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Bubble side="received" text="Hola Carmen! Cita mañana a las 11:30h en D Bonita. ¿Confirmas? 📅" time="10:15" />
        <Bubble side="sent" text="Confirmada, gracias! ✨" time="10:22" check />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: '#9e9e9e', fontFamily: 'sans-serif', backgroundColor: 'rgba(255,255,255,0.5)', padding: '3px 10px', borderRadius: 8 }}>
            Enviado automáticamente · Bot de D Bonita
          </span>
        </div>
      </div>
    </div>
  )
}

function Bubble({ side, text, time, check }: { side: 'sent' | 'received'; text: string; time: string; check?: boolean }) {
  const isSent = side === 'sent'
  return (
    <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
      <div style={{ backgroundColor: isSent ? '#DCF8C6' : 'white', borderRadius: isSent ? '10px 10px 2px 10px' : '10px 10px 10px 2px', padding: '8px 12px 6px', maxWidth: '82%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: 13, color: '#303030', fontFamily: 'sans-serif', lineHeight: 1.45, margin: 0 }}>{text}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
          <span style={{ fontSize: 10, color: '#9e9e9e', fontFamily: 'sans-serif' }}>{time}</span>
          {check && <span style={{ fontSize: 10, color: '#4FC3F7' }}>✓✓</span>}
        </div>
      </div>
    </div>
  )
}

// ── Tarjeta 2: Chat IA ───────────────────────────────────────────────────────
const AI_SEGMENTS: { text: string; style: React.CSSProperties }[] = [
  { text: '3 clientes',                     style: { color: '#7DB892', fontWeight: 600 } },
  { text: ' con menos de 2 sesiones: ',     style: { color: '#A89F8C' } },
  { text: 'Ana M., Julio R. y Pedro G.',    style: { color: '#F5F0E8' } },
]
const AI_FOOTER  = '¿Envío recordatorio automático?'
const AI_BODY_LEN = AI_SEGMENTS.reduce((a, s) => a + s.text.length, 0)
const AI_FULL    = AI_SEGMENTS.map((s) => s.text).join('') + '\n' + AI_FOOTER

function renderSegments(visibleChars: number): ReactNode[] {
  const nodes: ReactNode[] = []
  let total = 0
  for (const seg of AI_SEGMENTS) {
    const visible = Math.max(0, Math.min(visibleChars - total, seg.text.length))
    if (visible > 0) nodes.push(<span key={total} style={seg.style}>{seg.text.slice(0, visible)}</span>)
    total += seg.text.length
    if (total >= visibleChars) break
  }
  if (visibleChars > AI_BODY_LEN) {
    nodes.push(<br key="br" />)
    const footerVisible = Math.max(0, visibleChars - AI_BODY_LEN - 1)
    if (footerVisible > 0) {
      nodes.push(
        <span key="footer" style={{ fontSize: 11, opacity: 0.65 }}>
          {AI_FOOTER.slice(0, footerVisible)}
        </span>
      )
    }
  }
  return nodes
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px 10px 10px 2px', padding: '10px 14px' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const STATIC_AI_RESPONSE = (
  <p style={{ fontSize: 13, color: '#A89F8C', fontFamily: 'sans-serif', lineHeight: 1.5, margin: 0 }}>
    <span style={{ color: '#7DB892', fontWeight: 600 }}>3 clientes</span>
    {' '}con menos de 2 sesiones:{' '}
    <span style={{ color: '#F5F0E8' }}>Ana M., Julio R. y Pedro G.</span>
    <br />
    <span style={{ fontSize: 11, opacity: 0.65 }}>¿Envío recordatorio automático?</span>
  </p>
)

function AIChatCard({ isActive }: { isActive: boolean }) {
  const { phase, charCount } = useTypewriter(AI_FULL, isActive)

  return (
    <div style={{ width: CARD_W, borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', backgroundColor: '#111', border: '1px solid rgba(125,184,146,0.2)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#7DB892', boxShadow: '0 0 8px #7DB892' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#F5F0E8', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Asistente G2Fit</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#7DB892', fontFamily: 'sans-serif' }}>IA activa</span>
      </div>
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 108 }}>
        {/* Pregunta del usuario — siempre visible */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(125,184,146,0.18)', border: '1px solid rgba(125,184,146,0.25)', borderRadius: '10px 10px 2px 10px', padding: '8px 13px', maxWidth: '80%' }}>
            <p style={{ fontSize: 13, color: '#F5F0E8', fontFamily: 'sans-serif', lineHeight: 1.45, margin: 0 }}>¿Qué clientes tienen el bono a punto de vencer?</p>
          </div>
        </div>

        {/* Respuesta IA */}
        {phase === 'idle' && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px 10px 10px 2px', padding: '9px 13px', maxWidth: '88%' }}>
              {STATIC_AI_RESPONSE}
            </div>
          </div>
        )}

        {phase === 'typing-indicator' && <TypingDots />}

        {(phase === 'typing' || phase === 'done') && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px 10px 10px 2px', padding: '9px 13px', maxWidth: '88%' }}>
              <p style={{ fontSize: 13, color: '#A89F8C', fontFamily: 'sans-serif', lineHeight: 1.5, margin: 0 }}>
                {renderSegments(charCount)}
                {phase === 'typing' && (
                  <motion.span
                    style={{ color: '#7DB892', fontWeight: 300 }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tarjeta 3: Live automation feed ─────────────────────────────────────────
const FEED_EVENTS = [
  { project: 'NutriFlow', color: '#C4A882', event: 'Dieta generada',           ago: 'ahora'  },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Recordatorio enviado',     ago: '12s'    },
  { project: 'G2Fit',     color: '#7DB892', event: 'Bono registrado',          ago: '38s'    },
  { project: 'NutriFlow', color: '#C4A882', event: 'PDF entregado al cliente', ago: '1 min'  },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Reserva confirmada',       ago: '2 min'  },
  { project: 'G2Fit',     color: '#7DB892', event: 'Sesión completada',        ago: '3 min'  },
  { project: 'NutriFlow', color: '#C4A882', event: 'Plan ajustado por Lydia',  ago: '4 min'  },
  { project: 'D Bonita',  color: '#C17B5A', event: 'Pago procesado',           ago: '5 min'  },
]

function AutoFeedCard({ isActive }: { isActive: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!isActive) { setVisibleCount(0); return }
    let count = 0
    const id = setInterval(() => {
      count += 1
      setVisibleCount(count)
      if (count >= FEED_EVENTS.length) clearInterval(id)
    }, 420)
    return () => clearInterval(id)
  }, [isActive])

  return (
    <div style={{
      width: CARD_W,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 16px 48px rgba(0,0,0,0.65)',
      backgroundColor: '#0a0f0b',
      border: '1px solid rgba(125,184,146,0.18)',
    }}>
      {/* Header */}
      <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(125,184,146,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <motion.span
          style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#7DB892', display: 'inline-block', boxShadow: '0 0 7px #7DB892', flexShrink: 0 }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#7DB892', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Automatización activa
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(168,159,140,0.45)', fontFamily: 'sans-serif', letterSpacing: '0.06em' }}>
          LIVE
        </span>
      </div>

      {/* Feed */}
      <div style={{ padding: '10px 0', minHeight: 440 }}>
        {FEED_EVENTS.map((ev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={i < visibleCount ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {/* Check */}
            <span style={{ color: ev.color, fontSize: 13, flexShrink: 0, lineHeight: 1 }}>✓</span>

            {/* Project badge */}
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: ev.color,
              fontFamily: 'sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: `${ev.color}14`,
              border: `1px solid ${ev.color}30`,
              borderRadius: 4,
              padding: '2px 7px',
              flexShrink: 0,
            }}>
              {ev.project}
            </span>

            {/* Event description */}
            <span style={{ fontSize: 12, color: '#C8C0B0', fontFamily: 'sans-serif', flex: 1, lineHeight: 1.3 }}>
              {ev.event}
            </span>

            {/* Timestamp */}
            <span style={{ fontSize: 10, color: 'rgba(168,159,140,0.4)', fontFamily: 'sans-serif', flexShrink: 0 }}>
              {ev.ago}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Baraja principal ─────────────────────────────────────────────────────────
export default function HeroCardDeck() {
  const [front, setFront]         = useState(0)
  const [triggered, setTriggered] = useState(false)
  const [hovered, setHovered]     = useState(false)
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

  // Intervalo más largo para que el typewriter complete antes de avanzar
  useEffect(() => {
    if (!triggered || hovered) return
    const id = setInterval(() => setFront((n) => (n + 1) % 3), 6500)
    return () => clearInterval(id)
  }, [triggered, hovered])

  const advance = () => setFront((n) => (n + 1) % 3)

  return (
    <div style={{ position: 'relative' }}>

      {/* Label "sistemas activos" */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        style={{ position: 'absolute', top: -34, left: 4, display: 'flex', alignItems: 'center', gap: 7 }}
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

      {/* Deck */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{ position: 'relative', width: CARD_W + 48, height: CARD_HEIGHT, cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={advance}
        title="Click para ver la siguiente"
      >
        {[0, 1, 2].map((i) => {
          const stackPos = (i - front + 3) % 3
          const pos = STACK[stackPos]
          return (
            <motion.div
              key={i}
              animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: pos.scale }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: pos.z }}
            >
              {i === 0 && <WhatsAppCard />}
              {i === 1 && <AIChatCard isActive={front === 1} />}
              {i === 2 && <AutoFeedCard isActive={front === 2} />}
            </motion.div>
          )
        })}

        {/* Indicadores de posición */}
        <div
          style={{
            position: 'absolute',
            bottom: -26,
            left: Math.round(CARD_W / 2),
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: front === i ? 18 : 5,
                height: 3,
                borderRadius: 2,
                backgroundColor: front === i ? '#7DB892' : 'rgba(245,240,232,0.25)',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

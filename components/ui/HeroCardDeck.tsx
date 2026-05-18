'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

// ── Posiciones en la baraja ──────────────────────────────────────────────────
const STACK = [
  { x: 0,   y: 0,  rotate: 4,   scale: 1,    z: 30 },
  { x: 28,  y: 14, rotate: -9,  scale: 0.97, z: 20 },
  { x: -20, y: 24, rotate: 13,  scale: 0.94, z: 10 },
]

const CARD_W      = 430
const CARD_HEIGHT = 340

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

// ── Counter hooks ────────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    let rafId: number
    const start = performance.now()
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    const delay = setTimeout(() => { rafId = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(delay); cancelAnimationFrame(rafId) }
  }, [active, target, duration])
  return value
}

function useFloatCounter(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    let rafId: number
    const start = performance.now()
    const tick  = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(parseFloat((target * (1 - Math.pow(1 - p, 3))).toFixed(1)))
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    const delay = setTimeout(() => { rafId = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(delay); cancelAnimationFrame(rafId) }
  }, [active, target, duration])
  return value
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

// ── Tarjeta 3: Dashboard ─────────────────────────────────────────────────────
function DashboardCard({ isActive }: { isActive: boolean }) {
  const reservas = useCounter(47,  isActive, 1400)
  const mensajes = useCounter(183, isActive, 1900)
  const horas    = useFloatCounter(2.4, isActive, 1600)
  const barPct   = useCounter(94,  isActive, 2100)

  const rows = [
    { v: String(reservas),             l: 'reservas automatizadas',  s: 'sin intervención manual',  c: '#7DB892' },
    { v: `~${horas.toFixed(1)}h`,      l: 'tiempo recuperado / día', s: 'en coordinación y gestión', c: '#F5F0E8' },
    { v: String(mensajes),             l: 'mensajes enviados',        s: 'este mes',                  c: '#7DB892' },
  ]

  return (
    <div style={{ width: CARD_W, borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', backgroundColor: '#0d1f12', border: '1px solid rgba(125,184,146,0.2)', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#7DB892', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Esta semana</span>
        <span style={{ fontSize: 10, color: 'rgba(168,159,140,0.55)', fontFamily: 'sans-serif' }}>automatización activa</span>
      </div>
      <div style={{ height: 1, backgroundColor: 'rgba(125,184,146,0.15)', marginBottom: 14 }} />
      {rows.map(({ v, l, s, c }) => (
        <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 11 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: c, fontFamily: 'sans-serif', lineHeight: 1, letterSpacing: '-0.03em', minWidth: 64, fontVariantNumeric: 'tabular-nums' } as React.CSSProperties}>{v}</span>
          <div>
            <div style={{ fontSize: 12, color: '#F5F0E8', fontFamily: 'sans-serif', lineHeight: 1.3 }}>{l}</div>
            <div style={{ fontSize: 10, color: '#A89F8C', fontFamily: 'sans-serif', opacity: 0.65 }}>{s}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: '#A89F8C', fontFamily: 'sans-serif' }}>procesos automatizados</span>
          <span style={{ fontSize: 10, color: '#7DB892', fontFamily: 'sans-serif', fontWeight: 600 }}>{barPct}%</span>
        </div>
        <div style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <div style={{ width: `${barPct}%`, height: '100%', backgroundColor: '#7DB892', borderRadius: 2 }} />
        </div>
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
              {i === 2 && <DashboardCard isActive={front === 2} />}
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

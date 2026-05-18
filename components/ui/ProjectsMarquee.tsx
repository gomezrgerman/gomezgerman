'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

const ROW = 'Sí, esto ahora va solo  —  Menos gestión, más negocio  —  Probablemente tu negocio necesita esto  —  '

const TOOLTIP  = 'Mira cómo funciona'
const DURATION = 20

export default function ProjectsMarquee() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const tlRef        = useRef<gsap.core.Timeline | null>(null)
  const targetSpeed  = useRef(1)
  const currentSpeed = useRef(1)
  const mouseRef     = useRef({ x: 0, y: 0, time: Date.now() })
  const decayTimer   = useRef<ReturnType<typeof setTimeout>>()
  const rafRef       = useRef<number>(0)

  const [hovered,  setHovered]  = useState(false)
  const [cursor,   setCursor]   = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!trackRef.current) return

    tlRef.current = gsap.timeline({ repeat: -1 })
    tlRef.current.fromTo(trackRef.current,
      { x: '0%' }, { x: '-50%', duration: DURATION, ease: 'none' },
    )

    const tick = () => {
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.08
      tlRef.current?.timeScale(currentSpeed.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      tlRef.current?.kill()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      const dt  = Math.max(now - mouseRef.current.time, 1)
      const dx  = e.clientX - mouseRef.current.x
      const dy  = e.clientY - mouseRef.current.y
      const v   = Math.sqrt(dx * dx + dy * dy) / dt

      targetSpeed.current = Math.min(1 + v * 14, 6)
      mouseRef.current = { x: e.clientX, y: e.clientY, time: now }

      setCursor({ x: e.clientX, y: e.clientY })
      setRotation(((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 7)

      clearTimeout(decayTimer.current)
      decayTimer.current = setTimeout(() => { targetSpeed.current = 1 }, 180)
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const now = Date.now()
      const dt  = Math.max(now - mouseRef.current.time, 1)
      const dx  = touch.clientX - mouseRef.current.x
      const dy  = touch.clientY - mouseRef.current.y
      const v   = Math.sqrt(dx * dx + dy * dy) / dt

      targetSpeed.current = Math.min(1 + v * 14, 6)
      mouseRef.current = { x: touch.clientX, y: touch.clientY, time: now }

      clearTimeout(decayTimer.current)
      decayTimer.current = setTimeout(() => { targetSpeed.current = 1 }, 180)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouchMove)
      clearTimeout(decayTimer.current)
    }
  }, [])

  const spanStyle: React.CSSProperties = {
    fontSize:      'clamp(1.5rem, 3.5vw, 3.5rem)',
    fontWeight:    800,
    letterSpacing: '-0.02em',
    lineHeight:    1,
    whiteSpace:    'nowrap',
    display:       'inline-block',
    color:         hovered ? '#152B1C' : '#4A7C59',
    transition:    'color 0.3s ease',
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: '#DDD0BC', paddingBlock: 'clamp(1.8rem, 3vw, 2.8rem)' }}
    >
      {hovered && (
        <div
          className="font-cabinet pointer-events-none fixed z-50 select-none"
          style={{
            top:             cursor.y,
            left:            cursor.x,
            transform:       `translate(-50%, -140%) rotateZ(${rotation}deg)`,
            backgroundColor: '#152B1C',
            color:           '#DDD0BC',
            fontWeight:      700,
            fontSize:        'clamp(0.75rem, 1vw, 0.9rem)',
            letterSpacing:   '0.04em',
            padding:         '0.55em 1.4em',
            borderRadius:    999,
            whiteSpace:      'nowrap',
          }}
        >
          {TOOLTIP}
        </div>
      )}

      <Link
        href="/work"
        style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={trackRef}
            className="font-anybody"
            style={{ display: 'inline-flex', willChange: 'transform' }}
          >
            <span style={spanStyle}>{ROW}</span>
            <span style={spanStyle}>{ROW}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

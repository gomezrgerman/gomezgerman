'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/motion'
import Link from 'next/link'
import { useDeferredEffect } from '@/lib/useDeferredEffect'

gsap.registerPlugin(ScrollTrigger)

const ROW = 'Sí, esto ahora va solo  —  Menos gestión, más negocio  —  Probablemente tu negocio necesita esto  —  '

const TOOLTIP = 'Mira cómo funciona'
/** Píxeles por fotograma a velocidad normal. */
const BASE_SPEED = 1.1

export default function ProjectsMarquee() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const targetSpeed  = useRef(1)
  const mouseRef     = useRef({ x: 0, y: 0, time: Date.now() })
  const decayTimer   = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [hovered,  setHovered]  = useState(false)
  const [cursor,   setCursor]   = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)

  // Avance continuo: velocidad del ratón + velocidad y sentido del scroll
  useDeferredEffect(() => {
    const track = trackRef.current
    if (!track || prefersReducedMotion()) return

    const motion = { x: 0, dir: -1, scrollVel: 0, speed: 1 }
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' })

    const scroll = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        motion.scrollVel = self.getVelocity()
        if (self.direction) motion.dir = self.direction === 1 ? -1 : 1
      },
    })

    const tick = () => {
      motion.speed += (targetSpeed.current - motion.speed) * 0.08
      const boost = Math.min(Math.abs(motion.scrollVel) / 120, 18)
      const half = track.scrollWidth / 2
      const next = motion.x + motion.dir * (BASE_SPEED * motion.speed + boost)
      motion.x = next <= -half ? next + half : next > 0 ? next - half : next
      gsap.set(track, { x: motion.x })
      skewTo(Math.max(-12, Math.min(12, -motion.scrollVel / 300)))
      motion.scrollVel *= 0.9
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      scroll.kill()
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

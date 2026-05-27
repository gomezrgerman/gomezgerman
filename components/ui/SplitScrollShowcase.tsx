'use client'

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface SplitPage {
  left: React.ReactNode
  right: React.ReactNode
  leftBg?: string
  rightBg?: string
}

interface Props {
  pages: SplitPage[]
  accent?: string
}

export default function SplitScrollShowcase({ pages, accent = '#4A7C59' }: Props) {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const leftRefs    = useRef<(HTMLDivElement | null)[]>([])
  const rightRefs   = useRef<(HTMLDivElement | null)[]>([])
  const containerRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const currentRef  = useRef(0)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Apply state directly to DOM — bypasses React batching on every scroll frame
  function applyState(idx: number) {
    if (idx === currentRef.current && idx !== 0) return
    currentRef.current = idx

    pages.forEach((_, i) => {
      const left  = leftRefs.current[i]
      const right = rightRefs.current[i]
      const cont  = containerRefs.current[i]
      if (!left || !right || !cont) return

      const isActive  = i === idx
      const isVisible = i <= idx   // active + past pages stay open

      // Active page gets highest z-index so it renders on top
      cont.style.zIndex = String(isActive ? pages.length + 1 : i + 1)

      // Only animate clip-path for the entering (active) page
      const t = isActive ? 'clip-path 900ms cubic-bezier(0.76, 0, 0.24, 1)' : 'none'
      left.style.transition  = t
      right.style.transition = t

      // Left reveals bottom-to-top; right reveals top-to-bottom
      left.style.clipPath  = isVisible ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)'
      right.style.clipPath = isVisible ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
    })

    // Update indicator dots
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      dot.style.width   = i === idx ? '20px' : '6px'
      dot.style.opacity = i === idx ? '1'    : '0.3'
    })
  }

  useEffect(() => {
    if (isMobile || !wrapperRef.current) return

    // Apply initial state without animation
    applyState(0)

    let st: ReturnType<typeof ScrollTrigger.create> | undefined

    const timer = setTimeout(() => {
      if (!wrapperRef.current) return
      ScrollTrigger.refresh()

      st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end:   'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(
            pages.length - 1,
            Math.floor(self.progress * pages.length),
          )
          applyState(idx)
        },
      })
    }, 150)

    return () => {
      clearTimeout(timer)
      st?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length, isMobile])

  // ── Mobile: paneles apilados ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div>
        {pages.map((page, i) => (
          <div key={i}>
            <div style={{ backgroundColor: page.leftBg ?? '#0a0a0a', minHeight: '50vw', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1.25rem' }}>
              {page.left}
            </div>
            <div style={{ backgroundColor: page.rightBg ?? '#111', minHeight: '50vw', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1.25rem' }}>
              {page.right}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Desktop: sticky con clip-path controlado directo al DOM ──────────────
  return (
    <div ref={wrapperRef} style={{ height: `${pages.length * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {pages.map((page, i) => (
          <div
            key={i}
            ref={el => { containerRefs.current[i] = el }}
            style={{ position: 'absolute', inset: 0, zIndex: i + 1 }}
          >
            {/* Left half */}
            <div
              ref={el => { leftRefs.current[i] = el }}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '50%', height: '100%',
                backgroundColor: page.leftBg ?? '#0a0a0a',
                // Initial: page 0 open, rest hidden
                clipPath: i === 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {page.left}
            </div>

            {/* Right half */}
            <div
              ref={el => { rightRefs.current[i] = el }}
              style={{
                position: 'absolute',
                top: 0, left: '50%', width: '50%', height: '100%',
                backgroundColor: page.rightBg ?? '#111',
                clipPath: i === 0 ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {page.right}
            </div>
          </div>
        ))}

        {/* Indicador de página */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 100 }}>
          {pages.map((_, i) => (
            <span
              key={i}
              ref={el => { dotRefs.current[i] = el }}
              style={{
                width: i === 0 ? 20 : 6,
                height: 6,
                borderRadius: 99,
                backgroundColor: accent,
                opacity: i === 0 ? 1 : 0.3,
                transition: 'width 0.35s ease, opacity 0.35s ease',
                display: 'inline-block',
              }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    if (!wrapperRef.current) return

    let st: ReturnType<typeof ScrollTrigger.create> | undefined

    // Delay to ensure layout is stable after SPA navigation
    const timer = setTimeout(() => {
      if (!wrapperRef.current) return
      ScrollTrigger.refresh()

      st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const idx = Math.min(pages.length - 1, Math.floor(self.progress * pages.length))
          setCurrent(idx)
        },
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      st?.kill()
    }
  }, [pages.length, isMobile])

  // ── Mobile: paneles apilados verticalmente ──────────────────────────────
  if (isMobile) {
    return (
      <div>
        {pages.map((page, i) => (
          <div key={i}>
            <div
              style={{
                backgroundColor: page.leftBg ?? '#0a0a0a',
                minHeight: '50vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 1.25rem',
              }}
            >
              {page.left}
            </div>
            <div
              style={{
                backgroundColor: page.rightBg ?? '#111',
                minHeight: '50vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 1.25rem',
              }}
            >
              {page.right}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Desktop: sticky scroll con clip-path ────────────────────────────────
  return (
    <div ref={wrapperRef} style={{ height: `${pages.length * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {pages.map((page, i) => {
          const isActive = current === i
          const isPast = i < current
          // Past pages stay open as background — active page clips in on top
          const isVisible = isActive || isPast

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                // Active page always on top; past/future pages below by index
                zIndex: isActive ? pages.length + 1 : i + 1,
              }}
            >
              {/* Left half — reveals from bottom (top clip recedes 100% → 0%) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '50%', height: '100%',
                  backgroundColor: page.leftBg ?? '#0a0a0a',
                  clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                  transition: isActive
                    ? 'clip-path 900ms cubic-bezier(0.76, 0, 0.24, 1)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {page.left}
              </div>

              {/* Right half — reveals from top (bottom clip recedes 100% → 0%) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: '50%', width: '50%', height: '100%',
                  backgroundColor: page.rightBg ?? '#111',
                  clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  transition: isActive
                    ? 'clip-path 900ms cubic-bezier(0.76, 0, 0.24, 1)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {page.right}
              </div>
            </div>
          )
        })}

        {/* Page indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
            zIndex: 100,
          }}
        >
          {pages.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 99,
                backgroundColor: accent,
                opacity: i === current ? 1 : 0.3,
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

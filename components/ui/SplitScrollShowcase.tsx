'use client'

import { useEffect, useRef, useState } from 'react'
import React from 'react'

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
    const handleScroll = () => {
      if (!wrapperRef.current) return
      const rect     = wrapperRef.current.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      const total    = wrapperRef.current.offsetHeight - window.innerHeight
      if (total <= 0) return
      const progress = Math.min(1, scrolled / total)
      const idx = Math.min(pages.length - 1, Math.floor(progress * pages.length))
      setCurrent(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  // ── Desktop: sticky scroll con animación ────────────────────────────────
  return (
    <div ref={wrapperRef} style={{ height: `${pages.length * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {pages.map((page, i) => {
          const isActive = current === i
          return (
            <div key={i} style={{ position: 'absolute', inset: 0, zIndex: i + 1 }}>
              {/* Left half — enters from bottom */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '50%', height: '100%',
                  backgroundColor: page.leftBg ?? '#0a0a0a',
                  transform: isActive ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {page.left}
              </div>

              {/* Right half — enters from top */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: '50%', width: '50%', height: '100%',
                  backgroundColor: page.rightBg ?? '#111',
                  transform: isActive ? 'translateY(0)' : 'translateY(-100%)',
                  transition: 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
            position: 'absolute', bottom: 28, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 6, zIndex: 100,
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

'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── FlowSection ──────────────────────────────────────────────────────────────
export interface FlowSectionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const FlowSection: React.FC<FlowSectionProps> = ({ children, className, style }) => (
  <section
    data-flow-section
    className={`relative min-h-screen w-full overflow-hidden ${className ?? ''}`}
  >
    <div
      data-flow-inner
      className="flow-art-container relative min-h-screen w-full"
      style={{
        transformOrigin: 'bottom left',
        willChange: 'transform',
        ...style,
      }}
    >
      <div
        className="flex flex-col justify-between"
        style={{
          minHeight: '100vh',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 5rem)',
          maxWidth: '1600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  </section>
)

// ── FlowArt ──────────────────────────────────────────────────────────────────
interface FlowArtProps {
  children: React.ReactNode
  className?: string
}

export default function FlowArt({ children, className }: FlowArtProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const count = React.Children.count(children)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return

    const sections = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
    )
    if (sections.length === 0) return

    const triggers: ScrollTrigger[] = []

    sections.forEach((section, i) => {
      gsap.set(section, { zIndex: i + 1 })

      const inner = section.querySelector<HTMLElement>('.flow-art-container')
      if (!inner) return

      if (i > 0) {
        const rotation = window.innerWidth < 768 ? 6 : 20
        gsap.set(inner, { rotation, transformOrigin: 'bottom left' })
        const tween = gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      }

      if (i < sections.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          }),
        )
      }
    })

    ScrollTrigger.refresh()

    return () => { triggers.forEach((t) => t.kill()) }
  }, [reducedMotion, count])

  return (
    <div ref={containerRef} className={`w-full overflow-x-hidden ${className ?? ''}`}>
      {children}
    </div>
  )
}

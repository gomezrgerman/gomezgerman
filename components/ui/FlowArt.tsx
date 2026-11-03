'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDeferredEffect } from '@/lib/useDeferredEffect'

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
    {/* Capa que se encoge cuando el siguiente panel la tapa */}
    <div data-flow-scale className="relative" style={{ transformOrigin: '50% 0%', willChange: 'transform' }}>
    <div
      data-flow-inner
      className="flow-art-container relative flex min-h-screen w-full flex-col justify-between"
      style={{
        paddingTop: 'clamp(2rem, 5vw, 4rem)',
        paddingBottom: 'clamp(2rem, 5vw, 4rem)',
        paddingLeft: 'max(clamp(1.5rem, 5vw, 5rem), calc((100% - 1600px) / 2))',
        paddingRight: 'max(clamp(1.5rem, 5vw, 5rem), calc((100% - 1600px) / 2))',
        transformOrigin: 'bottom left',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
    <div data-flow-shade aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundColor: '#000', opacity: 0, zIndex: 50 }} />
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

  useDeferredEffect(() => {
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

      // El panel anterior se encoge y oscurece mientras este lo tapa
      if (i > 0) {
        const prev = sections[i - 1]
        const prevScale = prev.querySelector<HTMLElement>('[data-flow-scale]')
        const prevShade = prev.querySelector<HTMLElement>('[data-flow-shade]')
        const cover = { trigger: section, start: 'top bottom', end: 'top top', scrub: true }
        if (prevScale) {
          const shrink = gsap.to(prevScale, { scale: 0.9, ease: 'none', scrollTrigger: cover })
          if (shrink.scrollTrigger) triggers.push(shrink.scrollTrigger)
        }
        if (prevShade) {
          const darken = gsap.to(prevShade, { opacity: 0.6, ease: 'none', scrollTrigger: { ...cover } })
          if (darken.scrollTrigger) triggers.push(darken.scrollTrigger)
        }
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

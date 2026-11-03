'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

interface MagneticProps {
  children: ReactNode
  /** Cuánto sigue al cursor (0 = nada, 1 = todo). */
  strength?: number
}

/** Envuelve un elemento para que se desplace un poco hacia el cursor al pasar por encima. */
export default function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * strength,
        y: (e.clientY - r.top - r.height / 2) * strength * 1.6,
        duration: 0.4,
      })
    }
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return (
    <span ref={ref} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </span>
  )
}

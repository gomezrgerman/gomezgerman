'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import SplitChars from '@/components/ui/SplitChars'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

interface ProximityTextProps {
  text: string
  className?: string
  style?: CSSProperties
  /** Distancia en px a partir de la cual la letra vuelve a su estado en reposo. */
  radius?: number
  /** Cuánto sube la letra con el cursor encima, en % de su altura. */
  lift?: number
}

/** Crema (#F5F0E8) en reposo, verde suave (#7DB892) con el cursor cerca. */
const FROM = [245, 240, 232] as const
const TO = [125, 184, 146] as const

/** Suavizado por frame: cuanto más bajo, más lento sigue al cursor. */
const EASE = 0.14

/**
 * Titular cuyas letras se elevan y se tiñen de verde según lo cerca que está el ratón.
 * Solo usa transform y color, así que el texto nunca cambia de ancho ni se recoloca.
 * Solo en escritorio.
 */
export default function ProximityText({ text, className, style, radius = 260, lift = 14 }: ProximityTextProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return

    const chars = Array.from(el.querySelectorAll<HTMLElement>('.prox-ch'))
    const current = chars.map(() => 0)
    const pointer = { x: -9999, y: -9999 }
    let visible = false

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(el)

    const tick = () => {
      if (!visible) return
      chars.forEach((c, i) => {
        // Medir sin el desplazamiento propio para que la letra no persiga al cursor
        const r = c.getBoundingClientRect()
        const cy = r.top + r.height / 2 + (current[i] * lift * r.height) / 100
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - cy)
        const target = 1 - Math.min(d / radius, 1)
        const t = current[i] + (target * target - current[i]) * EASE
        if (Math.abs(t - current[i]) < 0.001) return
        current[i] = t
        const rgb = FROM.map((f, k) => Math.round(f + (TO[k] - f) * t))
        c.style.transform = `translateY(${-t * lift}%)`
        c.style.color = `rgb(${rgb.join(',')})`
      })
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
      observer.disconnect()
      chars.forEach((c) => {
        c.style.transform = ''
        c.style.color = ''
      })
    }
  }, [radius, lift])

  return (
    <h2 ref={ref} className={className} style={style}>
      <SplitChars text={text} charClassName="prox-ch" />
    </h2>
  )
}

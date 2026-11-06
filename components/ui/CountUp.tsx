'use client'

import { useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, splitNumber } from '@/lib/motion'
import { useDeferredEffect } from '@/lib/useDeferredEffect'

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  value: string
  className?: string
  style?: CSSProperties
}

/** Cuenta desde 0 hasta la cifra al entrar en pantalla. El HTML del servidor ya trae la cifra final. */
export default function CountUp({ value, className, style }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useDeferredEffect(() => {
    const el = ref.current
    const parts = splitNumber(value)
    if (!el || !parts || prefersReducedMotion()) return

    const state = { v: 0 }
    const render = () => {
      el.textContent = `${parts.prefix}${Math.round(state.v)}${parts.suffix}`
    }
    render()

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(state, { v: parts.value, duration: 1.6, ease: 'power3.out', onUpdate: render })
      },
    })

    return () => {
      trigger.kill()
      gsap.killTweensOf(state)
      el.textContent = value
    }
  }, [value])

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  )
}

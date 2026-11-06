'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitChars from '@/components/ui/SplitChars'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

interface MaskedTitleProps {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: CSSProperties
  /** 'load': al montar la página (titulares de cabecera). 'scroll': al entrar en pantalla. */
  trigger?: 'load' | 'scroll'
  delay?: number
}

/** Titular cuyas letras suben desde una máscara, línea a línea. */
export default function MaskedTitle({ lines, as: Tag = 'h1', className, style, trigger = 'load', delay = 0.15 }: MaskedTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from('.mask-ch', {
        yPercent: 110,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.028,
        delay: trigger === 'load' ? delay : 0,
        clearProps: 'transform',
        scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 85%' } : undefined,
      })
    }, el)

    return () => ctx.revert()
  }, [trigger, delay])

  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((line) => (
        <span key={line} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <SplitChars text={line} charClassName="mask-ch" />
        </span>
      ))}
    </Tag>
  )
}

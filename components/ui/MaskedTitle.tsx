'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitChars from '@/components/ui/SplitChars'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

/** Ancho medio de una letra de Anybody 800 (con el tracking de titulares), en em, con margen. */
const CHAR_EM = 0.58

interface MaskedTitleProps {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: CSSProperties
  /** 'load': al montar la página (titulares de cabecera). 'scroll': al entrar en pantalla. */
  trigger?: 'load' | 'scroll'
  delay?: number
  /**
   * Tamaño máximo en escritorio (p. ej. '8vw'). Si se indica, desde 768px cada línea
   * ocupa siempre una sola línea y el tamaño se reduce lo justo para que quepa la más larga.
   * Así el corte no depende de si la fuente web ya ha cargado (sin saltos de diseño).
   */
  fit?: string
}

/** Titular cuyas letras suben desde una máscara, línea a línea. */
export default function MaskedTitle({ lines, as: Tag = 'h1', className, style, trigger = 'load', delay = 0.15, fit }: MaskedTitleProps) {
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

  const longest = Math.max(...lines.map((l) => l.length))
  const fitStyle: CSSProperties = fit
    ? ({
        ...style,
        fontSize: undefined,
        '--mt-base': style?.fontSize,
        '--mt-fit': `min(${fit}, calc((100vw - 2 * var(--px)) / ${(longest * CHAR_EM).toFixed(2)}))`,
      } as CSSProperties)
    : style ?? {}

  return (
    <Tag ref={ref} className={[className, fit ? 'masked-fit' : ''].filter(Boolean).join(' ')} style={fitStyle}>
      {lines.map((line) => (
        <span key={line} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <SplitChars text={line} charClassName="mask-ch" />
        </span>
      ))}
    </Tag>
  )
}

/**
 * Parte "Nombre — descripción" en líneas para un titular grande:
 * el nombre en su línea y, si la descripción pasa de `max` letras,
 * se corta en el espacio más cercano a la mitad (dos líneas equilibradas).
 */
export function titleLines(title: string, max = 18): string[] {
  const [name, rest] = title.split(' — ')
  if (!rest) return [title]
  if (rest.length <= max) return [`${name} —`, rest]
  const middle = rest.length / 2
  const spaces = rest.split('').flatMap((ch, i) => (ch === ' ' ? [i] : []))
  const cut = spaces.reduce((best, i) => (Math.abs(i - middle) < Math.abs(best - middle) ? i : best), spaces[0])
  return [`${name} —`, rest.slice(0, cut), rest.slice(cut + 1)]
}

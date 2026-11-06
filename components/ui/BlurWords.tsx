'use client'

import { Fragment, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/motion'
import { useDeferredEffect } from '@/lib/useDeferredEffect'

gsap.registerPlugin(ScrollTrigger)

interface BlurWordsProps {
  lines: string[]
  className?: string
  style?: CSSProperties
}

/** Titular cuyas palabras pasan de borrosas a nítidas, una a una, siguiendo el scroll. */
export default function BlurWords({ lines, className, style }: BlurWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useDeferredEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blur-word',
        { filter: 'blur(12px)', opacity: 0.15 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 1 },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <h2 ref={ref} className={className} style={style}>
      {lines.map((line, li) => (
        <Fragment key={line}>
          {li > 0 && <br />}
          {line.split(' ').map((word, wi) => (
            <Fragment key={`${word}-${wi}`}>
              {wi > 0 && ' '}
              <span className="blur-word" style={{ display: 'inline-block' }}>
                {word}
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </h2>
  )
}

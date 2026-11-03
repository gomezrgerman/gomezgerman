'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { n: '01', title: 'Diagnóstico y mapa', body: 'Vemos cómo trabajas hoy: qué se hace a mano, qué se pierde por WhatsApp y qué te cuesta horas cada semana.' },
  { n: '02', title: 'Diseño a medida', body: 'Web, panel y flujos pensados para las reglas de tu negocio. Sin plantillas genéricas.' },
  { n: '03', title: 'Construcción y automatización', body: 'Next.js, Supabase, n8n y Claude API conectados para que funcione solo.' },
  { n: '04', title: 'Lanzamiento y soporte', body: 'Migración de datos, formación y ajustes después de salir. Sigo a tu lado.' },
] as const

/** Escalón inicial de cada tarjeta, en proporción a su altura. */
const STAIR_OFFSETS = [0, 0.3, 0.45, 0.6] as const

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const steps = gsap.utils.toArray<HTMLElement>('.process-step')
        const stair = gsap.timeline({
          scrollTrigger: { trigger: '.process-stage', start: 'top 90%', end: 'top 25%', scrub: 1 },
        })
        steps.forEach((step, i) => {
          stair.fromTo(step, { y: () => STAIR_OFFSETS[i] * step.offsetHeight }, { y: 0, ease: 'none' }, 0)
        })

        const travel = { trigger: '.process-stage', start: 'top 55%', end: 'bottom 40%', scrub: 1 }
        gsap.fromTo('.process-packet', { left: '0%' }, { left: '100%', ease: 'none', scrollTrigger: travel })
        gsap.fromTo('.process-fill', { width: '0%' }, { width: '100%', ease: 'none', scrollTrigger: travel })
      })

      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
          gsap.from(step, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 88%' } })
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-title"
      style={{ backgroundColor: 'var(--color-bg)', paddingInline: 'var(--px)', paddingBlock: 'var(--py)' }}
    >
      <div style={{ maxWidth: 'var(--max-w)', marginInline: 'auto' }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end" style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <div>
            <p className="font-cabinet text-green-light" style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Cómo trabajo
            </p>
            <h2
              id="process-title"
              className="font-anybody text-cream"
              style={{ fontSize: 'clamp(2.5rem, 5.6vw, 6rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.92, marginTop: '1rem' }}
            >
              De papel y WhatsApp a un sistema.
            </h2>
          </div>
          <p className="font-cabinet text-cream-dim md:justify-self-end" style={{ maxWidth: '40ch', lineHeight: 1.75 }}>
            Cuatro pasos, sin sorpresas. Sabes en cada momento qué se está haciendo y por qué.
          </p>
        </div>

        <div className="process-stage relative grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="process-step flex flex-col justify-between gap-9"
              style={{
                backgroundColor: '#152B1C',
                border: '1px solid rgba(125, 184, 146, 0.2)',
                minHeight: 'clamp(240px, 34vw, 500px)',
                padding: 'clamp(1.25rem, 1.6vw, 1.5rem)',
                willChange: 'transform',
              }}
            >
              <span className="font-anybody text-green-light" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, lineHeight: 1 }}>
                {step.n}
              </span>
              <div>
                <h3 className="font-anybody text-cream" style={{ fontSize: 'clamp(1.35rem, 2vw, 1.9rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.015em' }}>
                  {step.title}
                </h3>
                <p className="font-cabinet text-cream-dim" style={{ fontSize: '0.9375rem', lineHeight: 1.5, marginTop: '0.75rem' }}>
                  {step.body}
                </p>
              </div>
            </article>
          ))}

          <div aria-hidden className="pointer-events-none absolute inset-x-0 hidden md:block" style={{ top: '30%', height: 1, backgroundColor: 'rgba(125, 184, 146, 0.3)', zIndex: 2 }}>
            <span className="process-fill absolute left-0 top-0 block" style={{ height: 1, width: 0, backgroundColor: '#7DB892' }} />
            <span
              className="process-packet absolute block rounded-full"
              style={{
                top: -7,
                left: 0,
                width: 14,
                height: 14,
                marginLeft: -7,
                backgroundColor: '#7DB892',
                boxShadow: '0 0 0 6px rgba(125,184,146,.18), 0 0 30px 6px rgba(125,184,146,.45)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

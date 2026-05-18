'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactCTA from '@/components/sections/ContactCTA'
import MeshCanvas from '@/components/ui/MeshCanvas'

gsap.registerPlugin(ScrollTrigger)

const PROCESS = [
  {
    num: '01',
    heading: 'Entiendo el negocio',
    body: 'Antes de tocar código, miro cómo funciona el negocio por dentro. Detecto dónde se pierde tiempo real y qué procesos dependen de que alguien esté encima.',
  },
  {
    num: '02',
    heading: 'Diseño el sistema',
    body: 'Mapeo qué se puede automatizar, cómo se conectan las piezas y cuál es el resultado final. Sin tecnología innecesaria — solo lo que resuelve el problema.',
  },
  {
    num: '03',
    heading: 'Lo pongo a funcionar',
    body: 'Lo construyo, lo pruebo y lo entrego funcionando. No un prototipo ni una demo — un sistema real que trabaja solo desde el primer día.',
  },
]

export default function AboutContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero: entra en mount
      gsap.timeline({ delay: 0.15 })
        .from('.about-heading', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('.about-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')

      // Secciones de contenido
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', backgroundColor: '#0a0e0b' }}>
      <MeshCanvas variant="subtle" />

      {/* Todo el contenido por encima del canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ─── HERO ─── */}
        <section className="flex min-h-[70svh] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 md:px-12 md:pb-24">
          <p
            className="about-sub mb-5 font-cabinet text-cream-dim"
            style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Germán Gómez · Marina Alta, Alicante
          </p>
          <h1
            className="about-heading font-anybody text-cream"
            style={{
              fontSize: 'clamp(2.4rem, 8vw, 8rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            No vengo del código.<br />
            Vengo del mostrador.
          </h1>
          <p
            className="about-sub mt-6 font-cabinet text-cream-dim"
            style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1rem)', maxWidth: '52ch', lineHeight: 1.75 }}
          >
            Miro cómo trabaja un negocio, detecto lo que se repite o depende
            de una persona, y lo convierto en algo que funciona solo.
          </p>
        </section>

        {/* ─── CONTENIDO PRINCIPAL ─── */}
        <section
          className="px-5 py-16 sm:px-8 sm:py-24 md:px-12 md:py-32"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
            {/* Texto + datos */}
            <div className="reveal-up flex flex-col gap-8">
              <p className="font-cabinet text-cream" style={{ fontSize: '1.1rem', lineHeight: 1.85 }}>
                Pasé años en el retail trabajando de cara al público y viendo por dentro
                cómo funcionan los negocios pequeños: mucho trabajo manual, procesos
                repetidos sin cuestionar y tiempo gastado en tareas que no aportaban nada real.
              </p>
              <p className="font-cabinet text-cream-dim" style={{ fontSize: '1.05rem', lineHeight: 1.85 }}>
                Eso me hizo cambiar de dirección. Cuanto más aprendía de programación e IA,
                más evidente se hacía lo mismo: los negocios no estaban mal gestionados —
                simplemente nadie había optimizado esa parte. Ahora trabajo con PYMEs de la
                Marina Alta y en remoto para convertir exactamente eso en sistemas que
                funcionan solos.
              </p>

              {/* Datos */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  '3 proyectos entregados.',
                  'Marina Alta · en remoto.',
                  'Fitness, salud y belleza.',
                ].map((fact) => (
                  <p
                    key={fact}
                    className="font-anybody text-cream"
                    style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}
                  >
                    {fact}
                  </p>
                ))}
              </div>
            </div>

            {/* Foto */}
            <div className="reveal-up flex items-start justify-center md:justify-end">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '4/5', border: '1px solid var(--color-border)', borderRadius: '2px', maxWidth: 'clamp(260px, 36vw, 460px)' }}
              >
                <Image
                  src="/img/german-gomez.jpg"
                  alt="Germán Gómez"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: 'var(--color-green)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── MANIFIESTO ─── */}
        <section
          className="reveal-up px-5 py-16 sm:px-8 sm:py-24 md:px-12 md:py-32"
          style={{
            borderTop: '1px solid rgba(74,124,89,0.25)',
            borderBottom: '1px solid rgba(74,124,89,0.25)',
            backgroundColor: 'rgba(10,20,16,0.6)',
          }}
        >
          <div style={{ maxWidth: '72ch' }}>
            <p
              className="font-anybody text-cream"
              style={{
                fontSize: 'clamp(1.6rem, 3.2vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              Lo que más odio es el trabajo innecesario.
            </p>
            <p
              className="mt-5 font-cabinet text-cream-dim"
              style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.75 }}
            >
              Las tareas que se hacen porque siempre se han hecho así.
              Los procesos que existen solo porque nadie los ha cuestionado.
            </p>
            <p
              className="mt-3 font-cabinet"
              style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.65, color: 'var(--color-green-light)' }}
            >
              Cuando veo eso en un negocio, es exactamente donde sé
              que hay un sistema que construir.
            </p>
          </div>
        </section>

        {/* ─── PROCESO ─── */}
        <section className="px-5 py-16 sm:px-8 sm:py-24 md:px-12 md:py-32" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p
            className="reveal-up font-cabinet text-cream-dim mb-16 md:mb-20"
            style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Cómo trabajo
          </p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {PROCESS.map((step, i) => (
              <div
                key={step.num}
                className="reveal-up"
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)',
                }}
              >
                <span
                  className="font-anybody block"
                  style={{
                    fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                    fontWeight: 100,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    color: 'rgba(125, 184, 146, 0.35)',
                    marginBottom: '1.5rem',
                  }}
                >
                  {step.num}
                </span>
                <h3
                  className="font-anybody text-cream"
                  style={{
                    fontSize: 'clamp(1.3rem, 2vw, 1.75rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.1,
                    marginBottom: '0.875rem',
                  }}
                >
                  {step.heading}
                </h3>
                <p
                  className="font-cabinet text-cream-dim"
                  style={{ fontSize: 'clamp(0.875rem, 1vw, 0.9375rem)', lineHeight: 1.75 }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <ContactCTA
          heading="¿Tienes procesos que nadie ha cuestionado todavía?"
          subtitle="Eso es exactamente lo que busco cuando entro en un negocio. Si lo reconoces, cuéntamelo."
        />

      </div>
    </div>
  )
}


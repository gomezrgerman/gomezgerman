'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MiniAbout() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mini-about-left',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        },
      )
      gsap.fromTo(
        '.mini-about-right',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        paddingLeft: 'var(--px)', paddingRight: 'var(--px)',
        paddingTop: 'var(--py)', paddingBottom: 'var(--py)',
        backgroundColor: '#152B1C',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20" style={{ alignItems: 'end' }}>

        {/* Izquierda: statement */}
        <div className="mini-about-left">
          <p
            className="font-cabinet text-cream-dim mb-5"
            style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Quién hay detrás
          </p>
          <h2
            className="font-anybody text-cream"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              marginBottom: '1.5rem',
            }}
          >
            No vengo del código.<br />
            Vengo del mostrador.
          </h2>
          <p
            className="font-cabinet text-cream-dim"
            style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', maxWidth: '44ch', lineHeight: 1.8 }}
          >
            Pasé años viendo por dentro cómo funcionan los negocios pequeños.
            Ahora construyo los sistemas que ojalá hubieran tenido.
          </p>
        </div>

        {/* Derecha: datos + CTA */}
        <div className="mini-about-right flex flex-col gap-8">
          <div
            className="grid grid-cols-3 gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: '2rem' }}
          >
            {[
              { num: '150+', label: 'Clientes gestionados\nen G2Fit' },
              { num: '−95%', label: 'Tiempo por paciente\nen NutriFlow' },
              { num: '24/7', label: 'Reservas automáticas\nen D Bonita' },
            ].map(({ num, label }) => (
              <div key={num}>
                <p
                  className="font-anybody text-cream"
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '0.4rem',
                    color: '#7DB892',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {num}
                </p>
                <p
                  className="font-cabinet text-cream-dim"
                  style={{ fontSize: '0.75rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-3 font-cabinet"
            style={{ color: '#7DB892', fontSize: '0.9375rem', letterSpacing: '0.02em' }}
          >
            <span className="relative">
              Saber más sobre mí
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full"
                style={{ backgroundColor: '#7DB892' }}
              />
            </span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

      </div>
      </div>
    </section>
  )
}

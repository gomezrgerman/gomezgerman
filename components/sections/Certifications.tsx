'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TiltCard from '@/components/ui/TiltCard'
import {
  CERTIFICATIONS,
  resolveAppliedProjects,
  type Certification,
} from '@/lib/certifications'

gsap.registerPlugin(ScrollTrigger)

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cert-card',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cert-grid', start: 'top 80%' },
        },
      )

      // Línea que "conecta" la credencial con los proyectos donde se aplica
      gsap.utils.toArray<HTMLElement>('.cert-applied').forEach((block) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 90%' } })
        tl.fromTo(
          block.querySelector('.cert-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'power2.inOut', delay: 0.4 },
        ).fromTo(
          block.querySelectorAll('.cert-chip'),
          { x: -12, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' },
          '-=0.2',
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ paddingLeft: 'var(--px)', paddingRight: 'var(--px)', paddingTop: 'var(--py)', paddingBottom: 'var(--py)', borderTop: '1px solid var(--color-border)' }}
    >
      <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="reveal-up mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <p
            className="font-cabinet text-cream-dim"
            style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Formación
          </p>
          <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.875rem, 1vw, 0.9375rem)', maxWidth: '44ch', lineHeight: 1.7 }}>
            Credenciales verificables, y dónde he aplicado cada una.
          </p>
        </div>

        <div
          className="cert-grid grid gap-5 md:gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}
        >
          {CERTIFICATIONS.map((cert) => (
            <CertCard key={cert.verifyUrl} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CertCard({ cert }: { readonly cert: Certification }) {
  const projects = resolveAppliedProjects(cert.appliedIn)
  const hasApplied = projects.length > 0 || Boolean(cert.appliedNote)

  return (
    <div className="cert-card" style={{ perspective: '900px' }}>
      <TiltCard className="group relative flex h-full flex-col overflow-hidden border border-border-subtle bg-bg-card p-6 hover:border-green md:p-7">
        {/* Brillo que sigue al puntero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(125,184,146,0.08), transparent 60%)' }}
        />

        {/* Insignia oficial; si no hay, sello verificado al hover */}
        {cert.badge ? (
          <Image
            src={cert.badge.src}
            alt={cert.badge.alt}
            width={64}
            height={64}
            className="pointer-events-none absolute right-6 top-6 h-14 w-14 opacity-80 saturate-[0.35] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:opacity-100 group-hover:saturate-100 md:h-16 md:w-16"
          />
        ) : (
          <span
            aria-hidden
            className="pointer-events-none absolute right-5 top-5 -rotate-[8deg] scale-125 border px-2 py-1 font-cabinet opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--color-green-light)', borderColor: 'var(--color-green-light)' }}
          >
            ✓ VERIFICADO
          </span>
        )}

        <span
          className="relative font-cabinet text-cream-dim"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', paddingTop: '0.4rem' }}
        >
          {cert.issuer}
        </span>

        <h3
          className="relative mt-5 font-anybody text-cream"
          style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, paddingRight: cert.badge ? '4.5rem' : undefined }}
        >
          {cert.title}
        </h3>

        <ul className="relative mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {cert.skills.map((skill) => (
            <li key={skill} className="font-cabinet text-green-light" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              {skill}
            </li>
          ))}
        </ul>

        {hasApplied && (
          <div className="cert-applied relative mt-7">
            <div className="flex items-center gap-3">
              <span className="font-cabinet text-cream-dim shrink-0" style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Aplicado en
              </span>
              <span className="cert-line block h-px flex-1 origin-left" style={{ backgroundColor: 'var(--color-green)' }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="cert-chip border border-border-subtle px-3 py-1.5 font-cabinet text-cream transition-colors duration-300 hover:border-green-light hover:text-green-light"
                  style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {p.name} →
                </Link>
              ))}
              {cert.appliedNote && (
                <span
                  className="cert-chip border border-dashed border-border-subtle px-3 py-1.5 font-cabinet text-cream-dim"
                  style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {cert.appliedNote}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pie: verificación */}
        <div className="relative mt-auto pt-7">
        <div
          className="flex items-center justify-end pt-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-cabinet shrink-0 text-green-light transition-colors duration-300 hover:text-cream"
            style={{ fontSize: '0.8125rem', letterSpacing: '0.04em' }}
          >
            Verificar ↗
          </a>
        </div>
        </div>
      </TiltCard>
    </div>
  )
}

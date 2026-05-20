'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { PROJECTS } from '@/lib/projects'
import MeshCanvas from '@/components/ui/MeshCanvas'

type PreviewSet = { main: string; a: string; b: string; liveUrl?: string }

const PREVIEWS: Record<string, PreviewSet> = {
  'g2fit': {
    main:    '/img/g2fit.png',
    a:       '/img/pwa-g2fit1.png',
    b:       '/img/pwa-g2fit2.png',
    liveUrl: 'https://g2fit.es/',
  },
  'nutricion-ia': {
    main: '/img/nutri_app.png',
    a:    '/img/flujo_n8n2.png',
    b:    '/img/pdf-nutri.png',
  },
  'd-bonita': {
    main: '/img/hero-dbonita.png',
    a:    '/img/dbonita-admin.png',
    b:    '/img/reservas-dbonita.png',
  },
}

export default function WorkList() {
  const [hovered, setHovered] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.wl-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.1 },
      )
      gsap.fromTo(
        '.wl-row',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.11, duration: 0.85, ease: 'power3.out', delay: 0.3 },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: '#0a0e0b',
        paddingTop: 'calc(var(--py) + 2rem)',
        paddingBottom: 'var(--py)',
      }}
    >
      <MeshCanvas variant="subtle" />
      {/* Contenido por encima del canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Header — ancho completo */}
      <div className="wl-header mb-12 md:mb-20" style={{ paddingLeft: 'var(--px)', paddingRight: 'var(--px)', maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h1
          className="font-anybody text-cream"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          Proyectos que ya<br />trabajan solos
        </h1>
        <p
          className="font-cabinet text-cream-dim mt-4"
          style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1rem)', maxWidth: '52ch', lineHeight: 1.75 }}
        >
          Cada proyecto elimina trabajo repetitivo y convierte procesos en sistemas automáticos.
        </p>
      </div>

      {/* Layout: filas izquierda + panel preview derecha */}
      <div className="flex items-start" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Columna izquierda: filas */}
        <div className="min-w-0 flex-1" style={{ paddingLeft: 'var(--px)' }}>
          {PROJECTS.map((project, i) => {
            const active = hovered === project.slug
            const accent = project.accentColor

            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="wl-row group block"
                onMouseEnter={() => setHovered(project.slug)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderTop: '1px solid var(--color-border)',
                  borderBottom: i === PROJECTS.length - 1 ? '1px solid var(--color-border)' : 'none',
                  position: 'relative',
                }}
              >
                {/* Barra de acento izquierda */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: accent,
                    transform: active ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 1,
                  }}
                />

                <div
                  className="flex items-center gap-4 py-8 sm:py-10 md:py-12 pr-5 sm:pr-6 md:pr-10"
                  style={{
                    paddingLeft: active ? 'clamp(0.75rem, 1.5vw, 1.75rem)' : '0.25rem',
                    transition: 'padding-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Número */}
                  <span
                    className="font-anybody hidden shrink-0 md:block"
                    style={{
                      fontSize: 'clamp(2rem, 3.2vw, 3.2rem)',
                      fontWeight: 100,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      width: '4rem',
                      textAlign: 'right',
                      color: active ? accent : 'rgba(245, 240, 232, 0.16)',
                      transition: 'color 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    {project.number}
                  </span>

                  {/* Contenido */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="font-anybody"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.8rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                        color: active ? '#F5F0E8' : '#C8C0B0',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {project.title}
                    </p>
                    <p
                      className="font-cabinet text-cream-dim mt-2"
                      style={{ fontSize: 'clamp(0.8rem, 0.9vw, 0.9375rem)', lineHeight: 1.55, maxWidth: '46ch' }}
                    >
                      {project.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-cabinet"
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.6rem',
                            backgroundColor: active ? accent + '18' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${active ? accent + '55' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 2,
                            color: active ? accent : '#A89F8C',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Flecha */}
                  <span
                    className="shrink-0 font-cabinet"
                    style={{
                      fontSize: '1.125rem',
                      color: active ? accent : 'rgba(245,240,232,0.18)',
                      transform: active ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'color 0.3s ease, transform 0.3s ease',
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Columna derecha: panel de preview (solo desktop) */}
        <div
          className="hidden lg:block"
          style={{
            width: 'clamp(320px, 42vw, 620px)',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {PROJECTS.map((project) => {
            const active = hovered === project.slug
            const preview = PREVIEWS[project.slug]

            return (
              <div
                key={project.slug}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  padding: 'clamp(5rem, 9vw, 7.5rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(18px)',
                  transition: active
                    ? 'opacity 0.42s cubic-bezier(0.4, 0, 0.2, 1), transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'opacity 0.18s ease, transform 0.18s ease',
                  pointerEvents: 'none',
                }}
              >
                {/* Label del proyecto */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span
                    className="font-anybody"
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: project.accentColor,
                      opacity: 0.9,
                    }}
                  >
                    {project.number} — {project.title}
                  </span>
                  {preview.liveUrl && (
                    <a
                      href={preview.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        pointerEvents: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.65rem',
                        fontFamily: 'inherit',
                        color: project.accentColor,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
                    >
                      Visitar ↗
                    </a>
                  )}
                </div>

                {/* Imagen principal */}
                <div
                  style={{
                    flex: '0 0 58%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: `1px solid ${project.accentColor}35`,
                    boxShadow: `0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.3)`,
                  }}
                >
                  <Image
                    src={preview.main}
                    alt={project.title}
                    width={700}
                    height={460}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                  />
                </div>

                {/* Dos imágenes secundarias */}
                <div style={{ flex: '1 1 0', display: 'flex', gap: 10, minHeight: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: `1px solid ${project.accentColor}22`,
                      boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
                    }}
                  >
                    <Image
                      src={preview.a}
                      alt={`${project.title} — detalle`}
                      width={350}
                      height={280}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: `1px solid ${project.accentColor}22`,
                      boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
                    }}
                  >
                    <Image
                      src={preview.b}
                      alt={`${project.title} — detalle`}
                      width={350}
                      height={280}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
      </div>{/* fin wrapper z-index */}
    </div>
  )
}

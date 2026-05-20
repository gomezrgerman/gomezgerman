'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlowArt, { FlowSection } from '@/components/ui/FlowArt'
import ProjectsMarquee from '@/components/ui/ProjectsMarquee'
import PwaCardDeck from '@/components/ui/PwaCardDeck'
import AutomationPipeline from '@/components/ui/AutomationPipeline'
import { ScannerCardStream } from '@/components/ui/scanner-card-stream'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    number: '01',
    slug: 'g2fit',
    title: 'G2Fit',
    subtitle: 'Ecosistema Digital',
    problem:
      '150+ clientes y 3 trainers gestionados con papel y WhatsApp. Sin control de bonos, sin pagos online, sin visibilidad real del negocio.',
    solution:
      'Web pública con chatbot IA, gestión de bonos en tiempo real, sistema de pagos y PWA instalable para que trainers y clientes accedan sin fricción.',
    result:
      'De caos operativo a sistema digital completo. Control total del negocio desde el móvil.',
    metric: '150+',
    metricLabel: 'clientes gestionados',
    tags: ['Next.js', 'Supabase', 'PWA', 'Claude API'],
    bg: '#0d1f12',
    accent: '#7DB892',
    img: '/img/g2fit-mobile.jpg',
    video: '/img/g2fit-demo-web.mp4',
    dualImages: ['/img/pwa-g2fit1.png', '/img/pwa-g2fit2.png'],
  },
  {
    number: '02',
    slug: 'nutricion-ia',
    title: 'NutriFlow',
    subtitle: 'Dietas a medida en minutos',
    problem:
      '2–3 horas por paciente creando planes nutricionales a mano. Tiempo que no se puede escalar ni rentabilizar.',
    solution:
      'La nutricionista recibe el plan ya listo en su email. Sin tocar herramientas nuevas, sin aprender nada técnico. Solo revisa, valida con un clic y la paciente lo recibe al instante.',
    result:
      'De 2–3 horas a menos de 5 minutos por cliente. Un sistema que ahora puede vender a otras nutricionistas.',
    metric: '−95%',
    metricLabel: 'tiempo por cliente',
    tags: ['n8n', 'Claude API', 'Supabase', 'Python'],
    bg: '#1a160e',
    accent: '#C4A97D',
    dualImages: ['/img/nutri_app.png', '/img/nutri_app2.png'],
    pipeline: true,
  },
  {
    number: '03',
    slug: 'd-bonita',
    title: 'D Bonita',
    subtitle: 'Web + Reservas + CRM',
    problem:
      'Agenda de papel y WhatsApp como único sistema. Sin historial de clientes, sin pagos online, dependencia total del teléfono.',
    solution:
      'Web con identidad propia, reservas online, pagos integrados y PWA que actúa como CRM con historial completo de cada clienta.',
    result:
      'Reservas 24/7 sin intervención manual. CRM completo en el bolsillo de la propietaria.',
    metric: '24/7',
    metricLabel: 'reservas automáticas',
    tags: ['Next.js', 'Calendly', 'Stripe', 'n8n'],
    bg: '#1f1212',
    accent: '#C47D8A',
    img: '/img/hero-dbonita.png',
    video: '/img/d-bonita-demo.mp4',
    dualImages: ['/img/dbonita-admin.png', '/img/dbonita-admin1.png'],
  },
]

function Label({ children, color }: { children: string; color: string }) {
  return (
    <p
      className="font-cabinet"
      style={{
        fontSize: 'clamp(0.7rem, 0.75vw, 0.75rem)',
        color,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: '0.6em',
        opacity: 0.55,
      }}
    >
      {children}
    </p>
  )
}

export default function Projects() {
  const headerRef    = useRef<HTMLDivElement>(null)
  const sistemasRef  = useRef<HTMLSpanElement>(null)
  const digitalesRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const sis    = sistemasRef.current
    const dig    = digitalesRef.current
    if (!header || !sis || !dig) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const vw = window.innerWidth / 100

    // Start words hidden and offset
    gsap.set(sis, { x: -vw * 20, opacity: 0 })
    gsap.set(dig, { x:  vw * 20, opacity: 0 })

    const st = ScrollTrigger.create({
      trigger: header,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        gsap.to(sis, { x: -vw * 6, opacity: 1, duration: 1.2, ease: 'power3.out' })
        gsap.to(dig, { x:  vw * 6, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.12 })
      },
    })

    return () => { st.kill() }
  }, [])

  return (
    <div>
      {/* ── Header sticky ── */}
      <div
        ref={headerRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 0,
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Scanner card stream — fondo */}
        <ScannerCardStream
          cardImages={[
            '/img/g2fit-mobile.jpg',
            '/img/nutri_app.png',
            '/img/dbonita-admin.png',
          ]}
          repeat={4}
          cardGap={50}
          initialSpeed={120}
          showControls={false}
          showSpeed={false}
        />

        {/* Overlay oscuro para legibilidad */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.7) 100%)',
          }}
        />

        {/* Texto superpuesto */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'clamp(2rem, 5vw, 4rem)',
            pointerEvents: 'none',
          }}
        >
          <h2
            className="font-anybody"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textAlign: 'center',
              marginBottom: '1.5rem',
              width: '100%',
              color: '#F5F0E8',
            }}
          >
            <span ref={sistemasRef} style={{ display: 'block' }}>
              Esto ya
            </span>
            <span ref={digitalesRef} style={{ display: 'block' }}>
              Funciona
            </span>
          </h2>

          <p
            className="font-cabinet"
            style={{
              fontSize: 'clamp(0.875rem, 1.15vw, 1rem)',
              lineHeight: 1.75,
              maxWidth: '44ch',
              textAlign: 'center',
              color: '#A89F8C',
            }}
          >
            Cada proyecto aquí eliminó trabajo manual real. No demos, no prototipos.
          </p>
        </div>
      </div>

      {/* ── Slides — z-index mayor para cubrir el header sticky ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <FlowArt>
          {PROJECTS.map((p) => (
            <FlowSection key={p.slug} style={{ backgroundColor: p.bg }}>

              {/* Top: número + CTA */}
              <div className="flex items-center justify-between">
                <span
                  className="font-anybody"
                  style={{
                    fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
                    color: 'rgba(168,159,140,0.4)',
                    letterSpacing: '0.18em',
                  }}
                >
                  {p.number}
                </span>
                <Link
                  href={`/work/${p.slug}`}
                  className="group font-cabinet flex items-center gap-1.5"
                  style={{
                    fontSize: 'clamp(0.8rem, 0.85vw, 0.9rem)',
                    color: p.accent,
                    letterSpacing: '0.06em',
                    opacity: 0.8,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                >
                  Ver proyecto
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Centro: título arriba, imágenes abajo a la derecha */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(2.5rem, 5vw, 5rem)' }}>

                {/* Título — ancho completo, sin competencia con imágenes */}
                <div>
                  <h3
                    className="font-anybody text-cream"
                    style={{
                      fontSize: 'clamp(3rem, 9vw, 14rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.88,
                      marginBottom: '0.25em',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="font-anybody"
                    style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1.8rem)',
                      fontWeight: 400,
                      color: p.accent,
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}
                  >
                    {p.subtitle}
                  </p>
                </div>

                {/* Imágenes — fila propia, ancho completo */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

                  {'pwas' in p && Array.isArray((p as any).pwas) && (
                    <PwaCardDeck
                      images={(p as any).pwas as string[]}
                      accent={p.accent}
                    />
                  )}

                  {'dualImages' in p && Array.isArray((p as any).dualImages) && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {(p as any).dualImages.map((src: string, i: number) => (
                        <div
                          key={src}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            height: 'clamp(160px, 28vw, 480px)',
                            borderRadius: 'clamp(10px, 1.2vw, 16px)',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            border: '2px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 20px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
                            transform: i === 0 ? 'rotate(-3deg)' : 'rotate(3deg)',
                            marginLeft: i === 0 ? 0 : 'clamp(-40px, -5vw, -80px)',
                            zIndex: i === 0 ? 1 : 0,
                          }}
                        >
                          <Image
                            src={src}
                            alt={p.title}
                            width={800}
                            height={520}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {p.img && !('imgDesktop' in p) && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        width: 'clamp(200px, 22vw, 420px)',
                        borderRadius: 'clamp(16px, 2vw, 28px)',
                        overflow: 'hidden',
                        backgroundColor: '#000',
                        border: '4px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)',
                        transform: 'rotate(2deg)',
                      }}
                    >
                      {'video' in p && p.video ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={p.img}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        >
                          <source src={p.video as string} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          src={p.img}
                          alt={p.title}
                          width={390}
                          height={844}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      )}
                    </div>
                  )}

                  {p.img && 'imgDesktop' in p && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        width: 'clamp(320px, 48vw, 780px)',
                        borderRadius: 'clamp(8px, 1vw, 12px)',
                        overflow: 'hidden',
                        backgroundColor: '#111',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.7), 0 8px 16px rgba(0,0,0,0.4)',
                        transform: 'rotate(-1.5deg)',
                      }}
                    >
                      <div style={{ backgroundColor: '#1c1c1e', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block' }} />
                        <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#febc2e', display: 'inline-block' }} />
                        <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#28c840', display: 'inline-block' }} />
                        <div style={{ flex: 1, marginLeft: 8, backgroundColor: '#2c2c2e', borderRadius: 4, height: 14 }} />
                      </div>
                      <Image
                        src={p.img}
                        alt={p.title}
                        width={1200}
                        height={675}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                  )}

                </div>
              </div>

              {/* Pipeline de automatización — solo NutriFlow */}
              {'pipeline' in p && (p as any).pipeline && (
                <AutomationPipeline accent={p.accent} />
              )}

              {/* Bottom: problema / solución / resultado */}
              <div>
                <div style={{ height: 1, backgroundColor: `${p.accent}22`, marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }} />

                <div
                  className="grid grid-cols-1 md:grid-cols-3"
                  style={{
                    gap: 'clamp(1.5rem, 4vw, 3.5rem)',
                    marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)',
                  }}
                >
                  <div>
                    <Label color={p.accent}>Problema</Label>
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 1rem)', lineHeight: 1.7 }}>
                      {p.problem}
                    </p>
                  </div>
                  <div>
                    <Label color={p.accent}>Solución</Label>
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 1rem)', lineHeight: 1.7 }}>
                      {p.solution}
                    </p>
                  </div>
                  <div>
                    <Label color={p.accent}>Resultado</Label>
                    <p
                      className="font-anybody"
                      style={{
                        fontSize: 'clamp(1.8rem, 3.5vw, 5rem)',
                        fontWeight: 800,
                        color: p.accent,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        marginBottom: '0.3em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {p.metric}
                    </p>
                    <p className="font-cabinet" style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.75rem)', color: p.accent, opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {p.metricLabel}
                    </p>
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 0.9rem)', lineHeight: 1.7, marginTop: '0.75em' }}>
                      {p.result}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-cabinet"
                      style={{
                        fontSize: 'clamp(0.65rem, 0.7vw, 0.75rem)',
                        color: p.accent,
                        border: `1px solid ${p.accent}35`,
                        borderRadius: 3,
                        padding: '4px 10px',
                        letterSpacing: '0.07em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </FlowSection>
          ))}
        </FlowArt>
      </div>

      {/* ── Marquee CTA ── */}
      <ProjectsMarquee />
    </div>
  )
}

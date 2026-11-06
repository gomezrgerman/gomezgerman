'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { barcodeBars, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { id: 'presencia', title: 'Presencia', desc: 'Web propia, rápida y bien posicionada para que te encuentren en Google.', items: ['De 1 a 5 páginas', 'SEO local', 'Formulario y WhatsApp'] },
  { id: 'sistema', title: 'Sistema', desc: 'Web con reservas, pagos y panel de gestión. Tu negocio en una app.', items: ['Reservas y pagos online', 'PWA instalable', 'Panel y CRM'] },
  { id: 'automatizacion', title: 'Automatización', desc: 'Flujos con n8n e IA que hacen el trabajo repetitivo por ti.', items: ['Pipelines con n8n', 'Claude API', 'Integraciones a medida'] },
] as const

/** Giro inicial de cada tique al caer. */
const FALL_ROTATIONS = [-14, 9, -7] as const

const CREAM = '#F5F0E8'
const FOREST = '#152B1C'

export default function ServiceTickets() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.service-ticket').forEach((ticket, i) => {
        gsap.fromTo(
          ticket,
          { y: -240 - i * 60, rotate: FALL_ROTATIONS[i], opacity: 0 },
          {
            y: 0,
            rotate: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.service-tickets', start: 'top 95%', end: 'top 40%', scrub: 1 },
          },
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-title"
      className="relative overflow-hidden"
      style={{ backgroundColor: FOREST, paddingInline: 'var(--px)', paddingBlock: 'var(--py)' }}
    >
      <div style={{ maxWidth: 'var(--max-w)', marginInline: 'auto' }}>
        <p className="font-cabinet text-green-light" style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Servicios
        </p>
        <h2
          id="services-title"
          className="font-anybody text-cream"
          style={{ fontSize: 'clamp(2.5rem, 5.6vw, 6rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.92, margin: '1rem 0 clamp(2.5rem, 5vw, 3.5rem)' }}
        >
          Tres formas de empezar.
        </h2>

        <div className="service-tickets grid grid-cols-1 gap-4 md:grid-cols-3" style={{ maxWidth: 1100 }}>
          {SERVICES.map((s) => (
            <article key={s.id} className="service-ticket" style={{ color: FOREST, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))', willChange: 'transform' }}>
              <div
                className="flex flex-col justify-between gap-5"
                style={{ backgroundColor: CREAM, borderRadius: '16px 16px 6px 6px', padding: 22, minHeight: 280 }}
              >
                <div>
                  <h3 className="font-anybody" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: '#4A7C59' }}>
                    {s.title}
                  </h3>
                  <p className="font-cabinet" style={{ marginTop: 12, lineHeight: 1.4 }}>{s.desc}</p>
                </div>
                <ul className="font-cabinet grid gap-1" style={{ fontSize: '0.9375rem', listStyle: 'none' }}>
                  {s.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span aria-hidden className="inline-block rounded-full" style={{ width: 6, height: 6, backgroundColor: '#4A7C59', transform: 'translateY(-2px)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ backgroundColor: CREAM, borderRadius: '6px 6px 16px 16px', padding: 22, marginTop: -1, borderTop: '2px dashed rgba(74,124,89,.6)' }}>
                <div className="font-cabinet flex justify-between" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: '#4A7C59' }}>
                  <span>Precio</span>
                  <span>Tras el diagnóstico</span>
                </div>
                <svg aria-hidden viewBox="0 0 300 42" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 42, marginTop: 12 }}>
                  {barcodeBars(s.id).map((b) => (
                    <rect key={b.x} x={b.x} y={0} width={b.w} height={42} fill={FOREST} />
                  ))}
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

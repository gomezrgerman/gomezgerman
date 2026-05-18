'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/lib/projects'
import ContactCTA from '@/components/sections/ContactCTA'
import SplitScrollShowcase, { type SplitPage } from '@/components/ui/SplitScrollShowcase'
import MeshCanvas from '@/components/ui/MeshCanvas'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  project: Project
  next: { slug: string; title: string } | null
}

const IMG_FRAME: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
}

function PwaPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      <div style={IMG_FRAME}>
        <Image src={src} alt={alt} width={1366} height={768} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </div>
  )
}

function TextPanel({ num, label, heading, body, accent }: { num: string; label: string; heading: string; body: string; accent: string }) {
  return (
    <div style={{ padding: 'clamp(1rem, 4vw, 4rem)', maxWidth: 440, width: '100%' }}>
      <p className="font-cabinet" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, opacity: 0.6, marginBottom: '1.25rem' }}>
        {num} — {label}
      </p>
      <h3 className="font-anybody" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', fontWeight: 800, color: '#DDD0BC', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.25rem' }}>
        {heading}
      </h3>
      <p className="font-cabinet" style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1rem)', color: '#A89F8C', lineHeight: 1.75 }}>
        {body}
      </p>
    </div>
  )
}

const SUMMARY_ITEMS = [
  { label: 'Contexto',     key: 'context'  as const },
  { label: 'El reto',      key: 'problem'  as const },
  { label: 'La solución',  key: 'solution' as const },
  { label: 'El resultado', key: 'result'   as const },
]

function buildG2FitSummary(accent: string): Record<string, { hook: string; support: ReactNode }> {
  const sup: React.CSSProperties = {
    fontSize: 'clamp(0.78rem, 0.88vw, 0.84rem)',
    lineHeight: 1.7,
    color: '#A89F8C',
  }
  const gap: React.CSSProperties = { ...sup, marginTop: '0.85em' }
  const rule = <div style={{ height: 1, backgroundColor: accent + '30', margin: '1rem 0' }} />

  return {
    context: {
      hook: 'Gimnasio boutique en Gata de Gorgos.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>250 m². Dos modalidades de entrenamiento.<br />Comunidad activa desde 2018.</p>
          <p style={gap}>Todo funcionaba por recomendación.<br />Sin presencia digital.</p>
        </div>
      ),
    },
    problem: {
      hook: 'Si no conocías a alguien dentro, no sabías que existían.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Sin web. Sin Google. Sin sistema interno.</p>
          <p style={gap}>Bonos en papel. Asistencias a mano.<br />Cero visibilidad. Pérdida de información.</p>
        </div>
      ),
    },
    solution: {
      hook: 'Una web que por fin explica lo que hacen.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Dos modalidades. Instalaciones. Testimonios.<br />Reserva directa por WhatsApp.</p>
          <p style={gap}>Y detrás: bonos, asistencias y renovaciones<br />controlados desde el móvil.</p>
          <p style={gap}>Sin apps. Sin hojas de cálculo. Sin caos.</p>
        </div>
      ),
    },
    result: {
      hook: 'Ahora quien busca "gimnasio Gata de Gorgos" los encuentra.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Los trainers saben quién viene, qué bono tiene<br />y cuántas sesiones quedan. Todo en tiempo real.</p>
          <p style={gap}>Menos gestión. Más entrenamiento.</p>
        </div>
      ),
    },
  }
}

function buildNutricionSummary(accent: string): Record<string, { hook: string; support: ReactNode }> {
  const sup: React.CSSProperties = { fontSize: 'clamp(0.78rem, 0.88vw, 0.84rem)', lineHeight: 1.7, color: '#A89F8C' }
  const gap: React.CSSProperties = { ...sup, marginTop: '0.85em' }
  const rule = <div style={{ height: 1, backgroundColor: accent + '30', margin: '1rem 0' }} />

  return {
    context: {
      hook: 'Nutricionista en Dénia con lista de espera. Todo hecho a mano.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Mensajes de ida y vuelta.<br />Coordinar el pago. Calcular macros.<br />Redactar el plan y enviarlo por email.</p>
          <p style={gap}>Todo, cada vez, con cada cliente.</p>
        </div>
      ),
    },
    problem: {
      hook: '2 a 3 horas por cliente antes de entregarle nada.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Con la demanda que tenía, era insostenible.</p>
          <p style={gap}>El tiempo limitaba el número de clientes.<br />El servicio no podía crecer.</p>
        </div>
      ),
    },
    solution: {
      hook: 'El cliente rellena un formulario. El sistema hace el resto.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Tally captura datos. Stripe gestiona el pago.<br />n8n orquesta el pipeline.<br />Claude API genera el plan de 7 días.<br />ReportLab crea el PDF con branding.</p>
          <p style={gap}>Lydia revisa y envía con un clic.</p>
        </div>
      ),
    },
    result: {
      hook: 'De 2–3 horas a minutos de revisión.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>El plan llega el mismo día, con macros calculados<br />y PDF listo para el cliente.</p>
          <p style={gap}>Más clientes. Mismas horas.<br />El sistema genera, ella valida.</p>
        </div>
      ),
    },
  }
}

function buildDBOnitaSummary(accent: string): Record<string, { hook: string; support: ReactNode }> {
  const sup: React.CSSProperties = { fontSize: 'clamp(0.78rem, 0.88vw, 0.84rem)', lineHeight: 1.7, color: '#A89F8C' }
  const gap: React.CSSProperties = { ...sup, marginTop: '0.85em' }
  const rule = <div style={{ height: 1, backgroundColor: accent + '30', margin: '1rem 0' }} />

  return {
    context: {
      hook: 'Centro de estética en Dénia. 500 clientas, 5 años, agenda de papel.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Especializado en uñas, pestañas y tratamientos faciales.</p>
          <p style={gap}>Todo gestionado por teléfono<br />y bloc de notas.</p>
        </div>
      ),
    },
    problem: {
      hook: 'Una llamada perdida era una cita perdida.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Sin disponibilidad visible online.<br />Sin confirmaciones automáticas.<br />Sin señal de reserva.</p>
          <p style={gap}>La agenda consumía horas de cada jornada.</p>
        </div>
      ),
    },
    solution: {
      hook: 'Reservas online con señal de pago. La agenda se gestiona sola.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>La clienta elige servicio, fecha y profesional.<br />Paga una señal para confirmar.<br />Confirmación y recordatorio automáticos.</p>
          <p style={gap}>PWA como CRM en el móvil de la propietaria.</p>
        </div>
      ),
    },
    result: {
      hook: 'Las clientas reservan solas, a cualquier hora, desde el móvil.',
      support: (
        <div className="font-cabinet">
          {rule}
          <p style={sup}>Las cancelaciones bajan porque hay señal en juego.</p>
          <p style={gap}>Menos llamadas perdidas. Menos no-shows.<br />Más tiempo real con clientas.</p>
        </div>
      ),
    },
  }
}

function getProjectSummary(slug: string, accent: string): Record<string, { hook: string; support: ReactNode }> | null {
  if (slug === 'g2fit')        return buildG2FitSummary(accent)
  if (slug === 'nutricion-ia') return buildNutricionSummary(accent)
  if (slug === 'd-bonita')     return buildDBOnitaSummary(accent)
  return null
}

function SummaryCell({
  label, hook, children, accent, borderRight, borderBottom,
}: {
  label: string; hook: string; children: ReactNode; accent: string
  borderRight: boolean; borderBottom: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)',
        borderRight: borderRight ? '1px solid var(--color-border)' : 'none',
        borderBottom: borderBottom ? '1px solid var(--color-border)' : 'none',
        backgroundColor: hovered ? accent + '09' : 'transparent',
        transition: 'background-color 0.25s ease',
      }}
    >
      <p
        className="font-cabinet"
        style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, opacity: 0.75, marginBottom: '0.75rem' }}
      >
        {label}
      </p>
      <h3
        className="font-anybody"
        style={{
          fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
          fontWeight: 800,
          color: '#DDD0BC',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        {hook}
      </h3>
      {children}
    </div>
  )
}

function buildG2FitPages(accent: string): SplitPage[] {
  return [
    {
      leftBg: '#0a1a0e',
      left: (
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <p className="font-cabinet" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, opacity: 0.6 }}>
            Web pública
          </p>
          <div style={{ width: 'clamp(140px, 14vw, 195px)', borderRadius: 26, overflow: 'hidden', backgroundColor: '#000', border: '5px solid #1c1c1e', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}>
            <video autoPlay muted loop playsInline poster="/img/g2fit-mobile.jpg" style={{ width: '100%', display: 'block' }}>
              <source src="/img/g2fit-demo-web.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      ),
      rightBg: '#152B1C',
      right: <TextPanel num="01" label="La web" heading="La web que los pone en el mapa" body="Web profesional con sus dos modalidades, galería, testimonios y reserva directa. Quien busca «gimnasio Gata de Gorgos» en Google, los encuentra." accent={accent} />,
    },
    {
      leftBg: '#152B1C',
      left: <TextPanel num="02" label="Asistencia" heading="Asistencia en tiempo real" body="El trainer sabe quién llega a cada clase, qué bono tiene activo y cuántas sesiones le quedan. Sin papel, sin preguntar." accent={accent} />,
      rightBg: '#0a1a0e',
      right: <PwaPanel src="/img/pwa-g2fit1.png" alt="Control de asistencia" />,
    },
    {
      leftBg: '#0a1a0e',
      left: <PwaPanel src="/img/pwa-g2fit2.png" alt="Gestión de bonos" />,
      rightBg: '#152B1C',
      right: <TextPanel num="03" label="Bonos" heading="Bonos y renovaciones sin papel" body="12 clientes pendientes de renovar, 32 con pocas sesiones — todo visible de un vistazo. El sistema avisa antes de que el cliente pregunte." accent={accent} />,
    },
    {
      leftBg: '#152B1C',
      left: <TextPanel num="04" label="Horario" heading="El horario en el bolsillo" body="Cada semana montada desde el móvil. Clientes por franja, exportable a PDF o WhatsApp para compartir al instante." accent={accent} />,
      rightBg: '#0d1f12',
      right: <PwaPanel src="/img/pwa-g2fit3.png" alt="Horario semanal" />,
    },
  ]
}

function buildNutricionPages(accent: string): SplitPage[] {
  return [
    {
      leftBg: '#1a160e',
      left: <PwaPanel src="/img/nutri_app.png" alt="NutriFlow app" />,
      rightBg: '#1f180e',
      right: <TextPanel num="01" label="El problema" heading="2-3 horas por paciente" body="Cada cliente nuevo costaba horas de trabajo: mensajes de ida y vuelta, cálculo de macros a mano, redacción del plan semanal y envío por email. Con la demanda creciendo, era insostenible." accent={accent} />,
    },
    {
      leftBg: '#1f180e',
      left: <TextPanel num="02" label="Pipeline" heading="Automatización de extremo a extremo" body="Tally captura los datos del cliente, Stripe gestiona el pago, n8n orquesta todo el flujo y Claude API genera el plan nutricional con macros calculados. Sin intervención manual." accent={accent} />,
      rightBg: '#1a160e',
      right: <PwaPanel src="/img/flujo_n8n2.png" alt="Pipeline n8n" />,
    },
    {
      leftBg: '#1a160e',
      left: <PwaPanel src="/img/pdf-nutri.png" alt="PDF nutricional" />,
      rightBg: '#1f180e',
      right: <TextPanel num="03" label="PDF" heading="PDF profesional con branding" body="Python con ReportLab genera un PDF de 7 días con los macros calculados y el branding de la nutricionista. El plan llega al cliente el mismo día, listo para usar." accent={accent} />,
    },
    {
      leftBg: '#1f180e',
      left: <TextPanel num="04" label="Resultado" heading="De horas a minutos" body="Lo que antes eran 2-3 horas se reduce a menos de 5 minutos de revisión. La nutricionista solo valida y envía. Más clientes sin trabajar más horas. El sistema genera, ella valida." accent={accent} />,
      rightBg: '#1a160e',
      right: <PwaPanel src="/img/nutri_app2.png" alt="NutriFlow resultado" />,
    },
  ]
}

function buildDBonitaPages(accent: string): SplitPage[] {
  return [
    {
      leftBg: '#1f1212',
      left: (
        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <p className="font-cabinet" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, opacity: 0.6 }}>
            Web pública
          </p>
          <div style={{ width: 'clamp(280px, 30vw, 420px)', borderRadius: 26, overflow: 'hidden', backgroundColor: '#000', border: '5px solid #1c1c1e', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}>
            <video autoPlay muted loop playsInline poster="/img/hero-dbonita.png" style={{ width: '100%', display: 'block' }}>
              <source src="/img/d-bonita-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      ),
      rightBg: '#2a1818',
      right: <TextPanel num="01" label="La web" heading="Presencia online que convierte" body="Web con identidad visual propia, presentación de servicios, galería y botón directo a reservas. Quien busca centro de estética en Dénia, las encuentra." accent={accent} />,
    },
    {
      leftBg: '#2a1818',
      left: <TextPanel num="02" label="Reservas" heading="Reservas online con señal de pago" body="La clienta elige servicio, fecha, hora y profesional. Paga una señal para confirmar la cita. Recibe confirmación al instante y recordatorio antes de la cita. Sin llamadas, sin WhatsApp." accent={accent} />,
      rightBg: '#1f1212',
      right: <PwaPanel src="/img/reservas-dbonita.png" alt="Reservas D Bonita" />,
    },
    {
      leftBg: '#1f1212',
      left: <PwaPanel src="/img/dbonita-admin.png" alt="Panel de gestión" />,
      rightBg: '#2a1818',
      right: <TextPanel num="03" label="Gestión" heading="Panel de control desde el móvil" body="La propietaria ve su agenda, historial de clientas y pagos desde el móvil como si fuera una app nativa. Confirmaciones y recordatorios automáticos con n8n." accent={accent} />,
    },
    {
      leftBg: '#2a1818',
      left: <TextPanel num="04" label="CRM" heading="CRM en el bolsillo" body="Historial completo de cada clienta, seguimiento post-visita automatizado y gestión de fidelización. Todo desde la PWA instalable. Menos no-shows, más tiempo real con clientas." accent={accent} />,
      rightBg: '#1f1212',
      right: <PwaPanel src="/img/dbonita-admin1.png" alt="CRM de clientas" />,
    },
  ]
}

function getShowcasePages(slug: string, accent: string): SplitPage[] | null {
  if (slug === 'g2fit') return buildG2FitPages(accent)
  if (slug === 'nutricion-ia') return buildNutricionPages(accent)
  if (slug === 'd-bonita') return buildDBonitaPages(accent)
  return null
}

const PROJECT_CTA: Record<string, { heading: string; subtitle: string }> = {
  'g2fit': {
    heading: '¿Tu negocio vive solo de boca en boca?',
    subtitle: 'Si cuando alguien te busca en Google no te encuentra, y por dentro sigues con papel y WhatsApp, esto es exactamente lo que construí aquí. Cuéntamelo.',
  },
  'nutricion-ia': {
    heading: '¿Cuántas horas te cuesta cada cliente nuevo?',
    subtitle: 'Si el proceso manual te limita más que la demanda, eso tiene solución directa. Cuéntame cómo funciona tu flujo ahora mismo.',
  },
  'd-bonita': {
    heading: '¿Cuántas citas perdiste esta semana?',
    subtitle: 'Las clientas que no encuentran disponibilidad online no esperan — reservan en otro sitio. Hay forma de evitarlo.',
  },
}

const DEFAULT_CTA = {
  heading: '¿Tienes un negocio similar? Hablemos.',
  subtitle: 'Cuéntame qué proceso te está costando tiempo o dinero — y lo analizamos juntos.',
}

export default function ProjectDetail({ project, next }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero: entra en mount sin scroll
      gsap.timeline({ delay: 0.15 })
        .from('.ph-number', { opacity: 0, duration: 1.2, ease: 'power2.out' })
        .from('.ph-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.9')
        .from('.ph-tagline', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
        .from('.ph-tag', { y: 12, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' }, '-=0.4')

      // Resto de secciones: ScrollTrigger
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
    <div ref={containerRef} style={{ backgroundColor: '#0a0e0b' }}>
      {/* ─── 1. HERO ─── */}
      <section
        className="relative flex h-[100svh] flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 sm:pb-16 md:px-12 md:pb-24"
        style={{ backgroundColor: '#0a0e0b' }}
      >
        <MeshCanvas variant="subtle" />

        {/* Número decorativo de fondo */}
        <span
          className="ph-number pointer-events-none absolute select-none font-anybody"
          style={{
            fontSize: '20vw',
            fontWeight: 100,
            color: 'rgba(245, 240, 232, 0.05)',
            lineHeight: 1,
            top: '8%',
            left: '-1%',
            zIndex: 1,
          }}
        >
          {project.number}
        </span>

        {/* Contenido principal */}
        <div className="relative z-10">
          <h1
            className="ph-title font-anybody text-cream"
            style={{
              fontSize: 'clamp(3rem, 9vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            {project.title}
          </h1>

          <p
            className="ph-tagline mt-4 font-cabinet text-cream-dim"
            style={{ fontSize: '1.1rem' }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Tags + link web */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="ph-tag font-cabinet text-green-light"
              style={{
                fontSize: '0.8125rem',
                padding: '0.3rem 0.75rem',
                backgroundColor: 'rgba(74, 124, 89, 0.15)',
                border: '1px solid var(--color-green)',
                borderRadius: '2px',
              }}
            >
              {tag}
            </span>
          ))}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ph-tag group font-cabinet"
              style={{
                fontSize: '0.8125rem',
                padding: '0.3rem 0.75rem',
                backgroundColor: `${project.accentColor}20`,
                border: `1px solid ${project.accentColor}`,
                borderRadius: '2px',
                color: project.accentColor,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${project.accentColor}35`)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${project.accentColor}20`)}
            >
              Visitar web
              <span style={{ display: 'inline-block', transition: 'transform 0.2s ease' }}
                onMouseEnter={e => ((e.currentTarget.style.transform = 'translate(1px,-1px)'))}
                onMouseLeave={e => ((e.currentTarget.style.transform = 'translate(0,0)'))}
              >↗</span>
            </a>
          )}
        </div>
      </section>

      {/* ─── 1b. RESUMEN RÁPIDO ─── */}
      <section style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {(() => {
            const summary = getProjectSummary(project.slug, project.accentColor)
            return SUMMARY_ITEMS.map(({ label, key }, i) => {
              const isRight  = i % 2 === 1
              const isBottom = i >= 2
              const hook    = summary ? summary[key].hook    : project[key].split('.')[0] + '.'
              const support = summary ? summary[key].support : (
                <p className="font-cabinet" style={{ fontSize: 'clamp(0.78rem, 0.88vw, 0.84rem)', lineHeight: 1.7, color: '#A89F8C', marginTop: '0.75rem' }}>
                  {project[key]}
                </p>
              )
              return (
                <SummaryCell
                  key={label}
                  label={label}
                  hook={hook}
                  accent={project.accentColor}
                  borderRight={!isRight}
                  borderBottom={!isBottom}
                >
                  {support}
                </SummaryCell>
              )
            })
          })()}
        </div>
      </section>

      {/* ─── 2. SHOWCASE ─── */}
      {(() => {
        const pages = getShowcasePages(project.slug, project.accentColor)
        return pages ? <SplitScrollShowcase pages={pages} accent={project.accentColor} /> : null
      })()}

      {/* ─── 3. MÉTRICAS ─── */}
      <section
        className="metrics-section px-5 py-16 sm:px-8 sm:py-24 md:px-12 md:py-32"
        style={{ backgroundColor: '#0a0e0b' }}
      >
        <p
          className="reveal-up font-cabinet text-cream-dim mb-16 md:mb-20"
          style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Resultados
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8" style={{ maxWidth: '56rem' }}>
          {project.metrics.map((m) => (
            <CountUpMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      </section>

      {/* ─── 5. NAVEGACIÓN ENTRE PROYECTOS ─── */}
      <section
        className="reveal-up px-5 py-14 sm:px-8 sm:py-20 md:px-12"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        {next ? (
          <Link href={`/work/${next.slug}`} className="group inline-flex flex-col gap-3 cursor-pointer">
            {/* Label + flecha */}
            <span
              className="flex items-center gap-2 font-cabinet text-cream-dim transition-colors duration-300 group-hover:text-green-light"
              style={{ fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Siguiente proyecto
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>

            {/* Título con slide */}
            <span
              className="font-anybody text-cream inline-block transition-all duration-300 group-hover:text-green-light group-hover:translate-x-4"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              {next.title}
            </span>

            {/* Línea que crece */}
            <span className="block h-px origin-left scale-x-0 bg-green-light transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        ) : (
          <Link href="/work" className="group inline-flex flex-col gap-3 cursor-pointer">
            <span
              className="flex items-center gap-2 font-cabinet text-cream-dim transition-colors duration-300 group-hover:text-green-light"
              style={{ fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Fin del portfolio
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
            <span
              className="font-anybody text-cream inline-block transition-all duration-300 group-hover:text-green-light group-hover:translate-x-4"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              Ver todos los proyectos
            </span>
            <span className="block h-px origin-left scale-x-0 bg-green-light transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        )}
      </section>

      {/* ─── 6. CTA CONTACTO ─── */}
      <ContactCTA {...(PROJECT_CTA[project.slug] ?? DEFAULT_CTA)} />
    </div>
  )
}

// ─── Sub-componentes locales ───

function CountUpMetric({ value, label }: { value: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState(value)
  const done = useRef(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const m = value.match(/^([^0-9]*)(-?\d+)(.*)$/)
    if (m) setText(`${m[1]}0${m[3]}`)

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || done.current) return
      done.current = true
      obs.disconnect()
      if (!m) return
      const prefix = m[1], target = parseInt(m[2], 10), suffix = m[3]
      const dur = 1500, t0 = performance.now()
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur)
        setText(`${prefix}${Math.round(ease(p) * target)}${suffix}`)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div
      ref={wrapRef}
      className="metric-item"
      style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'clamp(1.5rem, 2.5vw, 2rem)' }}
    >
      <span
        className="block font-anybody text-green-light"
        style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        {text}
      </span>
      <span className="mt-2 block font-cabinet text-cream-dim" style={{ fontSize: '0.9375rem' }}>
        {label}
      </span>
    </div>
  )
}



'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlowArt, { FlowSection } from '@/components/ui/FlowArt'
import ProjectsMarquee from '@/components/ui/ProjectsMarquee'
import AutomationPipeline from '@/components/ui/AutomationPipeline'
import ZoomShowcase from '@/components/sections/ZoomShowcase'
import SplitChars from '@/components/ui/SplitChars'
import CountUp from '@/components/ui/CountUp'
import { prefersReducedMotion } from '@/lib/motion'
import { PROJECTS } from '@/lib/projects'

gsap.registerPlugin(ScrollTrigger)

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
  const slidesRef = useRef<HTMLDivElement>(null)

  // Nombre de cada proyecto: las letras suben desde una máscara. Las capturas entran desde abajo.
  useEffect(() => {
    const slides = slidesRef.current
    if (!slides || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-flow-section]').forEach((section) => {
        gsap.from(section.querySelectorAll('.project-title-ch'), {
          yPercent: 105,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.035,
          clearProps: 'transform',
          scrollTrigger: { trigger: section, start: 'top 60%' },
        })
        const shots = section.querySelectorAll('.project-shot')
        if (shots.length > 0) {
          gsap.from(shots, {
            y: 90,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: shots[0], start: 'top 90%' },
          })
        }
      })
    }, slides)

    return () => ctx.revert()
  }, [])

  return (
    <div>
      <ZoomShowcase />

      {/* ── Slides ── */}
      <div ref={slidesRef} style={{ position: 'relative', zIndex: 1 }}>
        <FlowArt>
          {PROJECTS.map((p) => (
            <FlowSection key={p.slug} style={{ backgroundColor: p.placeholderColor }}>

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
                    color: p.accentColor,
                    letterSpacing: '0.06em',
                    opacity: 0.8,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                >
                  Ver proyecto
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>

              {/* Centro */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(2.5rem, 5vw, 5rem)' }}>

                {/* Título */}
                <div>
                  <h3
                    className="font-anybody text-cream"
                    style={{
                      fontSize: 'clamp(3rem, 9vw, 14rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.88,
                      marginBottom: '0.15em',
                      overflow: 'hidden',
                      paddingBlock: '0.06em 0.1em',
                    }}
                  >
                    <SplitChars text={p.title.split('—')[0].trim()} charClassName="project-title-ch" />
                  </h3>
                  {p.homeSubtitle && (
                    <p
                      className="font-anybody"
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1.8rem)',
                        fontWeight: 400,
                        color: p.accentColor,
                        letterSpacing: '-0.01em',
                        lineHeight: 1,
                      }}
                    >
                      {p.homeSubtitle}
                    </p>
                  )}
                </div>

                {/* Imágenes */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

                  {p.homeDualImages && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {p.homeDualImages.map((src, i) => (
                        <div
                          key={src}
                          className="project-shot"
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
                            alt={`${p.title} — ${i === 0 ? 'vista principal' : 'detalle'}`}
                            width={800}
                            height={520}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {p.homePosterImg && !p.homeDualImages && (
                    <div
                      className="project-shot"
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
                      {p.homeVideo ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={p.homePosterImg}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        >
                          <source src={p.homeVideo} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          src={p.homePosterImg}
                          alt={`${p.title}${p.homeSubtitle ? ` — ${p.homeSubtitle}` : ''}`}
                          width={390}
                          height={844}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Pipeline de automatización — solo NutriFlow */}
              {p.homeHasPipeline && (
                <AutomationPipeline accent={p.accentColor} />
              )}

              {/* Bottom: problema / solución / resultado */}
              <div>
                <div style={{ height: 1, backgroundColor: `${p.accentColor}22`, marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }} />

                <div
                  className="grid grid-cols-1 md:grid-cols-3"
                  style={{ gap: 'clamp(1.5rem, 4vw, 3.5rem)', marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                >
                  <div>
                    <Label color={p.accentColor}>Problema</Label>
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 1rem)', lineHeight: 1.7 }}>
                      {p.homeProblem ?? p.problem}
                    </p>
                  </div>
                  <div>
                    <Label color={p.accentColor}>Solución</Label>
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 1rem)', lineHeight: 1.7 }}>
                      {p.homeSolution ?? p.solution}
                    </p>
                  </div>
                  <div>
                    <Label color={p.accentColor}>Resultado</Label>
                    {p.homeMetric && (
                      <p
                        className="font-anybody"
                        style={{
                          fontSize: 'clamp(1.8rem, 3.5vw, 5rem)',
                          fontWeight: 800,
                          color: p.accentColor,
                          letterSpacing: '-0.03em',
                          lineHeight: 1,
                          marginBottom: '0.3em',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <CountUp value={p.homeMetric} />
                      </p>
                    )}
                    {p.homeMetricLabel && (
                      <p className="font-cabinet" style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.75rem)', color: p.accentColor, opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {p.homeMetricLabel}
                      </p>
                    )}
                    <p className="font-cabinet text-cream-dim" style={{ fontSize: 'clamp(0.75rem, 0.95vw, 0.9rem)', lineHeight: 1.7, marginTop: '0.75em' }}>
                      {p.homeResult ?? p.result}
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
                        color: p.accentColor,
                        border: `1px solid ${p.accentColor}35`,
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

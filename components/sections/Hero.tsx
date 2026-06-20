'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import HeroCardDeck from '@/components/ui/HeroCardDeck'
import HeroLogoReveal from '@/components/ui/HeroLogoReveal'
import ScrollStroke from '@/components/ui/ScrollStroke'
import { hexAlpha } from '@/lib/utils'

const SCALE_Y   = 2.2
const LINE_H    = 0.9
const CARD_W    = 590  // ancho fijo del HeroCardDeck
const CARD_H    = 535  // alto fijo del HeroCardDeck

const titleStyleDesktop = {
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: LINE_H,
  whiteSpace: 'nowrap' as const,
  zIndex: 1,
  opacity: 0,
}

const titleStyleMobile = {
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 0.92,
  display: 'block' as const,
  opacity: 0,
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)

  // Escala dinámica del CardDeck en mobile
  const [cardScale, setCardScale] = useState(0.62)
  useEffect(() => {
    const update = () => {
      const scale = Math.min(0.88, (window.innerWidth - 40) / CARD_W)
      setCardScale(Math.max(0.44, scale))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Desktop refs
  const line1Ref    = useRef<HTMLSpanElement>(null)
  const line2Ref    = useRef<HTMLSpanElement>(null)
  const masRef      = useRef<HTMLSpanElement>(null)
  const line3Ref    = useRef<HTMLSpanElement>(null)
  const line4Ref    = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  // Mobile refs
  const mLine1Ref = useRef<HTMLSpanElement>(null)
  const mLine2Ref = useRef<HTMLSpanElement>(null)
  const mLine3Ref = useRef<HTMLSpanElement>(null)
  const mLine4Ref = useRef<HTMLSpanElement>(null)
  const mSubRef   = useRef<HTMLDivElement>(null)

  // ── Canvas ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let rafId: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const obs = new ResizeObserver(resize)
    obs.observe(canvas)
    const orbs = [
      { cx: 0.2, cy: 0.3, r: 0.55, hex: '#7DB892', alpha: 0.10, phase: 0 },
      { cx: 0.8, cy: 0.7, r: 0.48, hex: '#DDD0BC', alpha: 0.06, phase: Math.PI },
      { cx: 0.55, cy: 0.55, r: 0.42, hex: '#7DB892', alpha: 0.07, phase: Math.PI * 1.5 },
    ]
    let t = 0
    const draw = () => {
      const W = canvas.width; const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      for (const o of orbs) {
        const x = (o.cx + Math.sin(t * 0.4 + o.phase) * 0.12) * W
        const y = (o.cy + Math.cos(t * 0.3 + o.phase) * 0.10) * H
        const r = o.r * Math.min(W, H)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, hexAlpha(o.hex, o.alpha))
        g.addColorStop(1, hexAlpha(o.hex, 0))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }
      t += 0.003
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafId); obs.disconnect() }
  }, [])

  // ── GSAP — entrada ─────────────────────────────────────────────────────
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const mobile = window.innerWidth < 768

      if (mobile) {
        const mEls = [
          mLine1Ref.current,
          mLine2Ref.current,
          mLine3Ref.current,
          mLine4Ref.current,
        ]
        const sub = mSubRef.current
        if (mEls.some((r) => !r) || !sub) return

        if (reducedMotion) {
          gsap.set([...mEls, sub], { opacity: 1, y: 0 })
          return
        }

        gsap.timeline({ delay: 0.1 })
          .fromTo(mEls[0], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
          .fromTo(mEls[1], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.55')
          .fromTo(mEls[2], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.75')
          .fromTo(mEls[3], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.75')
          .fromTo(sub,     { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        return
      }

      // Desktop animation
      const l1  = line1Ref.current
      const l2  = line2Ref.current
      const mas = masRef.current
      const l3  = line3Ref.current
      const l4  = line4Ref.current
      const sub = subtitleRef.current
      if (!l1 || !l2 || !mas || !l3 || !l4 || !sub) return

      if (reducedMotion) {
        gsap.set([l1, l2, mas, l3, l4], { opacity: 1, scaleY: SCALE_Y })
        gsap.set(sub, { opacity: 1, y: 0 })
        return
      }

      const tOrigin = '0 0'
      gsap.timeline({ delay: 0.1 })
        .fromTo(l1,  { opacity: 0, scaleY: SCALE_Y * 0.25, transformOrigin: tOrigin }, { opacity: 1, scaleY: SCALE_Y, duration: 1.1, ease: 'power3.out' })
        .fromTo(l2,  { opacity: 0, scaleY: SCALE_Y * 0.25, transformOrigin: tOrigin }, { opacity: 1, scaleY: SCALE_Y, duration: 1.0, ease: 'power3.out' }, '-=0.55')
        .fromTo(mas, { opacity: 0, scaleY: SCALE_Y * 0.25, transformOrigin: tOrigin }, { opacity: 1, scaleY: SCALE_Y, duration: 1.0, ease: 'power3.out' }, '-=0.85')
        .fromTo(l3,  { opacity: 0, scaleY: SCALE_Y * 0.25, transformOrigin: tOrigin }, { opacity: 1, scaleY: SCALE_Y, duration: 1.0, ease: 'power3.out' }, '-=0.85')
        .fromTo(l4,  { opacity: 0, scaleY: SCALE_Y * 0.25, transformOrigin: tOrigin }, { opacity: 1, scaleY: SCALE_Y, duration: 1.1, ease: 'power3.out' }, '-=0.85')
        .fromTo(sub, { opacity: 0, y: 16 },                                            { opacity: 1, y: 0,            duration: 0.8, ease: 'power2.out' }, '-=0.65')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#152B1C' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* ── MOBILE LAYOUT ─── < 768px ──────────────────────────────────── */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 pb-16 pt-24 text-center md:hidden">
        <span
          ref={mLine1Ref}
          className="select-none font-anybody text-cream"
          style={{ fontSize: 'clamp(2.5rem, 17vw, 6.5rem)', ...titleStyleMobile }}
        >
          DISEÑO
        </span>
        <span
          ref={mLine2Ref}
          className="select-none font-anybody text-cream"
          style={{ fontSize: 'clamp(2.25rem, 14vw, 5.5rem)', ...titleStyleMobile }}
        >
          SISTEMAS
        </span>

        {/* Baraja de cards — intercalada entre el texto, como en desktop */}
        <div
          style={{
            width: '100vw',
            marginLeft: 'calc(50% - 50vw)',
            marginTop: `${Math.round(cardScale * 8)}px`,
            marginBottom: `${Math.round(cardScale * -150)}px`,
            overflow: 'hidden',
            position: 'relative',
            height: `${Math.round(cardScale * (CARD_H + 40))}px`,
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: `${Math.round(cardScale * 48)}px`,
          }}>
            {/* La baraja reserva 48px de margen a la derecha (para que las cards de atrás asomen),
                lo que descentra la card frontal visualmente. translateX(24px) lo compensa antes de escalar. */}
            <div style={{ transform: `scale(${cardScale}) translateX(24px)`, transformOrigin: 'top center' }}>
              <HeroCardDeck />
            </div>
          </div>
        </div>

        <span
          ref={mLine3Ref}
          className="select-none font-anybody text-cream"
          style={{ fontSize: 'clamp(1.05rem, 8.5vw, 3.3rem)', ...titleStyleMobile, letterSpacing: '-0.01em' }}
        >
          PARA NEGOCIOS
        </span>
        <span
          ref={mLine4Ref}
          className="select-none font-anybody text-cream"
          style={{ fontSize: 'clamp(2.5rem, 17vw, 6.5rem)', ...titleStyleMobile }}
        >
          REALES
        </span>

        <div ref={mSubRef} className="mt-6 flex flex-col items-center gap-2 px-2" style={{ opacity: 0 }}>
          <p
            className="font-cabinet text-cream"
            style={{ fontSize: 'clamp(0.875rem, 3.8vw, 1rem)', maxWidth: '32ch', lineHeight: 1.75, letterSpacing: '0.01em' }}
          >
            Automatizaciones, IA y procesos diseñados para ahorrar tiempo
            y organizar negocios automáticamente.
          </p>
          <p
            className="font-cabinet text-cream-dim"
            style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}
          >
            Dénia, Alicante
          </p>
        </div>

        <div className="absolute bottom-6 right-6 z-20">
          <span className="animate-bounce font-cabinet text-cream-dim" style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>
            scroll ↓
          </span>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ─── >= 768px ────────────────────────────────── */}
      <div className="hidden md:block" style={{ height: 'calc(20vh + 150vw)', position: 'relative' }}>

        <ScrollStroke />

        {/* DISEÑO */}
        <span
          ref={line1Ref}
          className="absolute block select-none font-anybody text-cream"
          style={{ top: '4vw', left: 0, width: '100%', textAlign: 'center', fontSize: 'clamp(2rem, 17vw, 32rem)', ...titleStyleDesktop }}
        >
          DISEÑO
        </span>

        {/* SISTE */}
        <span
          ref={line2Ref}
          className="absolute left-0 block select-none font-anybody text-cream"
          style={{ top: 'calc(5vh + 37.7vw)', paddingLeft: '1.5vw', fontSize: 'clamp(2rem, 14vw, 28rem)', ...titleStyleDesktop }}
        >
          SISTE
        </span>

        {/* Baraja — ocupa desde el final de SISTE hasta el borde derecho */}
        <div
          className="absolute"
          style={{
            top: 'calc(5vh + 37.7vw)',
            left: '47vw',
            right: 0,
            height: 'calc(2vh + 28vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ transform: 'rotate(-6deg)' }}>
            <HeroCardDeck />
          </div>
        </div>

        {/* Logo Antigravity */}
        <div
          ref={logoWrapRef}
          className="absolute"
          style={{ top: 'calc(7vh + 67vw)', left: '8.5vw', zIndex: 0 }}
        >
          <HeroLogoReveal />
        </div>

        {/* -MAS */}
        <span
          ref={masRef}
          className="absolute block select-none font-anybody text-cream"
          style={{ top: 'calc(7vh + 65.4vw)', right: '1.5vw', fontSize: 'clamp(2rem, 14vw, 28rem)', ...titleStyleDesktop }}
        >
          -MAS
        </span>

        {/* PARA NEGOCIOS */}
        <span
          ref={line3Ref}
          className="absolute left-0 block select-none font-anybody text-cream"
          style={{ top: 'calc(9vh + 98vw)', paddingLeft: '1.5vw', fontSize: 'clamp(1rem, 9vw, 17rem)', ...titleStyleDesktop }}
        >
          PARA NEGOCIOS
        </span>

        {/* REALES */}
        <span
          ref={line4Ref}
          className="absolute block select-none font-anybody text-cream"
          style={{ top: 'calc(11vh + 115.8vw)', left: 0, width: '100%', textAlign: 'center', fontSize: 'clamp(2rem, 17vw, 32rem)', ...titleStyleDesktop }}
        >
          REALES
        </span>

        {/* Subtítulo — banda con fondo que corta REALES a la mitad */}
        <div
          ref={subtitleRef}
          className="absolute left-0 right-0 flex flex-col items-center px-10 text-center"
          style={{
            top: 'calc(11vh + 133vw - 60px)',
            backgroundColor: '#152B1C',
            paddingTop: '2.5vw',
            paddingBottom: '2.5vw',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          <p
            className="font-cabinet text-cream"
            style={{ fontSize: 'clamp(0.875rem, 1.3vw, 1.05rem)', maxWidth: '52ch', lineHeight: 1.75, letterSpacing: '0.01em' }}
          >
            Automatizaciones, IA y procesos diseñados para ahorrar tiempo
            y organizar negocios automáticamente.
          </p>
          <p
            className="mt-3 font-cabinet text-cream-dim"
            style={{ fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)', letterSpacing: '0.06em' }}
          >
            Dénia, Alicante
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute z-20" style={{ top: 'calc(100svh - 3rem)', right: '2rem' }}>
          <span className="animate-bounce font-cabinet text-cream-dim" style={{ fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
            scroll ↓
          </span>
        </div>
      </div>
    </section>
  )
}


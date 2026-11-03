'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/motion'
import { useDeferredEffect } from '@/lib/useDeferredEffect'

gsap.registerPlugin(ScrollTrigger)

/** Mosaico 3x3. La del centro es la que llena la pantalla al empezar. */
const TILES = [
  { src: '/img/esclitec-hero.png', alt: 'Web de Esclitec' },
  { src: '/img/nutri-dashboard.png', alt: 'Panel de NutriFlow' },
  { src: '/img/bensburger-hero.png', alt: "Web de Ben's Burger" },
  { src: '/img/dbonita-admin.png', alt: 'Panel de D Bonita' },
  { src: '/img/elefitness-hero.jpg', alt: 'Web de Elefitness' },
  { src: '/img/pwa-g2fit1.png', alt: 'PWA de G2Fit' },
  { src: '/img/bensburger-carta.png', alt: "Carta digital de Ben's Burger" },
  { src: '/img/nutri-dieta-editor.png', alt: 'Editor de dietas de NutriFlow' },
  { src: '/img/reservas-dbonita.png', alt: 'Reservas de D Bonita' },
] as const

export default function ZoomShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  useDeferredEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const firstTile = section.querySelector<HTMLElement>('.zoom-tile')
      const coverScale = () => {
        if (!firstTile) return 1
        return Math.max(window.innerWidth / firstTile.offsetWidth, window.innerHeight / firstTile.offsetHeight) * 1.02
      }

      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
      })
        .fromTo('.zoom-grid', { scale: coverScale }, { scale: 1, ease: 'power2.inOut', duration: 0.6 }, 0)
        .to('.zoom-tile', { opacity: 0.28, duration: 0.25 }, 0.55)
        .fromTo('.zoom-line-1', { xPercent: -40, opacity: 0 }, { xPercent: -8, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.62)
        .fromTo('.zoom-line-2', { xPercent: 40, opacity: 0 }, { xPercent: 8, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.66)
        .fromTo('.zoom-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.78)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} aria-labelledby="zoom-title" className="relative h-[240vh] md:h-[320vh]" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden">
        <div
          className="zoom-grid grid grid-cols-3"
          style={{ gap: '1.2vw', width: 'min(90vw, 130vh)', willChange: 'transform' }}
        >
          {TILES.map((tile) => (
            <figure
              key={tile.src}
              className="zoom-tile relative overflow-hidden"
              style={{ aspectRatio: '16 / 10', backgroundColor: '#111', border: '1px solid #1E1E1E' }}
            >
              <Image src={tile.src} alt={tile.alt} fill sizes="(max-width: 768px) 100vw, 60vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </figure>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <h2
            id="zoom-title"
            className="font-anybody w-full"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '1.5rem', color: '#F5F0E8' }}
          >
            <span className="zoom-line-1 block">Esto ya</span>
            <span className="zoom-line-2 block">Funciona</span>
          </h2>
          <p className="zoom-sub font-cabinet" style={{ fontSize: 'clamp(0.875rem, 1.15vw, 1rem)', lineHeight: 1.75, maxWidth: '44ch', color: '#A89F8C' }}>
            Cada proyecto aquí eliminó trabajo manual real. No demos, no prototipos.
          </p>
        </div>
      </div>
    </section>
  )
}

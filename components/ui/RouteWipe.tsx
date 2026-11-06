'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

/** Si la navegación tarda más que esto, la cortina se retira igualmente. */
const SAFETY_MS = 4000

/** Devuelve la ruta interna a la que lleva el clic, o null si no hay que interceptarlo. */
function internalTarget(e: MouseEvent, currentPath: string): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null
  const anchor = (e.target as Element | null)?.closest?.('a')
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return null
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname === currentPath) return null
  return url.pathname + url.search + url.hash
}

/**
 * Transición entre páginas: al pulsar un enlace interno, una cortina verde con "GG"
 * sube y tapa la pantalla; se navega; y cuando la nueva página ya está, la cortina sigue
 * subiendo y la descubre.
 */
export default function RouteWipe() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const covering = useRef(false)
  const safety = useRef<ReturnType<typeof setTimeout>>()

  // Interceptar clics en enlaces internos
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // La posición la controla solo GSAP (un transform en el estilo se sumaría al suyo)
    gsap.set(el, { yPercent: 100, y: 0 })

    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion() || covering.current) return
      const target = internalTarget(e, window.location.pathname)
      if (!target) return

      e.preventDefault()
      covering.current = true
      gsap.killTweensOf(el)
      gsap.timeline()
        .set(el, { yPercent: 100, visibility: 'visible' })
        .to(el, { yPercent: 0, duration: 0.6, ease: 'power4.inOut' })
        .fromTo(el.querySelector('span'), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.2')
        .add(() => {
          router.push(target)
          safety.current = setTimeout(() => uncover(el), SAFETY_MS)
        })
    }

    // Fase de captura: actúa antes que el onClick de next/link, que respeta defaultPrevented
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  // La nueva página ya está: retirar la cortina
  useEffect(() => {
    const el = ref.current
    if (!el || !covering.current) return
    uncover(el)
  }, [pathname])

  function uncover(el: HTMLDivElement) {
    clearTimeout(safety.current)
    gsap.to(el, {
      yPercent: -100,
      duration: 0.7,
      delay: 0.15,
      ease: 'power4.inOut',
      onComplete: () => {
        covering.current = false
        gsap.set(el, { visibility: 'hidden' })
      },
    })
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] grid place-items-center"
      style={{ backgroundColor: 'var(--color-green)', visibility: 'hidden', willChange: 'transform' }}
    >
      <span
        className="font-anybody"
        style={{ fontSize: 'clamp(4rem, 14vw, 12.5rem)', fontWeight: 900, fontStretch: '140%', lineHeight: 1, color: '#F5F0E8' }}
      >
        GG
      </span>
    </div>
  )
}

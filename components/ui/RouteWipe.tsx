'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

export default function RouteWipe() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    if (prevPathname.current === null || prevPathname.current === pathname) {
      prevPathname.current = pathname
      return
    }
    prevPathname.current = pathname

    const el = ref.current
    if (!el) return

    gsap.killTweensOf(el)

    gsap.timeline()
      .set(el, { transformOrigin: 'left center', scaleX: 0 })
      .to(el, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' })
      .set(el, { transformOrigin: 'right center' })
      .to(el, { scaleX: 0, duration: 0.3, delay: 0.1, ease: 'power2.inOut' })
  }, [pathname])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        backgroundColor: 'var(--color-green)',
        transform: 'scaleX(0)',
        transformOrigin: 'left center',
        willChange: 'transform',
      }}
    />
  )
}

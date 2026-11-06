'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

interface LazyVideoProps {
  src: string
  poster?: string
  style?: CSSProperties
  /** Texto alternativo para lectores de pantalla. */
  label?: string
}

/**
 * Vídeo en bucle que no descarga nada hasta acercarse a la pantalla
 * y se pausa al salir de ella. Mientras tanto se ve el póster.
 * Con "reducir movimiento" se queda en el póster.
 */
export default function LazyVideo({ src, poster, style, label }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src
          video.play().catch(() => null)
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      style={style}
    />
  )
}

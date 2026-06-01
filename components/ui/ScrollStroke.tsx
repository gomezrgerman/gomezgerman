'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from 'framer-motion'

export default function ScrollStroke() {
  const ref = useRef<HTMLDivElement>(null)

  // ── Scroll progress (0 → 1 mientras scrolleas el hero) ─────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scrollProgress = useTransform(scrollYProgress, [0, 0.88], [0, 1])

  // ── Entrada automática al cargar (dibuja los primeros ~20%) ─────────────
  const autoProgress = useMotionValue(0)
  useEffect(() => {
    const ctrl = animate(autoProgress, 0.20, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],   // expo-out suave
      delay: 0.5,
    })
    return ctrl.stop
  }, [autoProgress])

  // ── Combina ambos: toma el mayor de los dos en cada frame ───────────────
  const pathLength = useTransform(
    [autoProgress, scrollProgress],
    (values: number[]) => Math.max(values[0], values[1]),
  )

  // Opacidad ligada al pathLength — independiente de si es scroll o auto
  const opacity = useTransform(
    pathLength,
    [0, 0.02, 0.80, 0.96],
    [0, 0.60, 0.60, 0],
  )

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 hidden md:block"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 2376"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        fill="none"
        overflow="visible"
      >
        {/* Trazo principal */}
        <motion.path
          d="M 1340 75 C 1440 520, 40 780, 170 1080 C 300 1380, 1380 1580, 640 2300"
          stroke="#7DB892"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
        />

        {/* Punto de inicio — visible desde el arranque */}
        <motion.circle
          cx="1340"
          cy="75"
          r="3"
          fill="#7DB892"
          style={{ opacity }}
        />

        {/* Punto final — aparece solo al completarse */}
        <motion.circle
          cx="640"
          cy="2300"
          r="3"
          fill="#7DB892"
          style={{
            opacity: useTransform(pathLength, [0.94, 1], [0, 0.6]),
          }}
        />
      </svg>
    </div>
  )
}

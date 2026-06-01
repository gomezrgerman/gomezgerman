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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Scroll aporta hasta 0.85 repartido en el 90% del hero
  // → la línea acompaña el scroll durante casi todo el recorrido
  const scrollAddition = useTransform(
    scrollYProgress,
    [0, 0.90],
    [0, 0.85],
    { clamp: true },
  )

  // Entrada automática al cargar: dibuja el primer 15%
  const autoProgress = useMotionValue(0)
  useEffect(() => {
    const ctrl = animate(autoProgress, 0.15, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5,
    })
    return ctrl.stop
  }, [autoProgress])

  // pathLength = auto + scroll, tope 1
  const pathLength = useTransform(
    [autoProgress, scrollAddition],
    (v: number[]) => Math.min(1, v[0] + v[1]),
  )

  // Opacidad en dos fases separadas:
  //   Entrada  — ligada a pathLength (aparece al empezar a dibujar)
  //   Salida   — ligada a scrollYProgress (desaparece solo cerca del final del hero)
  const opacityIn  = useTransform(pathLength,       [0, 0.02],       [0, 1],    { clamp: true })
  const opacityOut = useTransform(scrollYProgress,  [0.88, 0.98],    [0.60, 0], { clamp: true })
  const opacity    = useTransform(
    [opacityIn, opacityOut],
    (v: number[]) => v[0] * v[1],
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
        <motion.path
          d="M 1340 75 C 1440 520, 40 780, 170 1080 C 300 1380, 1380 1580, 640 2300"
          stroke="#7DB892"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength, opacity }}
        />

        <motion.circle
          cx="1340" cy="75" r="3" fill="#7DB892"
          style={{ opacity }}
        />

        <motion.circle
          cx="640" cy="2300" r="3" fill="#7DB892"
          style={{ opacity: useTransform(pathLength, [0.94, 1], [0, 0.6]) }}
        />
      </svg>
    </div>
  )
}

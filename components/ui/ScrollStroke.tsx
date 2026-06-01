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

  // Scroll aporta hasta 0.85 del trazo, comprimido en el primer 46% del hero
  // → respuesta inmediata, linea acompaña el scroll sin trecho muerto
  const scrollAddition = useTransform(
    scrollYProgress,
    [0, 0.46],
    [0, 0.85],
    { clamp: true },
  )

  // Entrada automática: dibuja el primer 15% al cargar
  const autoProgress = useMotionValue(0)
  useEffect(() => {
    const ctrl = animate(autoProgress, 0.15, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5,
    })
    return ctrl.stop
  }, [autoProgress])

  // Aditivo: auto + scroll (tope en 1)
  // No hay trecho muerto — en cuanto scrolleas, la línea se mueve
  const pathLength = useTransform(
    [autoProgress, scrollAddition],
    (values: number[]) => Math.min(1, values[0] + values[1]),
  )

  const opacity = useTransform(
    pathLength,
    [0, 0.02, 0.82, 0.97],
    [0,  0.60,  0.60,  0],
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

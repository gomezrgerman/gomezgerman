'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollStroke() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Dibuja de 0 → 1 mientras scrolleas el hero
  const pathLength = useTransform(scrollYProgress, [0, 0.88], [0, 1])
  // Fade in suave al empezar, fade out al llegar a los proyectos
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.80, 0.96],
    [0,  0.55,  0.55,  0],
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

        {/* Punto de inicio */}
        <motion.circle
          cx="1340"
          cy="75"
          r="3"
          fill="#7DB892"
          style={{ opacity }}
        />

        {/* Punto final — apunta a la sección de proyectos */}
        <motion.circle
          cx="640"
          cy="2300"
          r="3"
          fill="#7DB892"
          style={{
            opacity: useTransform(pathLength, [0.95, 1], [0, 1]),
          }}
        />
      </svg>
    </div>
  )
}

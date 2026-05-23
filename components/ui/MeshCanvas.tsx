'use client'

import { useEffect, useRef } from 'react'
import { hexAlpha } from '@/lib/utils'

type Orb = { cx: number; cy: number; r: number; hex: string; alpha: number; phase: number }

const VARIANTS: Record<string, Orb[]> = {
  subtle: [
    { cx: 0.12, cy: 0.3,  r: 0.70, hex: '#4A7C59', alpha: 0.11, phase: 0 },
    { cx: 0.88, cy: 0.72, r: 0.60, hex: '#7DB892', alpha: 0.07, phase: Math.PI },
    { cx: 0.50, cy: 0.48, r: 0.50, hex: '#4A7C59', alpha: 0.08, phase: Math.PI * 0.7 },
  ],
  strong: [
    { cx: 0.12, cy: 0.25, r: 0.65, hex: '#4A7C59', alpha: 0.22, phase: 0 },
    { cx: 0.88, cy: 0.75, r: 0.55, hex: '#7DB892', alpha: 0.12, phase: Math.PI },
    { cx: 0.50, cy: 0.50, r: 0.48, hex: '#4A7C59', alpha: 0.14, phase: Math.PI * 0.7 },
  ],
}

export default function MeshCanvas({ variant = 'subtle' }: { variant?: 'subtle' | 'strong' }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let visible = true

    const orbs   = VARIANTS[variant]
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas)

    const visibilityObs = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting },
      { threshold: 0 },
    )
    visibilityObs.observe(canvas)

    let t = 0
    const draw = () => {
      rafId = requestAnimationFrame(draw)
      if (!visible) return
      const W = canvas.width; const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      for (const o of orbs) {
        const x = (o.cx + Math.sin(t * 0.35 + o.phase) * 0.1) * W
        const y = (o.cy + Math.cos(t * 0.28 + o.phase) * 0.08) * H
        const r = o.r * Math.min(W, H)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, hexAlpha(o.hex, o.alpha))
        g.addColorStop(1, hexAlpha(o.hex, 0))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }
      t += 0.003
    }
    draw()
    return () => {
      cancelAnimationFrame(rafId)
      resizeObs.disconnect()
      visibilityObs.disconnect()
    }
  }, [variant])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

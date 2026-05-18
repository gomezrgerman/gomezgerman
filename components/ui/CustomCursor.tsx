'use client'

import { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'link' | 'heading'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>('default')

  const [mounted, setMounted] = useState(false)
  const [touchDevice, setTouchDevice] = useState(false)
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isTouch = navigator.maxTouchPoints > 0
    setTouchDevice(isTouch)
    if (isTouch) return

    let mouseX = 0
    let mouseY = 0
    let circleX = 0
    let circleY = 0
    let rafId: number

    // Dot sigue al cursor inmediatamente
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
    }

    // Círculo sigue con lerp via RAF
    const onRaf = () => {
      circleX += (mouseX - circleX) * 0.12
      circleY += (mouseY - circleY) * 0.12
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(onRaf)
    }
    rafId = requestAnimationFrame(onRaf)

    // Detecta el tipo de elemento bajo el cursor
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      let next: CursorState = 'default'
      if (target.closest('a[href], button')) {
        next = 'link'
      } else if (target.closest('h1, h2')) {
        next = 'heading'
      }
      if (next !== stateRef.current) {
        stateRef.current = next
        setState(next)
      }
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  if (!mounted || touchDevice) return null

  // Dimensiones según estado — React gestiona estas propiedades,
  // el transform lo gestiona el RAF directamente sobre el DOM.
  const dotSize = state === 'heading' ? 10 : 6
  const dotOpacity = visible && state !== 'link' ? 1 : 0

  const circleSize = state === 'link' ? 60 : state === 'heading' ? 80 : 36
  const circleBorderOpacity = state === 'heading' ? 0.35 : 1
  const circleOpacity = visible ? (state === 'link' ? 0.5 : 1) : 0

  return (
    <>
      {/* Punto central */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: 'var(--color-green)',
          opacity: dotOpacity,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.15s ease',
          willChange: 'transform',
        }}
      />

      {/* Círculo exterior con lerp */}
      <div
        ref={circleRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          border: `1px solid rgba(74, 124, 89, ${circleBorderOpacity})`,
          opacity: circleOpacity,
          transition: 'width 0.35s cubic-bezier(0.23, 1, 0.32, 1), height 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease, border-color 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}

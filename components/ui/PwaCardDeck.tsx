'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface PwaCardDeckProps {
  images: string[]
  accent: string
}

// Position config for each slot: [front, middle, back]
const SLOTS = [
  { rotation: 0,  y: 0,  scale: 1,    opacity: 1,    zIndex: 3 },
  { rotation: 4,  y: 7,  scale: 0.97, opacity: 0.75, zIndex: 2 },
  { rotation: 8,  y: 14, scale: 0.94, opacity: 0.45, zIndex: 1 },
]

export default function PwaCardDeck({ images, accent }: PwaCardDeckProps) {
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const orderRef    = useRef([0, 1, 2]) // card indices at each slot position
  const busy        = useRef(false)
  const [active, setActive] = useState(0) // for dots indicator only

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.set(card, { ...SLOTS[i], x: 0 })
    })
  }, [])

  const advance = () => {
    if (busy.current) return
    busy.current = true

    const [fi, mi, bi] = orderRef.current
    const front = cardRefs.current[fi]
    const mid   = cardRefs.current[mi]
    const back  = cardRefs.current[bi]

    // 1. Fly the front card off to the right
    gsap.to(front, {
      x: '170%',
      rotation: 22,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        // 2. Teleport it invisibly to the back slot
        gsap.set(front, { x: 0, ...SLOTS[2], opacity: 0 })

        // 3. Promote the other two cards forward
        gsap.to(mid,  { ...SLOTS[0], duration: 0.32, ease: 'power2.out' })
        gsap.to(back, { ...SLOTS[1], duration: 0.32, ease: 'power2.out' })

        // 4. Fade the demoted card back in at its new back position
        gsap.to(front, { opacity: SLOTS[2].opacity, duration: 0.28, ease: 'power2.out' })

        // 5. Rotate the order array and update dot indicator
        orderRef.current = [mi, bi, fi]
        setActive(prev => (prev + 1) % images.length)

        setTimeout(() => { busy.current = false }, 340)
      },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
      {/* Card stack */}
      <div
        onClick={advance}
        style={{
          position: 'relative',
          width: 'clamp(220px, 26vw, 390px)',
          height: 'clamp(110px, 13.5vw, 195px)',
          cursor: 'pointer',
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            ref={el => { cardRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 7,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.7)',
              transformOrigin: 'bottom center',
            }}
          >
            <Image
              src={src}
              alt=""
              width={1366}
              height={768}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators + hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {images.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === active ? 14 : 5,
              height: 5,
              borderRadius: 99,
              backgroundColor: accent,
              opacity: i === active ? 1 : 0.3,
              transition: 'width 0.3s ease, opacity 0.3s ease',
              display: 'inline-block',
            }}
          />
        ))}
      </div>
    </div>
  )
}

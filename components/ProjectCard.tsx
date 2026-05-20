'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  number: string
  title: string
  description: string
  tags: string[]
  slug: string
  imageSrc: string
  placeholderColor?: string
  className?: string
}

export default function ProjectCard({
  number,
  title,
  description,
  tags,
  slug,
  imageSrc,
  placeholderColor = '#111a14',
  className = '',
}: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouch) return
    const rect = e.currentTarget.getBoundingClientRect()
    const xRatio = ((e.clientX - rect.left) / rect.width) * 2 - 1   // -1 → 1
    const yRatio = ((e.clientY - rect.top) / rect.height) * 2 - 1   // -1 → 1
    setTilt({ x: -yRatio * 6, y: xRatio * 6 })
  }

  const handleMouseEnter = () => {
    if (isTouch) return
    setActive(true)
  }

  const handleMouseLeave = () => {
    if (isTouch) return
    setActive(false)
    setTilt({ x: 0, y: 0 })
  }

  const transformStr = !isTouch && active
    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)`
    : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)'

  // Sin transición en transform durante mousemove (tracking directo);
  // transición suave al salir.
  const transition = active
    ? 'border-color 0.15s ease'
    : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)'

  return (
    <Link
      href={`/work/${slug}`}
      className={`block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        touchAction: 'manipulation',
        backgroundColor: 'var(--color-bg-card)',
        border: `1px solid ${active ? 'var(--color-green)' : 'var(--color-border)'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        transform: transformStr,
        transition,
        willChange: 'transform',
      }}
    >
      {/* Imagen */}
      <div className="relative aspect-[16/10]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: placeholderColor }} />
        )}

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0,0,0,${active ? 0.05 : 0.20})`,
            transition: 'background-color 0.35s ease',
          }}
        />
      </div>

      {/* Texto */}
      <div style={{ padding: '1.5rem' }}>
        <span
          className="font-anybody text-cream-dim"
          style={{ fontSize: '0.75rem', fontWeight: 500 }}
        >
          {number}
        </span>

        <h3
          className="font-anybody text-cream"
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h3>

        <p
          className="font-cabinet text-cream-dim line-clamp-2"
          style={{ fontSize: '0.875rem', marginTop: '0.625rem', lineHeight: 1.55 }}
        >
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-cabinet text-green-light"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.625rem',
                backgroundColor: 'rgba(74, 124, 89, 0.15)',
                border: '1px solid var(--color-green)',
                borderRadius: '2px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

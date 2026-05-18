'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Trabajo', href: '/work' },
  { label: 'Sobre mí', href: '/about' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Header() {
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  // Cierra el menú en cada cambio de ruta
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lógica de show/hide según dirección de scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const goingDown = currentY > lastScrollY.current

      if (goingDown && currentY > 80) {
        setVisible(false)
      } else if (!goingDown) {
        setVisible(true)
      }

      setScrolled(currentY > 50)
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloquea scroll nativo mientras el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'transform 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <Link
          href="/"
          className="group relative font-anybody font-bold text-cream"
          style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}
        >
          GG
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-green transition-all duration-300 ease-out group-hover:w-full" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Hamburger — solo mobile */}
        <button
          className="flex flex-col justify-center gap-[5px] p-2 md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="block h-px w-6 bg-cream" />
          <span className="block h-px w-6 bg-cream" />
          <span className="block h-px w-6 bg-cream" />
        </button>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative font-cabinet font-medium text-cream-dim transition-colors duration-200 hover:text-cream"
      style={{ fontSize: '0.9375rem' }}
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-green transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'var(--color-bg)',
        clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
        transition: 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Botón cerrar — posicionado donde estaba el hamburger */}
      <button
        onClick={onClose}
        aria-label="Cerrar menú"
        className="absolute right-8 top-[1.65rem] flex h-8 w-8 items-center justify-center"
      >
        <span className="absolute block h-px w-6 rotate-45 bg-cream" />
        <span className="absolute block h-px w-6 -rotate-45 bg-cream" />
      </button>

      <nav className="flex flex-col items-center gap-3">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-anybody font-bold text-cream transition-colors duration-200 hover:text-green"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 4.5rem)',
              letterSpacing: '-0.04em',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.4s ease ${0.15 + i * 0.08}s, transform 0.4s ease ${0.15 + i * 0.08}s`,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

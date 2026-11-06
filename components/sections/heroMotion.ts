import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Espera a que se retire la cortina "GG" antes de mostrar la primera palabra. */
export const INTRO_DELAY = 1.05

/** Desplazamiento horizontal de cada línea al hacer scroll (en % de su ancho). */
const DRIFTS = [-9, 7, -7, 6, -5] as const

const CHAR_FROM = { yPercent: 70, scaleY: 0.15, opacity: 0, transformOrigin: '50% 100%' }
const CHAR_TO = { yPercent: 0, scaleY: 1, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.045, clearProps: 'transform' }

/**
 * Escritorio. Las líneas mantienen su escala vertical de marca; lo que se anima son las letras:
 * la primera palabra al cargar, el resto al entrar en pantalla (E01).
 * Con el scroll, cada línea se desplaza en sentido contrario a la anterior;
 * DISEÑO se adelgaza y REALES gana peso (E02).
 */
export function animateHeroDesktop(lines: HTMLElement[], subtitle: HTMLElement, scaleY: number, delay: number) {
  gsap.set(lines, { opacity: 1, scaleY, transformOrigin: '0 0' })

  lines.forEach((line, i) => {
    const chars = line.querySelectorAll('.hero-ch')
    const reveal = i === 0
      ? { ...CHAR_TO, delay }
      : { ...CHAR_TO, scrollTrigger: { trigger: line, start: 'top 92%' } }
    gsap.fromTo(chars, CHAR_FROM, reveal)

    const drift = i === 0
      ? { trigger: line, start: 'top top', end: 'bottom top', scrub: 1.2 }
      : { trigger: line, start: 'top 80%', end: 'bottom -40%', scrub: 1.2 }
    gsap.to(line, { xPercent: DRIFTS[i] ?? 0, ease: 'none', scrollTrigger: drift })
  })

  const first = lines[0]
  const last = lines[lines.length - 1]
  gsap.to(first, { fontWeight: 250, ease: 'none', scrollTrigger: { trigger: first, start: 'top top', end: '+=60%', scrub: 1.2 } })
  gsap.fromTo(last, { fontWeight: 250 }, { fontWeight: 800, ease: 'none', scrollTrigger: { trigger: last, start: 'top bottom', end: 'top 30%', scrub: 1.2 } })

  gsap.fromTo(subtitle, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: subtitle, start: 'top 90%' } })
}

/** Móvil: todas las letras aparecen al cargar, en cascada. */
export function animateHeroMobile(lines: HTMLElement[], subtitle: HTMLElement, delay: number) {
  gsap.set(lines, { opacity: 1 })
  const chars = lines.flatMap((line) => Array.from(line.querySelectorAll('.hero-ch')))
  gsap.fromTo(chars, CHAR_FROM, { ...CHAR_TO, duration: 1, stagger: 0.03, delay })
  // Es el contenido principal (LCP) en móvil: visible desde el primer frame, solo se desplaza
  gsap.fromTo(subtitle, { opacity: 1, y: 16 }, { y: 0, duration: 0.8, ease: 'power2.out', delay })
}

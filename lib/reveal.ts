import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Entrada de un bloque de lectura.
 * - Si ya está en pantalla al cargar, solo sube: el texto es visible desde el primer
 *   momento (no retrasa el contenido principal ni el LCP).
 * - Si está más abajo, sube y aparece con fundido al llegar a él con el scroll.
 */
export function revealUp(el: HTMLElement, distance = 60) {
  const onScreen = el.getBoundingClientRect().top < window.innerHeight
  if (onScreen) {
    gsap.fromTo(el, { y: distance * 0.5 }, { y: 0, duration: 0.9, ease: 'power3.out' })
    return
  }
  gsap.fromTo(
    el,
    { y: distance, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } },
  )
}

/** Texto visible desde la carga que solo se desplaza a su sitio (sin ocultarlo). */
export function slideIn(targets: gsap.TweenTarget, vars: { y?: number; delay?: number; stagger?: number } = {}) {
  const { y = 20, delay = 0, stagger = 0 } = vars
  gsap.fromTo(targets, { y }, { y: 0, duration: 0.8, ease: 'power3.out', delay, stagger })
}

'use client'

import { useEffect, type DependencyList } from 'react'

type Cleanup = void | (() => void)

/**
 * Como useEffect, pero ejecuta `effect` cuando el navegador queda libre
 * (requestIdleCallback, con un tope de `timeout` ms).
 *
 * Para preparar animaciones de secciones que no se ven al cargar: cada una se
 * prepara en su propio turno en vez de todas a la vez durante la hidratación,
 * así la carga no tiene un único bloque largo de JavaScript (mejor TBT/INP en móvil).
 */
export function useDeferredEffect(effect: () => Cleanup, deps: DependencyList, timeout = 1000) {
  useEffect(() => {
    let cleanup: Cleanup
    let done = false

    const run = () => {
      if (done) return
      cleanup = effect()
    }

    const hasIdle = typeof window.requestIdleCallback === 'function'
    const id = hasIdle ? window.requestIdleCallback(run, { timeout }) : window.setTimeout(run, 1)

    return () => {
      done = true
      if (hasIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
      if (typeof cleanup === 'function') cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

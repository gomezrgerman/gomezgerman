export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export interface NumberParts {
  prefix: string
  value: number
  suffix: string
}

/** Separa "−95%" en { prefix: '−', value: 95, suffix: '%' }. Null si no hay número. */
export function splitNumber(raw: string): NumberParts | null {
  const match = raw.match(/\d+/)
  if (!match || match.index === undefined) return null
  return {
    prefix: raw.slice(0, match.index),
    value: parseInt(match[0], 10),
    suffix: raw.slice(match.index + match[0].length),
  }
}

export interface Bar {
  x: number
  w: number
}

/** Código de barras decorativo y determinista: misma semilla, mismas barras (SSR y cliente coinciden). */
export function barcodeBars(seed: string, width = 300): Bar[] {
  let s = Array.from(seed).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0)
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  const bars: Bar[] = []
  let x = 0
  while (x < width) {
    const w = 1 + Math.floor(rnd() * 4)
    if (rnd() > 0.35) bars.push({ x, w })
    x += w + 1 + Math.floor(rnd() * 3)
  }
  return bars
}

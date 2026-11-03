export function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function mix(a: string, b: string, t: number): string {
  const ch = (i: number) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t)
  return `#${[1, 3, 5].map((i) => ch(i).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Devuelve el color de acento aclarado hacia el crema de marca lo justo para
 * leerse sobre `bg` con contraste WCAG AA (4.5:1 en texto pequeño).
 */
export function readableColor(hex: string, bg = '#2a2a2a', min = 4.5): string {
  const CREAM = '#F5F0E8'
  for (let t = 0; t <= 1; t += 0.05) {
    const candidate = mix(hex, CREAM, t)
    if (contrastRatio(candidate, bg) >= min) return candidate
  }
  return CREAM
}

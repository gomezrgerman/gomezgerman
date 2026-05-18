'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  heading?: string
  subtitle?: string
}

export default function ContactCTA({
  heading = '¿Hablamos?',
  subtitle = 'Cuéntame qué proceso te está costando tiempo o dinero — y lo analizamos juntos.',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let rafId: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const obs = new ResizeObserver(resize)
    obs.observe(canvas)
    const orbs = [
      { cx: 0.12, cy: 0.25, r: 0.65, hex: '#4A7C59', alpha: 0.22, phase: 0 },
      { cx: 0.88, cy: 0.75, r: 0.55, hex: '#7DB892', alpha: 0.12, phase: Math.PI },
      { cx: 0.5,  cy: 0.5,  r: 0.48, hex: '#4A7C59', alpha: 0.14, phase: Math.PI * 0.7 },
    ]
    let t = 0
    const draw = () => {
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
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafId); obs.disconnect() }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-badge',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        },
      )
      gsap.fromTo(
        '.cta-heading',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          delay: 0.1,
        },
      )
      gsap.fromTo(
        '.cta-divider',
        { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          delay: 0.3,
        },
      )
      gsap.fromTo(
        '.cta-sub',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
          delay: 0.45,
        },
      )
      gsap.fromTo(
        '.cta-email',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          delay: 0.55,
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-5 pb-20 pt-24 sm:px-8 md:px-12 md:pb-32 md:pt-36"
      style={{ backgroundColor: '#0d2416' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* Logo Antigravity — decorativo de fondo */}
      <svg
        viewBox="200 130 580 280"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 'clamp(260px, 70vw, 900px)',
          height: 'auto',
          right: '-8%',
          bottom: '-10%',
          opacity: 0.045,
        }}
      >
        <path
          fill="#F5F0E8"
          d="M342.249084,359.715759
            C378.734680,372.422638 411.176422,365.472198 440.041718,341.024048
            C451.730682,331.123810 462.604095,320.263824 474.234375,310.290466
            C496.932526,290.825989 522.479797,276.997620 552.600098,273.294556
            C586.342041,269.146271 616.924744,277.984039 644.903198,296.775208
            C645.590027,297.236542 646.246948,297.742401 647.279968,298.489441
            C643.903870,303.478485 639.506714,306.820251 635.851257,310.809845
            C634.838684,311.914948 633.752319,312.952545 632.697144,314.018463
            C626.920410,319.853973 628.052612,319.652130 621.290161,315.449585
            C585.451660,293.177704 540.930054,295.929413 504.437225,322.211853
            C491.114136,331.807220 479.480011,343.238861 467.532990,354.351318
            C449.719421,370.920502 430.153717,384.705383 406.051300,390.131042
            C355.762573,401.451477 313.030945,387.495392 280.043488,348.177856
            C223.439804,280.712341 253.528687,177.347809 337.516174,149.833664
            C383.927399,134.629425 425.482330,144.845749 461.885712,177.089188
            C464.692688,179.575394 464.777832,181.361115 461.970032,183.892105
            C457.394104,188.016937 452.938446,192.302139 448.730286,196.798767
            C445.824249,199.904022 443.933197,199.305008 440.997406,196.621277
            C420.482666,177.867874 396.024719,169.327118 368.519775,171.617706
            C325.564056,175.194992 291.112823,205.931183 281.411072,247.960953
            C270.718567,294.282623 296.181000,341.292206 342.249084,359.715759 z"
        />
        <path
          fill="#F5F0E8"
          d="M714.657166,282.663940
            C718.248840,254.295853 710.974121,229.263718 693.557434,207.435303
            C677.606812,187.444397 656.533752,175.704819 631.131958,172.336823
            C598.740967,168.042099 571.131958,178.570816 547.420349,200.368912
            C529.035339,217.270203 511.714233,235.337769 491.619812,250.352341
            C464.623901,270.523743 435.374268,285.338074 401.346313,288.880920
            C394.578857,289.585541 387.721039,289.437714 380.903687,289.641968
            C377.728149,289.737122 376.571960,288.101562 376.652893,284.979065
            C376.803955,279.151093 376.941223,273.302216 376.611389,267.488861
            C376.350769,262.895813 377.935516,261.462982 382.561066,261.558197
            C404.457642,262.008759 425.218323,257.158295 444.637970,247.014465
            C463.358917,237.235565 479.997070,224.500595 495.782013,210.548019
            C511.129425,196.982162 524.513245,181.205566 541.271912,169.262817
            C580.259521,141.479004 622.710327,134.265427 666.948242,153.422913
            C711.541809,172.734421 736.972229,208.004593 742.330444,256.667267
            C746.745239,296.762390 733.605896,331.095917 704.744568,358.763153
            C675.186218,387.098541 639.486633,398.166931 598.733215,392.468201
            C569.850830,388.429535 546.035706,374.794769 525.530457,354.586731
            C522.776245,351.872467 523.069336,350.157410 525.732788,347.723755
            C530.034241,343.793335 534.228943,339.711792 538.130981,335.389130
            C541.310974,331.866425 543.550354,331.879364 546.973083,335.368439
            C562.861694,351.565369 582.022278,361.599396 604.597351,364.852112
            C627.985046,368.221954 649.649292,363.384888 669.522644,350.800201
            C694.544189,334.955475 709.566040,312.316040 714.657166,282.663940 z"
        />
      </svg>

      {/* Badge de disponibilidad */}
      <div className="cta-badge relative z-10 mb-10 inline-flex items-center gap-2.5">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: '#7DB892', boxShadow: '0 0 8px #7DB892aa' }}
        />
        <span
          className="font-cabinet text-cream-dim"
          style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Disponible para nuevos proyectos
        </span>
      </div>

      {/* Heading */}
      <h2
        className="cta-heading font-anybody text-cream relative z-10"
        style={{
          fontSize: 'clamp(3.5rem, 14vw, 14rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 0.88,
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        {heading}
      </h2>

      {/* Separador */}
      <div
        className="cta-divider relative z-10"
        style={{
          height: 1,
          backgroundColor: 'rgba(125, 184, 146, 0.3)',
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
        }}
      />

      {/* Grid: subtítulo + contacto */}
      <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16" style={{ alignItems: 'end' }}>

        {/* Subtítulo */}
        <p
          className="cta-sub font-cabinet text-cream-dim"
          style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', maxWidth: '44ch', lineHeight: 1.8 }}
        >
          {subtitle}
        </p>

        {/* Contacto */}
        <div className="cta-email flex flex-col gap-5">
          <a
            href="mailto:germangomez1193@gmail.com"
            className="group relative inline-block font-anybody"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.7rem)', fontWeight: 600, color: '#7DB892' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#DDD0BC' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#7DB892' }}
          >
            germangomez1193@gmail.com
            <span
              className="absolute -bottom-1 left-0 h-px transition-all duration-300 ease-out group-hover:w-full"
              style={{ width: 0, backgroundColor: '#DDD0BC' }}
            />
          </a>

          <div
            className="flex flex-col gap-2.5 font-cabinet"
            style={{ borderTop: '1px solid rgba(125, 184, 146, 0.18)', paddingTop: '1.25rem' }}
          >
            <div className="flex items-center gap-5">
              <span
                className="text-cream-dim"
                style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', minWidth: '5rem' }}
              >
                WhatsApp
              </span>
              <a
                href="https://wa.me/34680818196"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-cream transition-colors duration-200 hover:text-green-light"
                style={{ fontSize: '0.9375rem' }}
              >
                +34 680 818 196
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-green-light transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </div>
            <div className="flex items-center gap-5">
              <span
                className="text-cream-dim"
                style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', minWidth: '5rem' }}
              >
                Ubicación
              </span>
              <span className="text-cream" style={{ fontSize: '0.9375rem' }}>
                Dénia, España
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

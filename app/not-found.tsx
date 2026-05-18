import Link from 'next/link'
import PageTransition from '@/components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <main
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        {/* Número decorativo de fondo */}
        <span
          className="pointer-events-none absolute select-none font-anybody"
          style={{
            fontSize: 'clamp(12rem, 40vw, 36rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'rgba(245, 240, 232, 0.04)',
          }}
        >
          404
        </span>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1
            className="font-anybody text-cream"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Esta página no existe
          </h1>

          <p
            className="font-cabinet text-cream-dim"
            style={{ fontSize: '1.1rem', maxWidth: '40ch', lineHeight: 1.7 }}
          >
            Quizás fue movida, eliminada o nunca existió.
          </p>

          <Link
            href="/"
            className="group relative mt-2 font-cabinet font-medium text-green-light"
            style={{ fontSize: '1rem' }}
          >
            Volver al inicio
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-green-light transition-all duration-300 ease-out group-hover:w-full" />
          </Link>
        </div>
      </main>
    </PageTransition>
  )
}

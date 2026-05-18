import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import AboutContent from '@/components/sections/AboutContent'

export const metadata: Metadata = {
  title: 'Sobre mí · Germán Gómez',
  description:
    'Consultor de automatización digital y desarrollo web. Trabajo con PYMEs en la Marina Alta, Alicante y en remoto. Stack: Next.js, Supabase, Claude API, n8n, Python.',
  openGraph: {
    title: 'Sobre mí · Germán Gómez',
    description: 'Consultor de automatización digital y desarrollo web en la Marina Alta, Alicante.',
    locale: 'es_ES',
    type: 'profile',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function About() {
  return (
    <PageTransition>
      <AboutContent />
    </PageTransition>
  )
}

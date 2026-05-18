import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import MiniAbout from '@/components/sections/MiniAbout'
import ContactCTA from '@/components/sections/ContactCTA'

export const metadata: Metadata = {
  title: 'Germán Gómez — Automatización & Desarrollo Web · Marina Alta',
  description:
    'Consultor de automatización digital y desarrollo web en la Marina Alta, Alicante. Construyo sistemas que ahorran tiempo real: webs, pipelines de IA y PWAs para PYMEs.',
  openGraph: {
    title: 'Germán Gómez — Automatización & Desarrollo Web',
    description: 'Sistemas de automatización para negocios reales.',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Germán Gómez — Automatización & Desarrollo Web',
    description: 'Sistemas de automatización para negocios reales.',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return (
    <PageTransition>
      <main>
        <div style={{ backgroundColor: '#152B1C' }}>
          <Hero />
          <Projects />
        </div>
        <MiniAbout />
        <ContactCTA />
      </main>
    </PageTransition>
  )
}

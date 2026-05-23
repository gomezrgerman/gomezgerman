import type { Metadata } from 'next'
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Germán Gómez — Automatización & Desarrollo Web',
    description: 'Sistemas de automatización para negocios reales.',
  },
}

export default function Home() {
  return (
    <main>
      <div style={{ backgroundColor: '#152B1C' }}>
        <Hero />
        <Projects />
      </div>
      <MiniAbout />
      <ContactCTA />
    </main>
  )
}

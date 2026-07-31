import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import MiniAbout from '@/components/sections/MiniAbout'
import ContactCTA from '@/components/sections/ContactCTA'

export const metadata: Metadata = {
  title: 'Germán Gómez — Automatización & Desarrollo Web · Marina Alta',
  description:
    'Germán Gómez, consultor en automatización e IA. Diseño webs, pipelines y PWAs para PYMEs en la Marina Alta, Alicante. Ahorra tiempo desde el día uno.',
  openGraph: {
    title: 'Germán Gómez — Automatización & Desarrollo Web',
    description: 'Diseño webs, pipelines de IA y PWAs para PYMEs en la Marina Alta, Alicante.',
    locale: 'es_ES',
    type: 'website',
    siteName: 'Germán Gómez',
    url: 'https://german-gomez.es',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Germán Gómez — Automatización & Desarrollo Web',
    description: 'Diseño webs, pipelines de IA y PWAs para PYMEs en la Marina Alta, Alicante.',
  },
  alternates: {
    canonical: 'https://german-gomez.es',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Germán Gómez',
  jobTitle: 'Consultor de Automatización Digital',
  description: 'Consultor especializado en automatización con IA y desarrollo web para PYMEs en la Marina Alta, Alicante.',
  url: 'https://german-gomez.es',
  email: 'germangomez1193@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marina Alta',
    addressRegion: 'Alicante',
    addressCountry: 'ES',
  },
  knowsAbout: [
    'Automatización de procesos',
    'Inteligencia Artificial',
    'n8n',
    'Next.js',
    'Supabase',
    'PWA',
    'Desarrollo web',
  ],
  offers: {
    '@type': 'Offer',
    description: 'Consultoría y desarrollo de sistemas de automatización digital para PYMEs',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <div style={{ backgroundColor: '#152B1C' }}>
          <Hero />
          <Projects />
        </div>
        <MiniAbout />
        <ContactCTA />
      </main>
    </>
  )
}

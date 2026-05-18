import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import ContactPage from '@/components/sections/ContactPage'

export const metadata: Metadata = {
  title: 'Contacto · Germán Gómez',
  description:
    'Sin reuniones de 2 horas. Sin PowerPoints. Cuéntame qué proceso te está costando tiempo o dinero y lo analizamos juntos.',
}

export default function Contacto() {
  return (
    <PageTransition>
      <main>
        <ContactPage />
      </main>
    </PageTransition>
  )
}

import type { Metadata } from 'next'
import ContactPage from '@/components/sections/ContactPage'

export const metadata: Metadata = {
  title: 'Contacto · Germán Gómez',
  description:
    'Sin reuniones de 2 horas. Sin PowerPoints. Cuéntame qué proceso te está costando tiempo o dinero y lo analizamos juntos.',
  alternates: {
    canonical: '/contacto',
  },
}

export default function Contacto() {
  return (
    <main>
      <ContactPage />
    </main>
  )
}

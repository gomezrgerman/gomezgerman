import type { Metadata } from 'next'
import { Anybody } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'
import MotionProvider from '@/components/providers/MotionProvider'
import Header from '@/components/Header'
import CustomCursor from '@/components/ui/CustomCursor'

const anybody = Anybody({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-anybody',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://german-gomez.es',
  ),
  title: {
    default: 'Germán Gómez — Automatización & Desarrollo Web · Marina Alta',
    template: '%s · Germán Gómez',
  },
  description:
    'Sistemas de automatización para negocios reales. Consultor de automatización digital y desarrollo web en la Marina Alta, Alicante.',
  keywords: [
    'automatización',
    'desarrollo web',
    'n8n',
    'Next.js',
    'inteligencia artificial',
    'Marina Alta',
    'Alicante',
    'chatbot',
    'Supabase',
  ],
  authors: [{ name: 'Germán Gómez' }],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={anybody.variable}>
      <body>
        <CustomCursor />
        <Header />
        <Providers>
          <MotionProvider>
            {children}
          </MotionProvider>
        </Providers>
      </body>
    </html>
  )
}

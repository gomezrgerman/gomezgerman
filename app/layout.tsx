import type { Metadata, Viewport } from 'next'
import { Anybody } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'
import MotionProvider from '@/components/providers/MotionProvider'
import Header from '@/components/Header'
import CustomCursor from '@/components/ui/CustomCursor'
import { Analytics } from '@vercel/analytics/next'

const anybody = Anybody({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-anybody',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#152B1C',
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://german-gomez.es',
  ),
  title: {
    default: 'Germán Gómez — Automatización & Desarrollo Web · Marina Alta',
    template: '%s · Germán Gómez',
  },
  description:
    'Germán Gómez, consultor en automatización e IA. Diseño webs, pipelines y PWAs para PYMEs en la Marina Alta, Alicante. Ahorra tiempo desde el día uno.',
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
    'consultor digital',
    'PYME',
  ],
  authors: [{ name: 'Germán Gómez' }],
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
        <Analytics />
      </body>
    </html>
  )
}

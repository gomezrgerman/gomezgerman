import type { Metadata } from 'next'
import WorkList from '@/components/sections/WorkList'

export const metadata: Metadata = {
  title: 'Proyectos · Germán Gómez',
  description:
    'Tres proyectos reales: G2Fit, NutriFlow y D Bonita. Sistemas de automatización y desarrollo web para negocios que funcionan.',
  alternates: {
    canonical: '/work',
  },
}

export default function Work() {
  return (
    <main>
      <WorkList />
    </main>
  )
}

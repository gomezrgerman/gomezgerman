import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import WorkList from '@/components/sections/WorkList'

export const metadata: Metadata = {
  title: 'Proyectos · Germán Gómez',
  description:
    'Tres proyectos reales: G2Fit, NutriFlow y D Bonita. Sistemas de automatización y desarrollo web para negocios que funcionan.',
}

export default function Work() {
  return (
    <PageTransition>
      <main>
        <WorkList />
      </main>
    </PageTransition>
  )
}

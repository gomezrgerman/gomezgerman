import type { Metadata } from 'next'
import WorkList from '@/components/sections/WorkList'

export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Proyectos reales de automatización, gestión y desarrollo web para negocios que funcionan de verdad.',
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

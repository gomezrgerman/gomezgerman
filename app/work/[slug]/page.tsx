import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROJECTS, getProject, getNextProject } from '@/lib/projects'
import ProjectDetail from '@/components/sections/ProjectDetail'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical: `/work/${params.slug}`,
    },
  }
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug)
  if (!project) notFound()

  const next = getNextProject(params.slug)
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://german-gomez.es').replace(/\/$/, '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.shortDescription,
    creator: {
      '@type': 'Person',
      name: 'Germán Gómez',
      url: base,
    },
    keywords: project.tags.join(', '),
    url: `${base}/work/${project.slug}`,
    image: `${base}/work/${project.slug}/opengraph-image`,
    ...(project.liveUrl ? { mainEntityOfPage: project.liveUrl } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} next={next} />
    </>
  )
}

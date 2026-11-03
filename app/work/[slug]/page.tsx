import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROJECTS, getProject, getNextProject } from '@/lib/projects'
import ProjectDetail from '@/components/sections/ProjectDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical: `/work/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const next = getNextProject(slug)
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

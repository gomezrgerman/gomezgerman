import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROJECTS, getProject, getNextProject } from '@/lib/projects'
import PageTransition from '@/components/PageTransition'
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
    title: `${project.title} — Germán Gómez`,
    description: project.shortDescription,
  }
}

export default function ProjectPage({ params }: Props) {
  const project = getProject(params.slug)
  if (!project) notFound()

  const next = getNextProject(params.slug)

  return (
    <PageTransition>
      <ProjectDetail project={project} next={next} />
    </PageTransition>
  )
}

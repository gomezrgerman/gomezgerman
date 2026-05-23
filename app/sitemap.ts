import { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://german-gomez.es').replace(/\/$/, '')

  const projectRoutes = PROJECTS.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: base,                lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacto`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
    ...projectRoutes,
  ]
}

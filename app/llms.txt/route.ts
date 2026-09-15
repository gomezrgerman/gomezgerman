import { PROJECTS } from '@/lib/projects'

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://german-gomez.es').replace(/\/$/, '')

  const projectLines = PROJECTS.map(
    (p) => `- [${p.title}](${base}/work/${p.slug}): ${p.shortDescription}`,
  ).join('\n')

  const body = `# Germán Gómez

> Consultor de automatización digital y desarrollo web para PYMEs, con base en la Marina Alta (Alicante, España). Sistemas reales en producción — gestión, reservas, pagos, automatización con IA — no maquetas ni demos.

Stack habitual: Next.js, TypeScript, Supabase (Postgres + Auth + RLS), Stripe, n8n, Claude API, PWA.

Contacto: contacto@german-gomez.es · ${base}

## Proyectos

${projectLines}

## Páginas

- [Todos los proyectos](${base}/work)
- [Sobre mí](${base}/about)
- [Contacto](${base}/contacto)
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

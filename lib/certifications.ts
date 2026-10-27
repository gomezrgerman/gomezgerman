import { PROJECTS } from '@/lib/projects'

/**
 * Credenciales mostradas en /about.
 * Para añadir una nueva: añade un objeto al PRINCIPIO de CERTIFICATIONS (la más
 * reciente va primero). El orden del array es el orden en pantalla y el grid
 * se adapta solo.
 */
export interface Certification {
  readonly title: string
  readonly issuer: string
  readonly verifyUrl: string
  /** Temas que cubre, mostrados como tags */
  readonly skills: readonly string[]
  /** Slugs de lib/projects.ts donde se aplica lo aprendido */
  readonly appliedIn: readonly string[]
  /** Aplicación que no es un proyecto del portfolio (p. ej. "Este portfolio") */
  readonly appliedNote?: string
  /** Insignia oficial del emisor (WebP cuadrado en /public/img/certs/) */
  readonly badge?: { readonly src: string; readonly alt: string }
}

export const CERTIFICATIONS: readonly Certification[] = [
  {
    title: 'Especialista en TI: Python',
    issuer: 'Certiport · Pearson VUE',
    verifyUrl: 'https://www.credly.com/badges/e26b2531-7843-4afc-99e1-b598a31318e1/public_url',
    skills: ['Python', 'Estructuras de datos', 'Control de flujo', 'Manejo de errores'],
    appliedIn: ['nutricion-ia'],
    appliedNote: 'CRM de prospección propio',
    badge: { src: '/img/certs/it-specialist-python.webp', alt: 'Insignia IT Specialist Python de Pearson' },
  },
  {
    title: 'Building with the Claude API',
    issuer: 'Anthropic Academy',
    verifyUrl: 'https://academy.claude.com/verify/923d889d791d51a7e82ed04019ca1200',
    skills: ['Claude API', 'Tool use', 'RAG', 'Prompting'],
    appliedIn: ['g2fit', 'nutricion-ia'],
  },
  {
    title: 'Model Context Protocol: Advanced Topics',
    issuer: 'Anthropic Academy',
    verifyUrl: 'https://academy.claude.com/verify/53f9040f04f0f8ccbacb5fa0762efc07',
    skills: ['MCP', 'Servidores', 'Integraciones'],
    appliedIn: [],
    appliedNote: 'Mi flujo de desarrollo',
  },
  {
    title: 'Claude Code 101',
    issuer: 'Anthropic Academy',
    verifyUrl: 'https://academy.claude.com/verify/6ad154dc754b8f2d54a7282621822858',
    skills: ['Claude Code', 'Agentes', 'Desarrollo asistido'],
    appliedIn: ['g2fit', 'elefitness', 'nutricion-ia', 'd-bonita', 'bensburger', 'esclitec'],
    appliedNote: 'Este portfolio',
  },
]

export interface AppliedLink {
  readonly slug: string
  readonly name: string
}

/** Resuelve los slugs a nombres cortos de proyecto, ignorando los que no existan */
export function resolveAppliedProjects(slugs: readonly string[]): readonly AppliedLink[] {
  return slugs.flatMap((slug) => {
    const project = PROJECTS.find((p) => p.slug === slug)
    return project ? [{ slug, name: project.title.split(' — ')[0] }] : []
  })
}

export interface Metric {
  value: string
  label: string
}

export interface MediaItem {
  src: string
  type: 'image' | 'video'
  label: string
  frame?: 'phone' | 'browser'
}

export interface Project {
  number: string
  slug: string
  title: string
  tagline: string
  shortDescription: string
  context: string
  problem: string
  solution: string
  result: string
  tags: string[]
  metrics: Metric[]
  accentColor: string
  placeholderColor: string
  media?: MediaItem[]
  liveUrl?: string
}

export const PROJECTS: Project[] = [
  {
    number: '01',
    slug: 'g2fit',
    title: 'G2Fit — Ecosistema Digital',
    tagline: 'De papel y WhatsApp a sistema digital completo',
    shortDescription:
      'Sistema de gestión integral para un centro de entrenamiento personal. Web pública, control de bonos de sesiones, pagos y PWA para trainers y clientes.',
    context:
      'Gimnasio boutique en Gata de Gorgos (Alicante) con dos modalidades de entrenamiento, 250 m² de instalaciones y una comunidad fiel desde 2018. Sin presencia digital, captaban clientes únicamente por recomendaciones.',
    problem:
      'Quien no conocía a alguien que entrenara allí, no sabía que existían. Sin web y sin Google, no podían mostrar sus planes, sus instalaciones ni lo que les diferenciaba de las grandes cadenas. Y en el día a día: bonos en papel, asistencias anotadas a mano y sin visibilidad sobre qué clientes tenían sesiones pendientes.',
    solution:
      'Web profesional con presentación de las dos modalidades (Musculación y G2Engine), galería de instalaciones, testimonios y botón directo a WhatsApp. Panel de gestión con control de bonos, asistencias y renovaciones — todo accesible desde el móvil o la tablet mientras entrenan. PWA instalable para trainers y clientes sin necesidad de app store.',
    result:
      'Quien busca "gimnasio Gata de Gorgos" en Google los encuentra directamente. En el día a día, los trainers saben en todo momento qué clientes tienen bono activo, cuántas sesiones les quedan y cuándo renovar. Sin papel, sin hojas de cálculo.',
    tags: ['Next.js', 'Supabase', 'PWA', 'Claude API'],
    metrics: [
      { value: '150+', label: 'clientes activos' },
      { value: '24/7', label: 'captación pasiva' },
      { value: '0', label: 'papel en el proceso' },
    ],
    accentColor: '#4A7C59',
    placeholderColor: '#0d1f12',
    media: [
      { src: '/img/g2fit-demo-web.mp4',          type: 'video', label: 'Web pública',          frame: 'phone'    },
      { src: '/img/pwa-g2fit1.png',             type: 'image', label: 'Control de asistencia', frame: 'browser' },
      { src: '/img/pwa-g2fit2.png',             type: 'image', label: 'Gestión de bonos',      frame: 'browser' },
      { src: '/img/pwa-g2fit3.png',             type: 'image', label: 'Horario semanal',       frame: 'browser' },
    ],
    liveUrl: 'https://g2fit.es/',
  },
  {
    number: '02',
    slug: 'nutricion-ia',
    title: 'NutriFlow — Dietas a medida en minutos',
    tagline: 'De 3 horas por paciente a minutos de revisión',
    shortDescription:
      'Pipeline de automatización que captura datos del cliente, genera un plan nutricional personalizado con IA y lo entrega listo para revisión. De horas a minutos.',
    context:
      'Nutricionista en Dénia con lista de espera que gestionaba cada cliente de forma completamente manual: mensajes de ida y vuelta, coordinar el pago, calcular macros a mano, redactar el plan semanal y enviarlo por email.',
    problem:
      'Cada cliente nuevo le costaba entre 2 y 3 horas antes de entregarle nada. Con la demanda que tenía, era insostenible seguir gestionando así. El tiempo limitaba el número de clientes y hacía el servicio imposible de escalar.',
    solution:
      'El cliente rellena un formulario Tally con sus datos (objetivos, alergias, preferencias), completa el pago por Stripe y el sistema genera automáticamente un plan de 7 días con los macros calculados. n8n orquesta el pipeline, Claude API genera el plan estructurado, Python con ReportLab crea el PDF con branding profesional. Lydia recibe el plan, lo revisa y — si todo está correcto — lo envía al cliente con un clic.',
    result:
      'Lo que antes eran 2–3 horas se reduce a minutos de revisión. El plan llega al cliente el mismo día, con macros calculados y un PDF listo para usar. Puede atender más clientes sin trabajar más horas. El sistema genera, ella valida.',
    tags: ['n8n', 'Claude API', 'Supabase', 'Python', 'Tally', 'Stripe'],
    metrics: [
      { value: '-95%', label: 'tiempo por cliente' },
      { value: '<5 min', label: 'por plan nutricional' },
      { value: '∞', label: 'escalabilidad' },
    ],
    accentColor: '#A89F8C',
    placeholderColor: '#1a160e',
  },
  {
    number: '03',
    slug: 'd-bonita',
    title: 'D Bonita — Reservas + CRM',
    tagline: 'De WhatsApp y papel a reservas 24/7 con CRM en el bolsillo',
    shortDescription:
      'Sistema de reservas online con señal de pago integrada y panel de gestión para un centro de estética en Dénia. La agenda se gestiona sola.',
    context:
      'Centro de estética en Dénia especializado en uñas, pestañas y tratamientos faciales. Más de 500 clientas, 5 años de trayectoria y una agenda gestionada al 100% por teléfono y bloc de notas.',
    problem:
      'Una llamada perdida era una cita perdida. Sin disponibilidad visible online, sin confirmaciones automáticas, sin señal de reserva para frenar cancelaciones de última hora. La agenda consumía horas de cada jornada.',
    solution:
      'Reservas online paso a paso: la clienta elige servicio, fecha, hora y profesional, y paga una señal para confirmar. Recibe confirmación por email al instante y recordatorio antes de la cita. PWA instalable que actúa como CRM — la propietaria ve su agenda, historial de clientes y pagos desde el móvil. Automatizaciones n8n para recordatorios y seguimiento post-visita.',
    result:
      'Las clientas reservan solas desde el móvil a cualquier hora. Las cancelaciones de última hora caen porque hay señal en juego. La agenda se gestiona sola. Menos llamadas perdidas, menos no-shows, más tiempo real con clientas.',
    tags: ['Next.js', 'Calendly', 'Stripe', 'n8n', 'PWA', 'Supabase'],
    metrics: [
      { value: '24/7', label: 'reservas sin intervención' },
      { value: '~2h/día', label: 'recuperadas en coordinación' },
      { value: '500+', label: 'clientas activas' },
    ],
    accentColor: '#C17B5A',
    placeholderColor: '#1f1212',
    media: [
      { src: '/img/d-bonita-demo.mp4',           type: 'video', label: 'Web pública',          frame: 'phone'   },
      { src: '/img/dbonita-admin.png',    type: 'image', label: 'Panel de gestión',    frame: 'browser' },
      { src: '/img/dbonita-admin1.png',   type: 'image', label: 'CRM de clientas',     frame: 'browser' },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getNextProject(slug: string): { slug: string; title: string } | null {
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  if (index === -1 || index === PROJECTS.length - 1) return null
  const next = PROJECTS[index + 1]
  return { slug: next.slug, title: next.title }
}

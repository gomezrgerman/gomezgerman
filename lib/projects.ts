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
  // Home-section display fields
  homeSubtitle?: string
  homeVideo?: string
  homePosterImg?: string
  homeDualImages?: string[]
  homeHasPipeline?: boolean
  homeMetric?: string
  homeMetricLabel?: string
  homeProblem?: string
  homeSolution?: string
  homeResult?: string
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
    homeSubtitle: 'Ecosistema Digital',
    homeMetric: '150+',
    homeMetricLabel: 'clientes gestionados',
    homeVideo: '/img/g2fit-demo-web.mp4',
    homePosterImg: '/img/g2fit-mobile.jpg',
    homeDualImages: ['/img/pwa-g2fit1.png', '/img/pwa-g2fit2.png'],
    homeProblem: '150+ clientes y 3 trainers gestionados con papel y WhatsApp. Sin control de bonos, sin pagos online, sin visibilidad real del negocio.',
    homeSolution: 'Web pública con chatbot IA, gestión de bonos en tiempo real, sistema de pagos y PWA instalable para que trainers y clientes accedan sin fricción.',
    homeResult: 'De caos operativo a sistema digital completo. Control total del negocio desde el móvil.',
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
      'El cliente paga la primera consulta por Stripe y recibe un enlace de bienvenida para completar su perfil (objetivos, alergias, preferencias). Claude API genera en menos de un minuto un plan rotativo de 4 semanas (menú A/B) con macros calculados y lista de la compra agrupada por categorías, y el PDF se crea al instante con branding propio. Lydia revisa y ajusta desde su panel de administración — y cada edición que hace alimenta un sistema de aprendizaje que mejora los planes que Claude genera después. Recordatorios automáticos a los 14 y 28 días mantienen el seguimiento sin que ella tenga que acordarse.',
    result:
      'Lo que antes eran 2–3 horas se reduce a menos de un minuto de generación con IA. El plan llega con menú de 4 semanas, lista de la compra y una app instalable para el cliente. Cada edición que hace Lydia entrena al sistema — cuanto más lo usa, menos tiene que corregir.',
    tags: ['Next.js', 'Claude API', 'Supabase', 'Stripe', 'PWA'],
    metrics: [
      { value: '-95%', label: 'tiempo por cliente' },
      { value: '<1 min', label: 'generación del plan con IA' },
      { value: '∞', label: 'escalabilidad' },
    ],
    accentColor: '#A89F8C',
    placeholderColor: '#1a160e',
    homeSubtitle: 'Dietas a medida en minutos',
    homeMetric: '−95%',
    homeMetricLabel: 'tiempo por cliente',
    homeDualImages: ['/img/nutri_app.png', '/img/nutri_app2.png'],
    homeHasPipeline: true,
    homeProblem: '2–3 horas por paciente creando planes nutricionales a mano. Tiempo que no se puede escalar ni rentabilizar.',
    homeSolution: 'Claude genera un plan de 4 semanas con lista de la compra en menos de un minuto. Lydia revisa desde su panel, ajusta si hace falta, y cada cambio entrena al sistema para la próxima vez.',
    homeResult: 'De 2–3 horas a menos de un minuto de generación. Un sistema propio que aprende de cada edición, sin depender de herramientas externas.',
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
    homeSubtitle: 'Web + Reservas + CRM',
    homeMetric: '24/7',
    homeMetricLabel: 'reservas automáticas',
    homeVideo: '/img/d-bonita-demo.mp4',
    homePosterImg: '/img/hero-dbonita.png',
    homeDualImages: ['/img/dbonita-admin.png', '/img/dbonita-admin1.png'],
    homeProblem: 'Agenda de papel y WhatsApp como único sistema. Sin historial de clientes, sin pagos online, dependencia total del teléfono.',
    homeSolution: 'Web con identidad propia, reservas online, pagos integrados y PWA que actúa como CRM con historial completo de cada clienta.',
    homeResult: 'Reservas 24/7 sin intervención manual. CRM completo en el bolsillo de la propietaria.',
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

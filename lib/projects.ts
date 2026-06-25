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
      'El cliente paga la primera consulta por Stripe y recibe un enlace de bienvenida para completar su perfil (objetivos, alergias, preferencias). Claude API genera en menos de un minuto un plan semanal de 7 días sin repetir plato, pensado para seguir igual durante todo el mes (lunes-lunes, martes-martes), con macros calculados y PDF con branding propio al instante. Lydia revisa y ajusta desde su panel de administración — y cada edición que hace alimenta un sistema de aprendizaje que mejora los planes que Claude genera después. Recordatorios automáticos a los 14 y 28 días mantienen el seguimiento sin que ella tenga que acordarse.',
    result:
      'Lo que antes eran 2–3 horas se reduce a menos de un minuto de generación con IA. El plan llega con una semana completa de menús sin repetir, lista para seguir todo el mes, y una app instalable para el cliente. Cada edición que hace Lydia entrena al sistema — cuanto más lo usa, menos tiene que corregir.',
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
    homeDualImages: ['/img/nutri-dieta-editor.png', '/img/nutri-cliente-detalle.png'],
    homeHasPipeline: true,
    homeProblem: '2–3 horas por paciente creando planes nutricionales a mano. Tiempo que no se puede escalar ni rentabilizar.',
    homeSolution: 'Claude genera una semana completa de menús, sin repetir plato, en menos de un minuto. Lydia revisa desde su panel, ajusta si hace falta, y cada cambio entrena al sistema para la próxima vez.',
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
    homeDualImages: ['/img/hero-dbonita.png', '/img/dbonita-admin.png'],
    homeProblem: 'Agenda de papel y WhatsApp como único sistema. Sin historial de clientes, sin pagos online, dependencia total del teléfono.',
    homeSolution: 'Web con identidad propia, reservas online, pagos integrados y PWA que actúa como CRM con historial completo de cada clienta.',
    homeResult: 'Reservas 24/7 sin intervención manual. CRM completo en el bolsillo de la propietaria.',
    media: [
      { src: '/img/d-bonita-demo.mp4',           type: 'video', label: 'Web pública',          frame: 'phone'   },
      { src: '/img/dbonita-admin.png',    type: 'image', label: 'Panel de gestión',    frame: 'browser' },
      { src: '/img/dbonita-admin1.png',   type: 'image', label: 'CRM de clientas',     frame: 'browser' },
    ],
  },
  {
    number: '04',
    slug: 'bensburger',
    title: "Ben's Burger — Presencia Digital",
    tagline: 'De boca en boca a marca con web propia',
    shortDescription:
      'Web bilingüe con identidad de marca, storytelling y carta digital completa para una hamburguesería de Dénia. Por debajo, un sistema completo de pedidos y reservas ya construido, listo para activar.',
    context:
      'Hamburguesería de gama alta en Dénia (Alicante): smash burgers con carne de vaca rubia gallega maduración 45-75 días. Buena reputación local — 180 reseñas en Google, 4.3/5 — pero sin web propia, dependiendo solo de redes sociales y del boca a boca.',
    problem:
      'Sin web, no había forma de mostrar la carta, el producto o la marca sin abrir Instagram. En el local, las mesas no tenían más que al camarero para explicar cada hamburguesa, los alérgenos o el precio. Cero presencia para quien buscara el sitio en Google.',
    solution:
      'Web bilingüe (ES/EN) con identidad propia: hero con fotografía de producto a medida, storytelling de marca, reseñas de Google integradas y carta digital completa con foto, alérgenos y precio de cada plato. Códigos QR en las mesas llevan directo a la carta desde el móvil. Por debajo, se construyó un sistema completo de pedido online y reservas — personalización de punto de cocción, pantalla de cocina con PIN, checkout — que el cliente decidió no lanzar todavía: queda listo para activarse cuando lo necesite.',
    result:
      'La hamburguesería tiene presencia digital propia por primera vez: una carta que cualquiera consulta desde la mesa o desde casa, en su idioma, con SEO local trabajado. Y el salto a pedidos online o reservas, cuando llegue, no exige construir nada nuevo — ya está hecho.',
    tags: ['React', 'Vite', 'Framer Motion', 'SEO Local'],
    metrics: [
      { value: '22', label: 'platos en la carta · ES/EN' },
      { value: '180+', label: 'reseñas en Google · 4.3★' },
      { value: 'Listo', label: 'pedidos y reservas, listos para activar' },
    ],
    accentColor: '#D99A3B',
    placeholderColor: '#20130a',
    homeSubtitle: 'Web + Carta Digital',
    homeMetric: '180+',
    homeMetricLabel: 'reseñas en Google',
    homeDualImages: ['/img/bensburger-hero.png', '/img/bensburger-carta.png'],
    homeProblem: 'Sin web propia. Solo redes sociales y boca a boca para una marca con producto y reputación real (4.3★ en Google).',
    homeSolution: 'Web bilingüe con identidad propia, storytelling y carta digital con QR en mesa. Sistema de pedidos y reservas ya construido, listo para activar.',
    homeResult: 'Presencia digital propia por primera vez. El salto a pedidos online, cuando llegue, no exige construir nada nuevo.',
    liveUrl: 'https://bensburger.es/',
  },
  {
    number: '05',
    slug: 'esclitec',
    title: 'Esclitec — Web Corporativa',
    tagline: 'Una empresa técnica con 8 años de obras y clientes de peso, por fin con una web a su altura',
    shortDescription:
      'Web de presencia premium para empresa de climatización e instalaciones técnicas en la Marina Alta. Tipografía editorial, galería de proyectos reales y captación directa por formulario y WhatsApp.',
    context:
      'Esclitec Systems lleva 8 años instalando climatización, aerotermia, suelo radiante y biomasa en la Comunidad Valenciana. Entre sus clientes: Bioparc Valencia, Hotel Boutique La Casita Jávea, Restaurante Flo y Tiendas Tezenis. CAT-I certificada, SAT oficial ECOFOREST. Con más de 100 proyectos ejecutados, la empresa funcionaba únicamente por reputación y boca a boca.',
    problem:
      'Una empresa con ese nivel de trabajo y esos clientes no tenía web. Los presupuestos llegaban solo por teléfono, no había forma de mostrar proyectos reales ni diferenciar la oferta técnica frente a la competencia local. Sin presencia digital, el crecimiento dependía exclusivamente del boca a boca.',
    solution:
      'Web corporativa de nivel premium con tipografía editorial Fraunces (serif de pantalla gigante), scroll cinematográfico para los 7 servicios con foto en movimiento, galería de obras reales con antes/después de aerotermia, sección de clientes con logos y formulario de captación que llega directamente a su email vía Resend. WhatsApp flotante para contacto inmediato. SEO local trabajado con sitemap y datos estructurados.',
    result:
      'Esclitec tiene por primera vez una presencia online que refleja su nivel real. La web posiciona en búsquedas locales de climatización en la Marina Alta y convierte visitas en presupuestos directamente.',
    tags: ['Next.js', 'Framer Motion', 'Resend', 'SEO Local'],
    metrics: [
      { value: '+100', label: 'proyectos instalados · 8 años' },
      { value: '7', label: 'servicios con scroll editorial' },
      { value: 'CAT-I', label: 'instaladora certificada RITE' },
    ],
    accentColor: '#C9A227',
    placeholderColor: '#051f3a',
    homeSubtitle: 'Web Corporativa + SEO Local',
    homeMetric: '+100',
    homeMetricLabel: 'proyectos · 8 años',
    homeDualImages: ['/img/esclitec-hero.png', '/img/esclitec-servicios.png'],
    homeProblem: 'Empresa técnica con 8 años de proyectos reales y clientes de nivel (Bioparc Valencia, Tezenis) sin presencia digital.',
    homeSolution: 'Web editorial con tipografía gigante, scroll cinematográfico de 7 servicios, galería de obras reales y captación por formulario y WhatsApp.',
    homeResult: 'Posicionamiento local en Google y una presencia que por fin refleja el nivel real de la empresa.',
    liveUrl: 'https://www.esclitec.com',
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

# CLAUDE.md — Portfolio Personal: Germán Gómez

## Contexto del proyecto

Portfolio personal de **Germán Gómez**, consultor de automatización digital y desarrollo web con base en la **Marina Alta, Alicante (España)**. El portfolio tiene como objetivo principal captar clientes directos (PYMEs locales y nacionales) y posicionar a Germán como un profesional de referencia en **automatización con IA + desarrollo web moderno**.

El tono es: **serio pero no aburrido. Técnico pero humano. Diferencial sin ser pretencioso.**

---

## Referencia visual principal

**https://flayks.com** — replicar la energía general:
- Tipografía enorme que ocupa el viewport
- Animaciones scroll-driven (variable font weight cambia con el scroll)
- Grid de proyectos con hover 3D
- Transiciones de página cinematográficas
- Fondo oscuro con detalles de color contenidos

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + CSS custom properties |
| Animaciones | GSAP + ScrollTrigger, Framer Motion (AnimatePresence) |
| Scroll suave | Lenis (@studio-freight/lenis) |
| Tipografías | Anybody (Google Fonts, variable) + Cabinet Grotesk (Fontshare) |
| Deploy | Vercel |
| Imágenes | next/image con optimización automática |

### Dependencias a instalar
```bash
npm install gsap @studio-freight/lenis framer-motion
npm install @types/gsap
```

### Fuentes — configuración en layout.tsx
```tsx
// Anybody desde Google Fonts (variable font, axes: wdth, wght)
// Cabinet Grotesk desde Fontshare (self-hosted en /public/fonts/)
// Cargar ambas en next/font o como @font-face en globals.css
```

---

## Paleta de colores

```css
:root {
  --color-bg:        #0a0a0a;   /* Negro casi puro — fondo principal */
  --color-bg-card:   #111111;   /* Negro ligeramente más claro — cards */
  --color-cream:     #F5F0E8;   /* Crema cálido — texto principal, titulares */
  --color-cream-dim: #A89F8C;   /* Crema apagado — texto secundario */
  --color-green:     #4A7C59;   /* Verde salvia oscuro — acento principal */
  --color-green-light: #7DB892; /* Verde suave — hover states, highlights */
  --color-border:    #1E1E1E;   /* Borde sutil entre secciones */
}
```

**Regla de uso de color:**
- Fondo: siempre `--color-bg`
- Texto y titulares grandes: `--color-cream`
- Texto secundario / labels: `--color-cream-dim`
- Acento (botones, líneas decorativas, highlights de cursor): `--color-green` y `--color-green-light`
- El verde se usa con **criterio** — no inundar la pantalla. Aparece en: hover states, la línea del cursor personalizado, separadores seleccionados, etiquetas de tecnología.

---

## Tipografía

### Anybody (display / hero)
- Uso: titulares Hero, nombres de proyectos, secciones grandes
- Característica clave: es una **variable font** con eje `wdth` (width) y `wght` (weight)
- Efecto principal: al hacer scroll, `font-weight` va de **100 a 900** y `font-stretch` de **75% a 125%** usando GSAP ScrollTrigger
- Tamaños: clamp(4rem, 15vw, 18rem) en hero — QUE OCUPE LA PANTALLA

### Cabinet Grotesk (body / UI)
- Uso: descripciones de proyectos, labels, navegación, CTAs, metadata
- Pesos: 400 (body), 500 (UI labels), 700 (énfasis)
- Tamaños: 0.875rem–1.125rem para body; 1.25rem–1.5rem para subtítulos

### Reglas tipográficas
- El hero debe intimidar. La tipografía ocupa el 80%+ del viewport.
- El texto NUNCA se centra en secciones de proyectos (siempre alineado a la izquierda o justificado).
- Letter-spacing negativo en títulos grandes: -0.02em a -0.04em
- Usar `font-feature-settings: "ss01", "cv01"` si Cabinet Grotesk lo permite

---

## Estructura de páginas

```
/                    → Home (Hero + Projects grid preview + mini About + Contact CTA)
/work                → Todos los proyectos (grid completo)
/work/[slug]         → Proyecto individual
/about               → Sobre mí
```

### Navegación
- Header minimalista fijo: "GG" como logo (Anybody bold) a la izquierda + links a la derecha
- En mobile: menú hamburger con overlay animado
- El header se vuelve invisible con scroll hacia abajo y reaparece con scroll hacia arriba

---

## Secciones — Home

### 1. Hero
- Fondo: `--color-bg` con un mesh gradient muy sutil en verde/crema (opacidad 5-8%) generado en canvas
- Texto centrado verticalmente:
  ```
  GERMÁN
  GÓMEZ
  ```
  En Anybody, weight 200 en load → anima a weight 700 en 1.2s con ease out
- Subtítulo debajo en Cabinet Grotesk: `"Sistemas de automatización para negocios reales"`  
  Aparece con fade-in delay 0.8s
- Scroll indicator: pequeña flecha o texto "scroll" con bounce animation
- Al hacer scroll: el peso de la tipografía varia con ScrollTrigger (100→900 y vuelta)

### 2. Proyectos (preview — 3 cards)
- Título de sección: `"Trabajo"` en Anybody grande, alineado a la izquierda
- Grid de 3 columnas en desktop, 1 en mobile
- Cada card:
  - Fondo: `--color-bg-card` con borde `--color-border`
  - Número del proyecto (01, 02, 03) en Anybody, crema dim, top-left
  - Screenshot/mockup del proyecto (imagen con `object-fit: cover`)
  - Nombre del proyecto en Anybody weight 600
  - Tags de tecnología en Cabinet Grotesk pequeño, color verde
  - **Hover**: la card rota 4-6 grados en perspectiva 3D, sube 8px, el borde cambia a verde
  - Click → navega a `/work/[slug]` con transición de página

### 3. Mini About
- Dos columnas: texto a la izquierda, foto opcional a la derecha (o elemento decorativo)
- Texto: quién es Germán, qué hace, dónde está (Marina Alta, Alicante)
- CTA: "Saber más" → /about

### 4. Contact CTA (footer de página)
- Sección fullwidth con fondo `--color-green` oscuro
- Texto grande: `"¿Hablamos?"`
- Email y links de contacto
- Sin footer tradicional — esto ES el footer

---

## Proyectos a incluir

### Proyecto 1 — G2Fit
- **Slug:** `/work/g2fit`
- **Nombre:** `G2Fit — Ecosistema Digital`
- **Descripción corta:** Sistema de gestión integral para un centro de entrenamiento personal. Web pública, control de bonos de sesiones, pagos y PWA para trainers y clientes.
- **Stack tags:** Next.js, Supabase, PWA, Claude API
- **Descripción larga para página de proyecto:**  
  Centro de entrenamiento personal con 150+ clientes activos y 3 trainers. El sistema anterior era papel y WhatsApp. Construimos: (1) web pública con chatbot IA integrado, (2) sistema de gestión de bonos de 8 sesiones con control de asistencia en tiempo real, (3) sistema de pagos, (4) PWA instalable en móvil para que trainers y clientes accedan sin fricción. De caos operativo a sistema digital completo.
- **Métricas / impacto:** 150+ clientes gestionados, 3 trainers, control en tiempo real
- **Color acento de proyecto:** verde (el propio de la marca G2Fit)

### Proyecto 2 — Sistema Nutrición IA
- **Slug:** `/work/nutricion-ia`
- **Nombre:** `NutriFlow — Dietas a medida en minutos`
- **Descripción corta:** Pipeline de automatización que captura datos del cliente, genera un plan nutricional personalizado con IA y lo entrega listo para revisión por la nutricionista. De horas a minutos.
- **Stack tags:** n8n, Claude API, Supabase, Python, PDF generation, Tally, Stripe
- **Descripción larga:**  
  Una nutricionista tardaba 2-3 horas por paciente en crear planes dietéticos personalizados. Automatizamos el flujo completo: formulario Tally captura preferencias, intolerancias y objetivos → n8n orquesta el pipeline → Claude API genera el plan nutricional estructurado → Python/ReportLab crea el PDF con branding → se entrega automáticamente por email. La nutricionista solo revisa y valida. De horas a menos de 5 minutos por cliente.
- **Métricas / impacto:** -95% tiempo por cliente, producto vendible a otras nutricionistas
- **Color acento de proyecto:** crema / neutro

### Proyecto 3 — Salón de Belleza (D Bonita)
- **Slug:** `/work/d-bonita`
- **Nombre:** `D Bonita — Web + Reservas + CRM`
- **Descripción corta:** Web completa para salón de uñas y belleza con sistema de reservas online, pagos integrados y PWA que funciona como CRM de clientes para la propietaria.
- **Stack tags:** Next.js, Calendly, Stripe, n8n, PWA, Supabase
- **Descripción larga:**  
  Salón de belleza gestionado desde WhatsApp y agenda de papel. Construimos: (1) web con identidad visual propia y presentación de servicios, (2) sistema de reservas online con Calendly integrado, (3) pagos desde la propia web, (4) PWA instalable que actúa como CRM — la propietaria ve su agenda, historial de clientes y pagos desde el móvil como si fuera una app nativa. Automatizaciones n8n para recordatorios de cita y seguimiento post-visita.
- **Métricas / impacto:** reservas 24/7 sin intervención manual, CRM en el bolsillo
- **Color acento de proyecto:** terracota / rosa suave (identidad D Bonita)

---

## Cursor personalizado

Implementar cursor personalizado en desktop:
- Círculo pequeño (8px) en `--color-green` que sigue al cursor con `lerp` (suavizado)
- En hover sobre links/cards: el círculo crece a 40px y se vuelve semitransparente
- En texto grande: el cursor se convierte en un crosshair fino
- Ocultar el cursor nativo del sistema (`cursor: none` en el body)

---

## Animaciones — especificaciones GSAP

### Scroll animations globales
```javascript
// Cada sección entra con:
gsap.fromTo(element, 
  { y: 60, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", 
    scrollTrigger: { trigger: element, start: "top 85%" } }
)
```

### Variable font en Hero (el efecto principal)
```javascript
gsap.to(".hero-title", {
  fontWeight: 900,
  fontStretch: "125%",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1.5
  }
})
```

### Stagger en grid de proyectos
```javascript
gsap.fromTo(".project-card", 
  { y: 80, opacity: 0 },
  { y: 0, opacity: 1, stagger: 0.15, duration: 0.8,
    scrollTrigger: { trigger: ".projects-grid", start: "top 75%" } }
)
```

### Transiciones de página (Framer Motion)
```tsx
// En layout.tsx con AnimatePresence
// Cada página: fade + translateY(20px → 0) en entrada
// Salida: fade + translateY(0 → -20px)
// Duración: 0.4s ease-in-out
```

---

## Lenis (scroll suave) — setup global

```tsx
// En app/layout.tsx o en un Provider component
import Lenis from '@studio-freight/lenis'

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  })
  
  // Conectar con GSAP ticker
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
  
  return () => { lenis.destroy() }
}, [])
```

---

## Página de proyecto individual (/work/[slug])

Estructura:
1. **Hero del proyecto** — nombre enorme en Anybody, fullscreen, con el número del proyecto
2. **Descripción del reto** — qué problema existía antes
3. **La solución** — qué se construyó, con capturas/vídeos
4. **Stack usado** — pills/badges con cada tecnología
5. **Resultado / impacto** — métricas concretas en tipografía grande
6. **Siguiente proyecto** — navegación al siguiente trabajo (flecha + nombre)
7. **CTA** — "¿Tienes un proyecto similar? Hablemos"

---

## Información personal (para About y Hero)

- **Nombre:** Germán Gómez
- **Ubicación:** Marina Alta, Alicante, España
- **Tagline:** "Sistemas de automatización para negocios reales"
- **Especialidades:** n8n, Claude API, Next.js, Supabase, automatización de procesos, RAG, chatbots, PWAs
- **Perfil:** Consultor técnico freelance. Trabajo con PYMEs locales y negocios en sectores como fitness, salud, belleza, hostelería y retail. Construyo sistemas que ahorran tiempo real y generan valor inmediato.
- **Email:** [tu email aquí]
- **LinkedIn:** [tu LinkedIn aquí]

---

## Lo que NO hacer

- ❌ Sin fondo blanco en ninguna sección (excepto elementos puntuales)
- ❌ Sin sombras excesivas tipo "card con shadow enorme" — el contraste lo da el color, no la sombra
- ❌ Sin gradientes de colores vivos (solo gradientes muy sutiles, casi imperceptibles, en el fondo)
- ❌ Sin animaciones de loading tipo spinner — si hay loading, usar skeleton screens
- ❌ Sin layouts centrados para texto de proyecto — siempre alineado a la izquierda
- ❌ Sin Inter, Roboto ni fuentes genéricas — solo Anybody y Cabinet Grotesk
- ❌ Sin emojis en la UI

---

## Orden de desarrollo recomendado

1. `globals.css` — CSS variables, fuentes, reset, cursor personalizado
2. `app/layout.tsx` — Lenis setup, AnimatePresence wrapper, Header component
3. `components/Header.tsx` — logo GG + nav + comportamiento scroll
4. `app/page.tsx` — Hero section completa con variable font animation
5. `components/sections/Projects.tsx` — grid 3 cards con hover 3D
6. `components/ProjectCard.tsx` — card reutilizable
7. `app/work/page.tsx` — página de todos los proyectos
8. `app/work/[slug]/page.tsx` — template de proyecto individual
9. `app/about/page.tsx` — página about
10. `components/sections/ContactCTA.tsx` — sección footer-contacto
11. Cursor personalizado — `components/ui/CustomCursor.tsx`
12. Polish final: ajustes de timing, mobile responsive, meta tags SEO

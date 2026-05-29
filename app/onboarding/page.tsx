'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 1 | 2 | 3

interface OnboardingData {
  // Phase 1 - Corporativa
  companyName: string
  sector: string
  location: string
  website: string
  domainRegistrar: string
  domainOwner: string
  hostingProvider: string
  hostingAccess: string
  keepSameDomain: string
  corporateEmails: string
  logo: string
  colors: string
  typography: string
  brandManual: string
  photos: string
  installationsPhotos: string
  teamPhotos: string
  videos: string
  companyHistory: string
  services: string
  sectors: string
  advantages: string
  experience: string
  certifications: string
  notableClients: string
  // Phase 2 - Objetivos
  mainGoal: string
  captureNewClients: string
  modernImage: string
  showServices: string
  facilitateContact: string
  showWork: string
  otherGoals: string
  // Phase 2 - Funcionalidades técnicas
  contactForm: string
  whatsappButton: string
  imageGallery: string
  locationMap: string
  downloadCatalog: string
  blogNews: string
  // Phase 3 - Procesos
  currentManagement: string
  crmUsage: string
  crmDetails: string
  paymentMethods: string
  automationInterest: string
  autoQuotes: string
  autoReminders: string
  autoFollowUp: string
  autoInvoices: string
  automationAreas: string
  budget: string
  timeline: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  contactSchedule: string
  socialMedia: string
  whatsapp: string
}

const initialData: OnboardingData = {
  companyName: '',
  sector: '',
  location: '',
  website: '',
  domainRegistrar: '',
  domainOwner: '',
  hostingProvider: '',
  hostingAccess: '',
  keepSameDomain: '',
  corporateEmails: '',
  logo: '',
  colors: '',
  typography: '',
  brandManual: '',
  photos: '',
  installationsPhotos: '',
  teamPhotos: '',
  videos: '',
  companyHistory: '',
  services: '',
  sectors: '',
  advantages: '',
  experience: '',
  certifications: '',
  notableClients: '',
  mainGoal: '',
  captureNewClients: '',
  modernImage: '',
  showServices: '',
  facilitateContact: '',
  showWork: '',
  otherGoals: '',
  contactForm: '',
  whatsappButton: '',
  imageGallery: '',
  locationMap: '',
  downloadCatalog: '',
  blogNews: '',
  currentManagement: '',
  crmUsage: '',
  crmDetails: '',
  paymentMethods: '',
  automationInterest: '',
  autoQuotes: '',
  autoReminders: '',
  autoFollowUp: '',
  autoInvoices: '',
  automationAreas: '',
  budget: '',
  timeline: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  contactSchedule: '',
  socialMedia: '',
  whatsapp: '',
}

export default function OnboardingPage() {
  const [phase, setPhase] = useState<Phase>(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl text-center"
        >
          <div className="mb-8">
            <svg className="w-16 h-16 mx-auto text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-anybody text-4xl md:text-5xl font-bold text-cream mb-4" style={{ letterSpacing: '-0.03em' }}>
            ¡Gracias!
          </h1>
          <p className="font-cabinet text-cream-dim text-lg mb-2">
            Tu información ha sido enviada correctamente.
          </p>
          <p className="font-cabinet text-cream-dim text-base">
            German se pondrá en contacto contigo pronto.
          </p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <p className="font-cabinet text-sm text-green mb-4" style={{ letterSpacing: '0.1em' }}>
            FORMULARIO DE ALTA
          </p>
          <h1 className="font-anybody text-5xl md:text-7xl font-bold text-cream mb-4" style={{ letterSpacing: '-0.04em' }}>
            Nuevo proyecto
          </h1>
          <p className="font-cabinet text-cream-dim">
            Cuéntame sobre tu empresa para poder crear algo a tu medida.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-12">
          {[1, 2, 3].map((p) => (
            <div key={p} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-anybody font-bold text-sm transition-all duration-300"
                style={{
                  backgroundColor: phase >= p ? 'var(--color-green)' : 'var(--color-bg-card)',
                  color: phase >= p ? 'var(--color-cream)' : 'var(--color-cream-dim)',
                  border: phase === p ? '2px solid var(--color-green-light)' : '1px solid var(--color-border)',
                }}
              >
                {p}
              </div>
              {p < 3 && (
                <div className="w-16 h-px" style={{ backgroundColor: phase > p ? 'var(--color-green)' : 'var(--color-border)' }} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {phase === 1 && (
            <Phase1 key="phase1" data={data} updateData={updateData} onNext={() => setPhase(2)} />
          )}
          {phase === 2 && (
            <Phase2 key="phase2" data={data} updateData={updateData} onNext={() => setPhase(3)} onBack={() => setPhase(1)} />
          )}
          {phase === 3 && (
            <Phase3 key="phase3" data={data} updateData={updateData} onSubmit={handleSubmit} onBack={() => setPhase(2)} submitting={submitting} />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function Phase1({ data, updateData, onNext }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: string) => void; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-anybody text-3xl font-bold text-cream mb-8" style={{ letterSpacing: '-0.03em' }}>
        Información corporativa
      </h2>

      <div className="space-y-8">
        <Section title="Datos básicos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre de la empresa" value={data.companyName} onChange={(v) => updateData('companyName', v)} placeholder="Mi empresa S.L." />
            <Input label="Sector" value={data.sector} onChange={(v) => updateData('sector', v)} placeholder="Hostelería, salud, belleza..." />
            <Input label="Ubicación" value={data.location} onChange={(v) => updateData('location', v)} placeholder="Denia, Alicante..." />
          </div>
        </Section>

        <Section title="Presencia digital actual">
          <div className="space-y-4">
            <Input label="Web actual (si tienes)" value={data.website} onChange={(v) => updateData('website', v)} placeholder="www.miempresa.com" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Registro del dominio" value={data.domainRegistrar} onChange={(v) => updateData('domainRegistrar', v)} placeholder="GoDaddy, Hostinger..." />
              <Input label="Titular del dominio" value={data.domainOwner} onChange={(v) => updateData('domainOwner', v)} placeholder="A nombre de quién está" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Proveedor de hosting" value={data.hostingProvider} onChange={(v) => updateData('hostingProvider', v)} placeholder="Hostinger, SiteGround..." />
              <Input label="¿Tienes acceso al hosting?" value={data.hostingAccess} onChange={(v) => updateData('hostingAccess', v)} placeholder="Sí / No / No estoy seguro" />
            </div>
            <Select label="¿Quieres mantener el mismo dominio?" value={data.keepSameDomain} onChange={(v) => updateData('keepSameDomain', v)} options={['Sí, mantenerlo', 'No, quiero cambiarlo', 'No estoy seguro']} />
            <Input label="¿Usáis correos corporativos?" value={data.corporateEmails} onChange={(v) => updateData('corporateEmails', v)} placeholder="contacto@miempresa.com" />
          </div>
        </Section>

        <Section title="Material corporativo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Logo en buena calidad" value={data.logo} onChange={(v) => updateData('logo', v)} options={['Tengo logo en alta', 'Tengo logo pero baja calidad', 'No tengo logo', 'Necesito crear uno']} />
            <Input label="Colores corporativos" value={data.colors} onChange={(v) => updateData('colors', v)} placeholder="Azul, blanco, negro..." />
            <Input label="Tipografías" value={data.typography} onChange={(v) => updateData('typography', v)} placeholder="Fuente principal, secundaria..." />
          </div>
          <Select label="¿Tenéis manual de marca?" value={data.brandManual} onChange={(v) => updateData('brandManual', v)} options={['Sí, lo tengo', 'No, pero sé lo que quiero', 'No tengo, necesito orientación']} />
        </Section>

        <Section title="Contenido visual">
          <div className="space-y-4">
            <Select label="Fotografías de trabajos" value={data.photos} onChange={(v) => updateData('photos', v)} options={['Sí, tengo muchas', 'Tengo algunas', 'Muy pocas', 'No tengo']} />
            <Select label="Fotos de instalaciones" value={data.installationsPhotos} onChange={(v) => updateData('installationsPhotos', v)} options={['Sí', 'No']} />
            <Select label="Fotos del equipo" value={data.teamPhotos} onChange={(v) => updateData('teamPhotos', v)} options={['Sí', 'No']} />
            <Select label="Vídeos" value={data.videos} onChange={(v) => updateData('videos', v)} options={['Sí, tengo vídeos', 'No tengo pero me interesa', 'No tengo']} />
          </div>
        </Section>

        <Section title="Sobre la empresa">
          <div className="space-y-4">
            <Textarea label="Historia o presentación" value={data.companyHistory} onChange={(v) => updateData('companyHistory', v)} placeholder="Cuéntame brevemente quién sois y qué hacéis..." />
            <Textarea label="Servicios que ofrecéis" value={data.services} onChange={(v) => updateData('services', v)} placeholder="Lista de servicios principales..." />
            <Input label="Sectores con los que trabajáis" value={data.sectors} onChange={(v) => updateData('sectors', v)} placeholder="B2B, B2C, local, nacional..." />
            <Textarea label="Ventajas o puntos fuertes" value={data.advantages} onChange={(v) => updateData('advantages', v)} placeholder="Qué os diferencia de la competencia..." />
            <Input label="Años de experiencia" value={data.experience} onChange={(v) => updateData('experience', v)} placeholder="5 años, desde 2018..." />
            <Input label="Certificaciones" value={data.certifications} onChange={(v) => updateData('certifications', v)} placeholder="ISO, licitaciones..." />
            <Textarea label="Clientes destacados" value={data.notableClients} onChange={(v) => updateData('notableClients', v)} placeholder="Empresas o instituciones con las que habéis trabajado..." />
          </div>
        </Section>
      </div>

      <div className="mt-12 flex justify-end">
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </motion.div>
  )
}

function Phase2({ data, updateData, onNext, onBack }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-anybody text-3xl font-bold text-cream mb-8" style={{ letterSpacing: '-0.03em' }}>
        Objetivos de negocio
      </h2>

      <div className="space-y-8">
        <Section title="Objetivo principal">
          <Textarea label="¿Qué quieres conseguir con la nueva web?" value={data.mainGoal} onChange={(v) => updateData('mainGoal', v)} placeholder="Quiero que nuevos clientes me encuentren en Google, mostrar mis servicios y facilitar que contacten conmigo..." />
        </Section>

        <Section title="Funcionalidades prioritarias">
          <div className="space-y-4">
            <Checkbox label="Captar nuevos clientes" checked={data.captureNewClients === 'yes'} onChange={(v) => updateData('captureNewClients', v ? 'yes' : '')} />
            <Checkbox label="Transmitir una imagen más moderna" checked={data.modernImage === 'yes'} onChange={(v) => updateData('modernImage', v ? 'yes' : '')} />
            <Checkbox label="Mostrar mejor los servicios" checked={data.showServices === 'yes'} onChange={(v) => updateData('showServices', v ? 'yes' : '')} />
            <Checkbox label="Facilitar el contacto" checked={data.facilitateContact === 'yes'} onChange={(v) => updateData('facilitateContact', v ? 'yes' : '')} />
            <Checkbox label="Enseñar trabajos realizados" checked={data.showWork === 'yes'} onChange={(v) => updateData('showWork', v ? 'yes' : '')} />
          </div>
          <Input label="Otros objetivos" value={data.otherGoals} onChange={(v) => updateData('otherGoals', v)} placeholder="¿Algo más que quieras conseguir?" />
        </Section>

        <Section title="Funcionalidades técnicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Formulario de contacto" value={data.contactForm} onChange={(v) => updateData('contactForm', v)} options={['Sí, necesito', 'No es prioritario']} />
            <Select label="Botón de WhatsApp" value={data.whatsappButton} onChange={(v) => updateData('whatsappButton', v)} options={['Sí, necesito', 'No es prioritario']} />
            <Select label="Galería de imágenes" value={data.imageGallery} onChange={(v) => updateData('imageGallery', v)} options={['Sí, necesito', 'No es prioritario']} />
            <Select label="Mapa de ubicación" value={data.locationMap} onChange={(v) => updateData('locationMap', v)} options={['Sí, necesito', 'No es prioritario']} />
            <Select label="Catálogo descargable" value={data.downloadCatalog} onChange={(v) => updateData('downloadCatalog', v)} options={['Sí, necesito', 'No es prioritario']} />
            <Select label="Blog / Noticias" value={data.blogNews} onChange={(v) => updateData('blogNews', v)} options={['Sí, lo quiero', 'No lo necesito', 'Quizás más adelante']} />
          </div>
        </Section>
      </div>

      <div className="mt-12 flex justify-between">
        <Button variant="secondary" onClick={onBack}>Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </div>
    </motion.div>
  )
}

function Phase3({ data, updateData, onSubmit, onBack, submitting }: { data: OnboardingData; updateData: (field: keyof OnboardingData, value: string) => void; onSubmit: () => void; onBack: () => void; submitting: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-anybody text-3xl font-bold text-cream mb-8" style={{ letterSpacing: '-0.03em' }}>
        Procesos internos
      </h2>

      <div className="space-y-8">
        <Section title="Gestión actual">
          <Textarea label="¿Cómo gestionáis actualmente los clientes, pedidos o servicios?" value={data.currentManagement} onChange={(v) => updateData('currentManagement', v)} placeholder="WhatsApp, Excel, papel, software específico..." />
          <Select label="¿Usáis algún CRM?" value={data.crmUsage} onChange={(v) => updateData('crmUsage', v)} options={['No usamos CRM', 'Google Sheets / Excel', 'HubSpot, Salesforce...', 'Otro']} />
          <Input label="¿Cuál?" value={data.crmDetails} onChange={(v) => updateData('crmDetails', v)} placeholder="Nombre del CRM que usáis" />
        </Section>

        <Section title="Pagos y cobros">
          <Input label="¿Cómo aceptáis pagos actualmente?" value={data.paymentMethods} onChange={(v) => updateData('paymentMethods', v)} placeholder="Transferencia, Bizum, Stripe..." />
        </Section>

        <Section title="Automatizaciones">
          <p className="font-cabinet text-cream-dim mb-4">¿Hay tareas que haces manualmente y te gustaría automatizar?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Envío de presupuestos" value={data.autoQuotes} onChange={(v) => updateData('autoQuotes', v)} options={['Manual ahora', 'Me gustaría automatizar', 'Ya lo tengo automatizado']} />
            <Select label="Recordatorios de citas" value={data.autoReminders} onChange={(v) => updateData('autoReminders', v)} options={['Manual ahora', 'Me gustaría automatizar', 'Ya lo tengo automatizado']} />
            <Select label="Seguimiento de clientes" value={data.autoFollowUp} onChange={(v) => updateData('autoFollowUp', v)} options={['Manual ahora', 'Me gustaría automatizar', 'Ya lo tengo automatizado']} />
            <Select label="Envío de facturas" value={data.autoInvoices} onChange={(v) => updateData('autoInvoices', v)} options={['Manual ahora', 'Me gustaría automatizar', 'Ya lo tengo automatizado']} />
          </div>
          <Input label="Otras áreas a automatizar" value={data.automationAreas} onChange={(v) => updateData('automationAreas', v)} placeholder="Ej: envío de emails, actualizaciones de stock..." />
        </Section>

        <Section title="Información de contacto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" value={data.contactName} onChange={(v) => updateData('contactName', v)} placeholder="Tu nombre" />
            <Input label="Email" value={data.contactEmail} onChange={(v) => updateData('contactEmail', v)} placeholder="tu@email.com" type="email" />
            <Input label="Teléfono" value={data.contactPhone} onChange={(v) => updateData('contactPhone', v)} placeholder="+34 600 000 000" />
            <Input label="Dirección" value={data.contactAddress} onChange={(v) => updateData('contactAddress', v)} placeholder="Calle, ciudad, cp" />
          </div>
          <Input label="Horario de atención" value={data.contactSchedule} onChange={(v) => updateData('contactSchedule', v)} placeholder="L-V 9:00-18:00" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Redes sociales" value={data.socialMedia} onChange={(v) => updateData('socialMedia', v)} placeholder="Instagram, LinkedIn..." />
            <Input label="WhatsApp" value={data.whatsapp} onChange={(v) => updateData('whatsapp', v)} placeholder="+34 600 000 000" />
          </div>
        </Section>

        <Section title="Presupuesto y timeline">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Presupuesto aproximado" value={data.budget} onChange={(v) => updateData('budget', v)} options={['Menos de 1.500€', '1.500€ - 3.000€', '3.000€ - 5.000€', 'Más de 5.000€', 'Aún no lo sé']} />
            <Select label="¿Cuándo quieres empezar?" value={data.timeline} onChange={(v) => updateData('timeline', v)} options={['Cuanto antes', 'En 1-2 meses', 'En 3-6 meses', 'Solo informándome']} />
          </div>
        </Section>
      </div>

      <div className="mt-12 flex justify-between">
        <Button variant="secondary" onClick={onBack}>Anterior</Button>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </motion.div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-cabinet font-medium text-cream-dim text-sm uppercase" style={{ letterSpacing: '0.08em' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-2">
      <label className="font-cabinet text-xs text-cream-dim" style={{ letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b px-0 py-3 font-cabinet text-cream placeholder:text-cream-dim/50 focus:outline-none focus:border-green transition-colors"
        style={{ borderColor: 'var(--color-border)' }}
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="font-cabinet text-xs text-cream-dim" style={{ letterSpacing: '0.05em' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent border rounded-sm px-4 py-3 font-cabinet text-cream placeholder:text-cream-dim/50 focus:outline-none focus:border-green transition-colors resize-none"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="space-y-2">
      <label className="font-cabinet text-xs text-cream-dim" style={{ letterSpacing: '0.05em' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b px-0 py-3 font-cabinet text-cream focus:outline-none focus:border-green transition-colors"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <option value="" className="bg-[var(--color-bg)]">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[var(--color-bg)]">{opt}</option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className="w-5 h-5 rounded flex items-center justify-center transition-all"
        style={{
          backgroundColor: checked ? 'var(--color-green)' : 'transparent',
          border: checked ? 'none' : '1px solid var(--color-border)',
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="font-cabinet text-cream group-hover:text-green transition-colors">{label}</span>
    </label>
  )
}

function Button({ children, onClick, variant = 'primary', disabled }: { children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-4 font-cabinet font-medium text-sm transition-all duration-300 disabled:opacity-50"
      style={{
        backgroundColor: variant === 'primary' ? 'var(--color-green)' : 'transparent',
        color: 'var(--color-cream)',
        border: variant === 'secondary' ? '1px solid var(--color-border)' : 'none',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </button>
  )
}
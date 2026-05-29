'use client'

import { useCallback } from 'react'

type D = Record<string, unknown>

function str(v: unknown): string {
  return typeof v === 'string' && v.trim() ? v.trim() : ''
}

function Field({ label, value }: { label: string; value: unknown }) {
  const v = str(value)
  if (!v) return null
  return (
    <div>
      <p className="font-cabinet text-xs text-cream-dim mb-0.5" style={{ letterSpacing: '0.04em' }}>{label}</p>
      <p className="font-cabinet text-sm text-cream whitespace-pre-wrap">{v}</p>
    </div>
  )
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-cabinet text-xs font-bold text-green uppercase mb-3" style={{ letterSpacing: '0.1em' }}>{title}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />
}

function buildExportText(d: D, createdAt: string): string {
  const line = (label: string, value: unknown) => {
    const v = str(value)
    return v ? `${label}: ${v}` : ''
  }
  const section = (title: string, lines: string[]) => {
    const content = lines.filter(Boolean).join('\n')
    return content ? `\n${title.toUpperCase()}\n${'─'.repeat(40)}\n${content}` : ''
  }

  const fecha = new Date(createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  return [
    `ONBOARDING — ${str(d.companyName) || 'Sin nombre'}`,
    `Fecha: ${fecha}`,

    section('Datos básicos', [
      line('Empresa', d.companyName),
      line('Sector', d.sector),
      line('Ubicación', d.location),
    ]),

    section('Presencia digital actual', [
      line('Web actual', d.website),
      line('Registro de dominio', d.domainRegistrar),
      line('Titular del dominio', d.domainOwner),
      line('Hosting', d.hostingProvider),
      line('Acceso al hosting', d.hostingAccess),
      line('Mantener dominio', d.keepSameDomain),
      line('Correos corporativos', d.corporateEmails),
    ]),

    section('Material corporativo', [
      line('Logo', d.logo),
      line('Colores', d.colors),
      line('Tipografías', d.typography),
      line('Manual de marca', d.brandManual),
    ]),

    section('Contenido visual', [
      line('Fotos de trabajos', d.photos),
      line('Fotos instalaciones', d.installationsPhotos),
      line('Fotos equipo', d.teamPhotos),
      line('Vídeos', d.videos),
    ]),

    section('Sobre la empresa', [
      line('Historia', d.companyHistory),
      line('Servicios', d.services),
      line('Sectores', d.sectors),
      line('Ventajas / diferencial', d.advantages),
      line('Experiencia', d.experience),
      line('Certificaciones', d.certifications),
      line('Clientes destacados', d.notableClients),
    ]),

    section('Objetivos', [
      line('Objetivo principal', d.mainGoal),
      line('Captar nuevos clientes', d.captureNewClients === 'yes' ? 'Sí' : ''),
      line('Imagen más moderna', d.modernImage === 'yes' ? 'Sí' : ''),
      line('Mostrar servicios', d.showServices === 'yes' ? 'Sí' : ''),
      line('Facilitar contacto', d.facilitateContact === 'yes' ? 'Sí' : ''),
      line('Mostrar trabajos', d.showWork === 'yes' ? 'Sí' : ''),
      line('Otros objetivos', d.otherGoals),
    ]),

    section('Funcionalidades técnicas', [
      line('Formulario de contacto', d.contactForm),
      line('Botón WhatsApp', d.whatsappButton),
      line('Galería de imágenes', d.imageGallery),
      line('Mapa de ubicación', d.locationMap),
      line('Catálogo descargable', d.downloadCatalog),
      line('Blog / Noticias', d.blogNews),
    ]),

    section('Gestión y procesos', [
      line('Gestión actual', d.currentManagement),
      line('CRM', d.crmUsage),
      line('CRM (cuál)', d.crmDetails),
      line('Métodos de pago', d.paymentMethods),
    ]),

    section('Automatizaciones', [
      line('Envío de presupuestos', d.autoQuotes),
      line('Recordatorios de citas', d.autoReminders),
      line('Seguimiento de clientes', d.autoFollowUp),
      line('Envío de facturas', d.autoInvoices),
      line('Otras áreas', d.automationAreas),
    ]),

    section('Presupuesto y timing', [
      line('Presupuesto', d.budget),
      line('Cuándo empezar', d.timeline),
    ]),

    section('Contacto', [
      line('Nombre', d.contactName),
      line('Email', d.contactEmail),
      line('Teléfono', d.contactPhone),
      line('Dirección', d.contactAddress),
      line('Horario', d.contactSchedule),
      line('Redes sociales', d.socialMedia),
      line('WhatsApp', d.whatsapp),
    ]),
  ]
    .filter(Boolean)
    .join('\n')
}

export default function OnboardingDetail({ data, createdAt }: { data: D; createdAt: string }) {
  const handleExport = useCallback(() => {
    const text = buildExportText(data, createdAt)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onboarding-${str(data.companyName) || 'cliente'}-${new Date(createdAt).toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, createdAt])

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-cabinet text-xs text-green uppercase" style={{ letterSpacing: '0.08em' }}>Formulario de onboarding</p>
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-1.5 font-cabinet text-xs border transition-colors hover:border-green hover:text-green"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-cream-dim)' }}
        >
          Exportar .txt
        </button>
      </div>

      <Divider />

      {/* 1 - Datos básicos */}
      <SectionBlock title="Datos básicos">
        <Field label="Empresa" value={data.companyName} />
        <Field label="Sector" value={data.sector} />
        <Field label="Ubicación" value={data.location} />
      </SectionBlock>

      <Divider />

      {/* 2 - Presencia digital */}
      <SectionBlock title="Presencia digital actual">
        <Field label="Web actual" value={data.website} />
        <Field label="Registro dominio" value={data.domainRegistrar} />
        <Field label="Titular del dominio" value={data.domainOwner} />
        <Field label="Hosting" value={data.hostingProvider} />
        <Field label="Acceso al hosting" value={data.hostingAccess} />
        <Field label="Mantener dominio" value={data.keepSameDomain} />
        <Field label="Correos corporativos" value={data.corporateEmails} />
      </SectionBlock>

      <Divider />

      {/* 3 - Marca */}
      <SectionBlock title="Material de marca">
        <Field label="Logo" value={data.logo} />
        <Field label="Colores" value={data.colors} />
        <Field label="Tipografías" value={data.typography} />
        <Field label="Manual de marca" value={data.brandManual} />
        <Field label="Fotos de trabajos" value={data.photos} />
        <Field label="Fotos instalaciones" value={data.installationsPhotos} />
        <Field label="Fotos equipo" value={data.teamPhotos} />
        <Field label="Vídeos" value={data.videos} />
      </SectionBlock>

      <Divider />

      {/* 4 - Empresa */}
      {(str(data.companyHistory) || str(data.services) || str(data.advantages)) && (
        <>
          <div className="space-y-4">
            <p className="font-cabinet text-xs font-bold text-green uppercase" style={{ letterSpacing: '0.1em' }}>Sobre la empresa</p>
            <Field label="Historia / presentación" value={data.companyHistory} />
            <Field label="Servicios" value={data.services} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Sectores" value={data.sectors} />
              <Field label="Experiencia" value={data.experience} />
              <Field label="Certificaciones" value={data.certifications} />
            </div>
            <Field label="Ventajas / diferencial" value={data.advantages} />
            <Field label="Clientes destacados" value={data.notableClients} />
          </div>
          <Divider />
        </>
      )}

      {/* 5 - Objetivos */}
      <div className="space-y-4">
        <p className="font-cabinet text-xs font-bold text-green uppercase" style={{ letterSpacing: '0.1em' }}>Objetivos</p>
        <Field label="Objetivo principal" value={data.mainGoal} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {data.captureNewClients === 'yes' && <Field label="Captar nuevos clientes" value="Sí" />}
          {data.modernImage === 'yes' && <Field label="Imagen más moderna" value="Sí" />}
          {data.showServices === 'yes' && <Field label="Mostrar servicios" value="Sí" />}
          {data.facilitateContact === 'yes' && <Field label="Facilitar contacto" value="Sí" />}
          {data.showWork === 'yes' && <Field label="Mostrar trabajos" value="Sí" />}
        </div>
        <Field label="Otros objetivos" value={data.otherGoals} />
      </div>

      <Divider />

      {/* 6 - Funcionalidades técnicas */}
      <SectionBlock title="Funcionalidades técnicas">
        <Field label="Formulario de contacto" value={data.contactForm} />
        <Field label="Botón WhatsApp" value={data.whatsappButton} />
        <Field label="Galería de imágenes" value={data.imageGallery} />
        <Field label="Mapa de ubicación" value={data.locationMap} />
        <Field label="Catálogo descargable" value={data.downloadCatalog} />
        <Field label="Blog / Noticias" value={data.blogNews} />
      </SectionBlock>

      <Divider />

      {/* 7 - Procesos */}
      <SectionBlock title="Gestión y procesos">
        <Field label="Gestión actual" value={data.currentManagement} />
        <Field label="CRM" value={data.crmUsage} />
        <Field label="CRM (cuál)" value={data.crmDetails} />
        <Field label="Métodos de pago" value={data.paymentMethods} />
      </SectionBlock>

      <Divider />

      {/* 8 - Automatizaciones */}
      <SectionBlock title="Automatizaciones">
        <Field label="Envío de presupuestos" value={data.autoQuotes} />
        <Field label="Recordatorios de citas" value={data.autoReminders} />
        <Field label="Seguimiento de clientes" value={data.autoFollowUp} />
        <Field label="Envío de facturas" value={data.autoInvoices} />
        <Field label="Otras áreas" value={data.automationAreas} />
      </SectionBlock>

      <Divider />

      {/* 9 - Presupuesto */}
      <SectionBlock title="Presupuesto y timing">
        <Field label="Presupuesto" value={data.budget} />
        <Field label="Cuándo empezar" value={data.timeline} />
      </SectionBlock>

      <Divider />

      {/* 10 - Contacto */}
      <SectionBlock title="Datos de contacto">
        <Field label="Nombre" value={data.contactName} />
        <Field label="Email" value={data.contactEmail} />
        <Field label="Teléfono" value={data.contactPhone} />
        <Field label="Dirección" value={data.contactAddress} />
        <Field label="Horario" value={data.contactSchedule} />
        <Field label="Redes sociales" value={data.socialMedia} />
        <Field label="WhatsApp" value={data.whatsapp} />
      </SectionBlock>

    </div>
  )
}

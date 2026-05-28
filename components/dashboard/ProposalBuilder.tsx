'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateProposalHtml, ProposalItem, ProposalData } from '@/lib/proposalHtml'

interface Props {
  initialClientName?: string
}

const DEFAULT_PHASE1: ProposalItem[] = [
  {
    id: '1',
    name: 'Página web profesional',
    desc: 'Diseño a medida con identidad de marca · Carta digital con categorías y precios · Sección de reservas · Adaptada a móvil y tablet',
    price: 350,
  },
  {
    id: '2',
    name: 'Panel de gestión de contenidos',
    desc: 'Edita precios, imágenes, carta y promociones sin tocar código · Acceso desde móvil · Cambios en tiempo real · Formación incluida',
    price: 150,
  },
]

const DEFAULT_PHASE2: ProposalItem[] = [
  {
    id: '1',
    name: 'Panel de reservas',
    desc: 'Gestión de mesas, horarios y confirmaciones',
    price: 150,
  },
  {
    id: '2',
    name: 'TPV / Comandas en cocina',
    desc: 'Sistema de pedidos en tiempo real para sala y cocina',
    price: 150,
  },
  {
    id: '3',
    name: 'Mantenimiento mensual',
    desc: 'Actualizaciones, soporte y hosting incluidos',
    price: 50,
    period: 'mes',
  },
]

function newItem(): ProposalItem {
  return { id: Date.now().toString(), name: '', desc: '', price: 0 }
}

export default function ProposalBuilder({ initialClientName = '' }: Props) {
  const [clientName, setClientName] = useState(initialClientName)
  const [intro, setIntro] = useState(
    'Presupuesto para presencia digital: página web profesional con carta, sistema de reservas integrado y panel de gestión para que el equipo pueda actualizar contenido de forma autónoma.',
  )
  const [phase1, setPhase1] = useState<ProposalItem[]>(DEFAULT_PHASE1)
  const [showPhase2, setShowPhase2] = useState(true)
  const [phase2, setPhase2] = useState<ProposalItem[]>(DEFAULT_PHASE2)
  const [paymentNote, setPaymentNote] = useState('Pago 50% al inicio · 50% en entrega')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (initialClientName) setClientName(initialClientName)
  }, [initialClientName])

  const proposalData: ProposalData = {
    clientName,
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    intro,
    phase1,
    showPhase2,
    phase2,
    paymentNote,
    contactEmail: 'germangomez1193@gmail.com',
    contactWeb: 'german-gomez.es',
  }

  const html = generateProposalHtml(proposalData)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html
    }
  }, [html])

  const handleDownload = useCallback(() => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 600)
  }, [html])

  const updatePhase1 = (id: string, field: keyof ProposalItem, value: string | number) => {
    setPhase1((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const updatePhase2 = (id: string, field: keyof ProposalItem, value: string | number) => {
    setPhase2((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const total = phase1.reduce((sum, i) => sum + Number(i.price), 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-[600px]">

      {/* ── FORM ── */}
      <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-2">

        {/* Client + Intro */}
        <div className="space-y-4">
          <div>
            <label className="block font-cabinet text-xs text-green mb-2" style={{ letterSpacing: '0.1em' }}>
              NOMBRE DEL CLIENTE
            </label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ben's Burger"
              className="w-full bg-transparent border px-4 py-3 font-cabinet text-cream placeholder:text-cream-dim/40 focus:outline-none focus:border-green transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
          <div>
            <label className="block font-cabinet text-xs text-green mb-2" style={{ letterSpacing: '0.1em' }}>
              DESCRIPCIÓN / INTRO
            </label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={3}
              className="w-full bg-transparent border px-4 py-3 font-cabinet text-sm text-cream placeholder:text-cream-dim/40 focus:outline-none focus:border-green transition-colors resize-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
        </div>

        {/* Phase 1 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-cabinet text-xs font-bold text-green-light" style={{ letterSpacing: '0.12em' }}>
              FASE 1 — SERVICIOS
            </span>
            <button
              onClick={() => setPhase1((prev) => [...prev, newItem()])}
              className="font-cabinet text-xs text-cream-dim hover:text-green transition-colors"
            >
              + Añadir servicio
            </button>
          </div>
          <div className="space-y-3">
            {phase1.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 border space-y-3"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
              >
                <div className="flex gap-3 items-start">
                  <span className="font-anybody text-xs text-green pt-3 min-w-[20px]">0{idx + 1}</span>
                  <div className="flex-1 space-y-2">
                    <input
                      value={item.name}
                      onChange={(e) => updatePhase1(item.id, 'name', e.target.value)}
                      placeholder="Nombre del servicio"
                      className="w-full bg-transparent border-b font-cabinet font-medium text-cream placeholder:text-cream-dim/40 focus:outline-none pb-1 transition-colors"
                      style={{ borderColor: 'var(--color-border)' }}
                    />
                    <textarea
                      value={item.desc}
                      onChange={(e) => updatePhase1(item.id, 'desc', e.target.value)}
                      placeholder="Descripción (usa · para separar puntos)"
                      rows={2}
                      className="w-full bg-transparent font-cabinet text-sm text-cream-dim placeholder:text-cream-dim/40 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[80px]">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updatePhase1(item.id, 'price', Number(e.target.value))}
                        className="w-16 bg-transparent border-b text-right font-anybody font-bold text-cream focus:outline-none pb-1"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                      <span className="font-cabinet text-cream-dim text-sm">€</span>
                    </div>
                    {phase1.length > 1 && (
                      <button
                        onClick={() => setPhase1((prev) => prev.filter((i) => i.id !== item.id))}
                        className="font-cabinet text-xs text-cream-dim/40 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between items-center px-4 py-3 mt-2"
            style={{ backgroundColor: 'var(--color-bg-card)', borderLeft: '3px solid var(--color-green)' }}
          >
            <span className="font-cabinet text-xs text-cream-dim font-bold" style={{ letterSpacing: '0.1em' }}>
              TOTAL FASE 1
            </span>
            <span className="font-anybody font-bold text-cream text-xl">
              {total.toLocaleString('es-ES')} €
            </span>
          </div>
        </div>

        {/* Payment note */}
        <div>
          <label className="block font-cabinet text-xs text-green mb-2" style={{ letterSpacing: '0.1em' }}>
            NOTA DE PAGO
          </label>
          <input
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            className="w-full bg-transparent border px-4 py-2 font-cabinet text-sm text-cream placeholder:text-cream-dim/40 focus:outline-none focus:border-green transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>

        {/* Phase 2 toggle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-cabinet text-xs font-bold text-green-light" style={{ letterSpacing: '0.12em' }}>
              FASE 2 — PRÓXIMAS MEJORAS
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPhase2((v) => !v)}
                className="font-cabinet text-xs transition-colors"
                style={{ color: showPhase2 ? 'var(--color-green)' : 'var(--color-cream-dim)' }}
              >
                {showPhase2 ? 'Ocultar en propuesta' : 'Mostrar en propuesta'}
              </button>
              {showPhase2 && (
                <button
                  onClick={() => setPhase2((prev) => [...prev, newItem()])}
                  className="font-cabinet text-xs text-cream-dim hover:text-green transition-colors"
                >
                  + Añadir
                </button>
              )}
            </div>
          </div>
          {showPhase2 && (
            <div className="space-y-2">
              {phase2.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-center p-3 border"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
                >
                  <input
                    value={item.name}
                    onChange={(e) => updatePhase2(item.id, 'name', e.target.value)}
                    placeholder="Servicio futuro"
                    className="flex-1 bg-transparent font-cabinet text-sm text-cream placeholder:text-cream-dim/40 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updatePhase2(item.id, 'price', Number(e.target.value))}
                    className="w-14 bg-transparent text-right font-anybody font-bold text-cream-dim text-sm focus:outline-none"
                  />
                  <span className="font-cabinet text-cream-dim text-xs">€</span>
                  <input
                    value={item.period ?? ''}
                    onChange={(e) => updatePhase2(item.id, 'period', e.target.value)}
                    placeholder="mes"
                    className="w-10 bg-transparent font-cabinet text-xs text-cream-dim placeholder:text-cream-dim/30 focus:outline-none"
                  />
                  <button
                    onClick={() => setPhase2((prev) => prev.filter((i) => i.id !== item.id))}
                    className="font-cabinet text-xs text-cream-dim/40 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="w-full px-6 py-4 bg-green font-cabinet font-bold text-cream text-sm hover:opacity-90 transition-opacity"
          style={{ letterSpacing: '0.08em' }}
        >
          DESCARGAR PDF
        </button>
      </div>

      {/* ── PREVIEW ── */}
      <div className="hidden xl:block">
        <p className="font-cabinet text-xs text-cream-dim mb-3" style={{ letterSpacing: '0.08em' }}>
          PREVISUALIZACIÓN EN TIEMPO REAL
        </p>
        <div
          className="border overflow-hidden"
          style={{ borderColor: 'var(--color-border)', height: '80vh' }}
        >
          <iframe
            ref={iframeRef}
            title="Propuesta preview"
            className="w-full h-full"
            style={{ background: '#0a0a0a' }}
          />
        </div>
      </div>

    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProposalBuilder from '@/components/dashboard/ProposalBuilder'
import OnboardingDetail from '@/components/dashboard/OnboardingDetail'
import LeadNotes, { Note } from '@/components/dashboard/LeadNotes'
import KPIBar from '@/components/dashboard/KPIBar'

interface Submission {
  id: string
  type: 'contact' | 'onboarding'
  lead_status: 'new' | 'contacted' | 'onboarding_sent' | 'onboarding_received' | 'proposal' | 'closed'
  created_at: string
  data: Record<string, unknown>
  notes?: Note[]
  deal_amount?: number | null
}

const STATUS_CONFIG: Record<Submission['lead_status'], { label: string; color: string; bg: string }> = {
  new:               { label: 'Nuevo',              color: '#7DB892', bg: 'rgba(125,184,146,0.15)' },
  contacted:         { label: 'Contactado',         color: '#A89F8C', bg: 'rgba(168,159,140,0.15)' },
  onboarding_sent:   { label: 'Onboarding enviado', color: '#4A7C59', bg: 'rgba(74,124,89,0.15)' },
  onboarding_received: { label: 'Onboarding recibido', color: '#7DB892', bg: 'rgba(125,184,146,0.2)' },
  proposal:          { label: 'Propuesta',          color: '#DDD0BC', bg: 'rgba(221,208,188,0.15)' },
  closed:            { label: 'Cerrado',           color: '#666', bg: 'rgba(102,102,102,0.15)' },
}

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sendingOnboarding, setSendingOnboarding] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'leads' | 'proposal'>('leads')
  const [proposalClient, setProposalClient] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('dashboard_auth')
    if (stored === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadSubmissions()
    }
  }, [authenticated])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submissions')
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.data || [])
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: Submission['lead_status']) => {
    try {
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, lead_status: status }),
      })
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, lead_status: status } : s))
      )
    } catch (e) {
      console.error('Failed to update status:', e)
    }
  }

  const updateDealAmount = async (id: string, amount: number | null) => {
    try {
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, deal_amount: amount }),
      })
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, deal_amount: amount } : s))
    } catch (e) {
      console.error('Failed to update deal amount:', e)
    }
  }

  const sendOnboardingLink = async (id: string) => {
    setSendingOnboarding(id)
    const submission = submissions.find((s) => s.id === id)
    if (!submission) return

    const email = submission.data.email as string
    const nombre = submission.data.nombre as string

    try {
      await fetch('/api/send-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre }),
      })
      await updateStatus(id, 'onboarding_sent')
    } catch (e) {
      console.error('Failed to send onboarding:', e)
    } finally {
      setSendingOnboarding(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthenticated(true)
        sessionStorage.setItem('dashboard_auth', 'true')
        setError(false)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    sessionStorage.removeItem('dashboard_auth')
    setPassword('')
  }

  const selected = submissions.find((s) => s.id === selectedId)
  const statusConfig = selected ? STATUS_CONFIG[selected.lead_status] : null

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="font-anybody text-3xl font-bold text-cream mb-2" style={{ letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p className="font-cabinet text-cream-dim mb-8">Accede para ver los formularios recibidos.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-transparent border px-4 py-3 font-cabinet text-cream placeholder:text-cream-dim/50 focus:outline-none focus:border-green transition-colors"
                style={{ borderColor: error ? '#4A7C59' : 'var(--color-border)' }}
              />
              {error && <p className="font-cabinet text-xs text-green mt-2">Contraseña incorrecta</p>}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-green font-cabinet font-medium text-cream transition-opacity hover:opacity-90"
              style={{ letterSpacing: '0.05em' }}
            >
              Acceder
            </button>
          </form>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-cabinet text-xs text-green mb-2" style={{ letterSpacing: '0.1em' }}>DASHBOARD</p>
            <h1 className="font-anybody text-4xl md:text-5xl font-bold text-cream" style={{ letterSpacing: '-0.04em' }}>
              {activeTab === 'leads' ? 'Leads' : 'Nueva propuesta'}
            </h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 font-cabinet text-sm text-cream-dim border border-[var(--color-border)] hover:border-green hover:text-green transition-colors">
            Cerrar sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {(['leads', 'proposal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 font-cabinet text-sm transition-colors"
              style={{
                color: activeTab === tab ? 'var(--color-cream)' : 'var(--color-cream-dim)',
                borderBottom: activeTab === tab ? '2px solid var(--color-green)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab === 'leads' ? 'Leads' : 'Propuestas'}
            </button>
          ))}
        </div>

        {activeTab === 'proposal' ? (
          <ProposalBuilder initialClientName={proposalClient} />
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cabinet text-cream-dim">No hay formularios todavía.</p>
          </div>
        ) : (
          <>
          <KPIBar submissions={submissions} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {submissions.map((sub) => {
                const sc = STATUS_CONFIG[sub.lead_status]
                const nombre = sub.data.nombre as string || 'Sin nombre'
                const email = sub.data.email as string || ''
                const negocio = sub.data.negocio as string || ''
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedId(sub.id)}
                    className="w-full text-left p-5 transition-all"
                    style={{
                      backgroundColor: selectedId === sub.id ? 'var(--color-bg-card)' : 'transparent',
                      border: `1px solid ${selectedId === sub.id ? 'var(--color-green)' : 'var(--color-border)'}`,
                      borderRadius: '8px',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-cabinet font-medium text-cream">{nombre}</p>
                      <span
                        className="font-cabinet text-xs px-2 py-1 rounded"
                        style={{ color: sc.color, backgroundColor: sc.bg, letterSpacing: '0.05em' }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p className="font-cabinet text-xs text-cream-dim">{email}</p>
                    {negocio && <p className="font-cabinet text-xs text-green mt-1">{negocio}</p>}
                    <p className="font-cabinet text-xs text-cream-dim mt-2">
                      {new Date(sub.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                          <span className="font-anybody font-bold text-green text-sm">{(selected.data.nombre as string || 'N')[0]}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-cabinet font-medium text-cream">{selected.data.nombre as string || 'Sin nombre'}</p>
                          <p className="font-cabinet text-xs text-cream-dim">{selected.data.email as string}</p>
                        </div>
                        {statusConfig && (
                          <span className="font-cabinet text-xs px-3 py-1.5 rounded" style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}>
                            {statusConfig.label}
                          </span>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {selected.data.telefono as string && (
                            <div>
                              <p className="font-cabinet text-xs text-cream-dim">Teléfono</p>
                              <p className="font-cabinet text-sm text-cream">{selected.data.telefono as string}</p>
                            </div>
                          )}
                          {selected.data.negocio as string && (
                            <div>
                              <p className="font-cabinet text-xs text-cream-dim">Negocio</p>
                              <p className="font-cabinet text-sm text-cream">{selected.data.negocio as string}</p>
                            </div>
                          )}
                          {selected.data.presupuesto as string && (
                            <div>
                              <p className="font-cabinet text-xs text-cream-dim">Presupuesto</p>
                              <p className="font-cabinet text-sm text-cream">{selected.data.presupuesto as string}</p>
                            </div>
                          )}
                          {selected.data.timing as string && (
                            <div>
                              <p className="font-cabinet text-xs text-cream-dim">Timing</p>
                              <p className="font-cabinet text-sm text-cream">{selected.data.timing as string}</p>
                            </div>
                          )}
                        </div>
                        {selected.data.problema as string && (
                          <div>
                            <p className="font-cabinet text-xs text-cream-dim mb-1">¿Qué quiere resolver?</p>
                            <p className="font-cabinet text-sm text-cream whitespace-pre-wrap">{selected.data.problema as string}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {selected.type === 'onboarding' && (
                      <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                        <OnboardingDetail data={selected.data} createdAt={selected.created_at} />
                      </div>
                    )}

                    <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                      <p className="font-cabinet text-xs text-green uppercase mb-4" style={{ letterSpacing: '0.08em' }}>Acciones</p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setProposalClient(selected.data.nombre as string || '')
                            updateStatus(selected.id, 'proposal')
                            setActiveTab('proposal')
                          }}
                          className="px-4 py-2 font-cabinet text-sm border transition-colors"
                          style={{ borderColor: 'var(--color-green)', color: 'var(--color-green)' }}
                        >
                          Generar propuesta
                        </button>
                        {selected.lead_status === 'new' && (
                          <button
                            onClick={() => updateStatus(selected.id, 'contacted')}
                            className="px-4 py-2 font-cabinet text-sm border transition-colors"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-cream-dim)' }}
                          >
                            Marcar como contactado
                          </button>
                        )}
                        {(selected.lead_status === 'new' || selected.lead_status === 'contacted') && (
                          <button
                            onClick={() => sendOnboardingLink(selected.id)}
                            disabled={sendingOnboarding === selected.id}
                            className="px-4 py-2 font-cabinet text-sm bg-green text-cream transition-opacity disabled:opacity-50"
                          >
                            {sendingOnboarding === selected.id ? 'Enviando...' : 'Enviar enlace onboarding'}
                          </button>
                        )}
                        {selected.lead_status === 'onboarding_sent' && (
                          <button
                            onClick={() => updateStatus(selected.id, 'onboarding_received')}
                            className="px-4 py-2 font-cabinet text-sm border transition-colors"
                            style={{ borderColor: 'var(--color-green)', color: 'var(--color-green)' }}
                          >
                            Marcar como onboarding recibido
                          </button>
                        )}
                        {selected.lead_status === 'onboarding_received' && (
                          <button
                            onClick={() => updateStatus(selected.id, 'proposal')}
                            className="px-4 py-2 font-cabinet text-sm border transition-colors"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-cream-dim)' }}
                          >
                            Enviar propuesta
                          </button>
                        )}
                        {selected.lead_status !== 'closed' && (
                          <button
                            onClick={() => updateStatus(selected.id, 'closed')}
                            className="px-4 py-2 font-cabinet text-sm border transition-colors"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-cream-dim)' }}
                          >
                            Cerrar lead
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                      <p className="font-cabinet text-xs text-green uppercase mb-4" style={{ letterSpacing: '0.08em' }}>Cambiar estado</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(STATUS_CONFIG) as Submission['lead_status'][]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selected.id, status)}
                            className="px-3 py-1.5 font-cabinet text-xs transition-all"
                            style={{
                              backgroundColor: selected.lead_status === status ? STATUS_CONFIG[status].bg : 'transparent',
                              border: `1px solid ${selected.lead_status === status ? STATUS_CONFIG[status].color : 'var(--color-border)'}`,
                              color: selected.lead_status === status ? STATUS_CONFIG[status].color : 'var(--color-cream-dim)',
                              borderRadius: '4px',
                            }}
                          >
                            {STATUS_CONFIG[status].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deal amount */}
                    {selected.lead_status === 'closed' && (
                      <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                        <p className="font-cabinet text-xs text-green uppercase mb-4" style={{ letterSpacing: '0.08em' }}>Importe del proyecto</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            defaultValue={selected.deal_amount ?? ''}
                            placeholder="0"
                            className="w-32 bg-transparent border-b font-anybody font-bold text-cream text-xl focus:outline-none pb-1 transition-colors"
                            style={{ borderColor: 'var(--color-border)' }}
                            onBlur={e => updateDealAmount(selected.id, e.target.value ? Number(e.target.value) : null)}
                          />
                          <span className="font-cabinet text-cream-dim">€</span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="p-6 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)', borderRadius: '12px' }}>
                      <LeadNotes
                        key={selected.id}
                        submissionId={selected.id}
                        initialNotes={selected.notes ?? []}
                      />
                    </div>

                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                    <p className="font-cabinet text-cream-dim">Selecciona un lead para ver los detalles</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          </>
        )}
      </div>
    </main>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <span className="font-cabinet text-xs text-cream-dim">{label}</span>
      <span className="font-cabinet text-sm text-cream block">{value}</span>
    </div>
  )
}
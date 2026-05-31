interface Submission {
  lead_status: string
  deal_amount?: number | null
}

interface Props {
  submissions: Submission[]
}

function KPICard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className="p-4 border"
      style={{
        borderColor: accent ? 'var(--color-green)' : 'var(--color-border)',
        backgroundColor: 'var(--color-bg-card)',
        borderLeft: accent ? '3px solid var(--color-green)' : undefined,
      }}
    >
      <p className="font-cabinet text-xs text-green mb-1" style={{ letterSpacing: '0.1em' }}>
        {label.toUpperCase()}
      </p>
      <p className="font-anybody font-bold text-cream" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

export default function KPIBar({ submissions }: Props) {
  const total    = submissions.length
  const newLeads = submissions.filter(s => s.lead_status === 'new').length
  const pipeline = submissions.filter(s =>
    ['contacted', 'onboarding_sent', 'onboarding_received', 'proposal'].includes(s.lead_status)
  ).length
  const proposals = submissions.filter(s => s.lead_status === 'proposal').length
  const closed   = submissions.filter(s => s.lead_status === 'closed').length
  const revenue  = submissions
    .filter(s => s.lead_status === 'closed' && s.deal_amount)
    .reduce((sum, s) => sum + (s.deal_amount ?? 0), 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      <KPICard label="Total leads"  value={total} />
      <KPICard label="Nuevos"       value={newLeads} />
      <KPICard label="En pipeline"  value={pipeline} />
      <KPICard label="Propuestas"   value={proposals} />
      <KPICard label="Cerrados"     value={closed} />
      <KPICard label="Facturado"    value={revenue > 0 ? `${revenue.toLocaleString('es-ES')} €` : '—'} accent />
    </div>
  )
}

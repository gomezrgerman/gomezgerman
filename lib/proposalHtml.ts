export interface ProposalItem {
  id: string
  name: string
  desc: string
  price: number
  period?: string
}

export interface ProposalStep {
  id: string
  title: string
  desc: string
}

export interface ProposalData {
  clientName: string
  date: string
  intro: string
  phase1: ProposalItem[]
  showPhase2: boolean
  phase2: ProposalItem[]
  paymentNote: string
  steps: ProposalStep[]
  contactEmail: string
  contactWeb: string
}

export function generateProposalHtml(data: ProposalData): string {
  const total = data.phase1.reduce((sum, i) => sum + i.price, 0)

  const stepsHtml = data.steps
    .map(
      (step, i) => `
      <div class="step-row">
        <span class="step-num">${i + 1}</span>
        <div class="step-text"><strong>${step.title}</strong>${step.desc ? `<br>${step.desc}` : ''}</div>
      </div>`,
    )
    .join('')

  const phase1Rows = data.phase1
    .map(
      (item, i) => `
      <div class="service-row">
        <span class="service-num">0${i + 1}</span>
        <div class="service-body">
          <div class="service-name">${item.name}</div>
          <div class="service-desc">${item.desc}</div>
        </div>
        <div class="service-price">${item.price.toLocaleString('es-ES')} €</div>
      </div>`,
    )
    .join('')

  const phase2Rows = data.phase2
    .map(
      (item) => `
      <div class="future-item">
        <div>
          <div class="future-item-name">${item.name}</div>
          <div class="future-item-desc">${item.desc}</div>
        </div>
        <div class="future-item-price">${item.price.toLocaleString('es-ES')} €${item.period ? `/${item.period}` : ''}</div>
      </div>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Propuesta — ${data.clientName} · Germán Gómez</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anybody:ital,wdth,wght@0,75..125,100..900&display=swap" rel="stylesheet">
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0a0a; --bg-card: #111111; --cream: #F5F0E8;
      --cream-dim: #A89F8C; --green: #4A7C59; --green-light: #7DB892; --border: #1E1E1E;
    }
    @page { size: A4; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg) !important; color: var(--cream) !important;
      font-family: 'Cabinet Grotesk', Georgia, serif;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: var(--bg) !important; }
      .page { background: var(--bg) !important; }
    }
    .page {
      width: 210mm; min-height: 297mm; padding: 14mm 14mm 12mm;
      display: flex; flex-direction: column;
    }
    .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10mm; }
    .logo {
      font-family: 'Anybody', sans-serif; font-weight: 800; font-stretch: 110%;
      font-size: 28px; letter-spacing: -0.04em; color: var(--cream); line-height: 1;
    }
    .header-right { text-align: right; }
    .header-label {
      font-family: 'Cabinet Grotesk', sans-serif; font-size: 9px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--green-light); margin-bottom: 4px;
    }
    .header-date { font-family: 'Cabinet Grotesk', sans-serif; font-size: 11px; color: var(--cream-dim); letter-spacing: 0.04em; }
    .divider { height: 1px; background: var(--border); margin-bottom: 10mm; position: relative; }
    .divider::before {
      content: ''; position: absolute; left: 0; top: 0; height: 1px; width: 48px; background: var(--green);
    }
    .hero { margin-bottom: 8mm; }
    .hero-label {
      font-family: 'Cabinet Grotesk', sans-serif; font-size: 9px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--green-light); margin-bottom: 5px;
    }
    .hero-title {
      font-family: 'Anybody', sans-serif; font-weight: 800; font-stretch: 112%;
      font-size: 52px; letter-spacing: -0.04em; color: var(--cream); line-height: 0.92; margin-bottom: 6mm;
    }
    .hero-subtitle { font-family: 'Cabinet Grotesk', sans-serif; font-size: 13px; color: var(--cream-dim); line-height: 1.7; max-width: 120mm; }
    .section-heading {
      font-family: 'Cabinet Grotesk', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--green-light);
      margin-bottom: 5mm; display: flex; align-items: center; gap: 10px;
    }
    .section-heading::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .services { margin-bottom: 6mm; }
    .service-row {
      display: flex; align-items: flex-start; gap: 6mm; padding: 5mm 0; border-bottom: 1px solid var(--border);
    }
    .service-row:first-child { border-top: 1px solid var(--border); }
    .service-num {
      font-family: 'Anybody', sans-serif; font-weight: 300; font-stretch: 75%;
      font-size: 11px; color: var(--green); letter-spacing: 0.05em; min-width: 24px; padding-top: 2px;
    }
    .service-body { flex: 1; }
    .service-name {
      font-family: 'Anybody', sans-serif; font-weight: 600; font-stretch: 100%;
      font-size: 15px; letter-spacing: -0.02em; color: var(--cream); margin-bottom: 3px;
    }
    .service-desc { font-family: 'Cabinet Grotesk', sans-serif; font-size: 11px; color: var(--cream-dim); line-height: 1.6; }
    .service-price {
      font-family: 'Anybody', sans-serif; font-weight: 700; font-stretch: 100%;
      font-size: 18px; letter-spacing: -0.03em; color: var(--cream); white-space: nowrap; padding-top: 1px;
    }
    .total-row {
      display: flex; align-items: center; justify-content: space-between; padding: 5mm 6mm;
      background: var(--bg-card); border: 1px solid var(--border); border-left: 3px solid var(--green); margin-bottom: 8mm;
    }
    .total-label {
      font-family: 'Cabinet Grotesk', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase; color: var(--cream-dim);
    }
    .total-price {
      font-family: 'Anybody', sans-serif; font-weight: 800; font-stretch: 110%;
      font-size: 28px; letter-spacing: -0.04em; color: var(--cream);
    }
    .total-note { font-family: 'Cabinet Grotesk', sans-serif; font-size: 9px; color: var(--cream-dim); letter-spacing: 0.04em; margin-top: 2px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 8mm; }
    .future-card, .steps-card { background: var(--bg-card); border: 1px solid var(--border); padding: 5mm; }
    .future-badge {
      display: inline-block; font-family: 'Cabinet Grotesk', sans-serif; font-size: 8px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--green); border: 1px solid var(--green);
      padding: 2px 6px; margin-bottom: 4mm;
    }
    .future-item {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 3mm 0; border-bottom: 1px solid var(--border);
    }
    .future-item:last-child { border-bottom: none; padding-bottom: 0; }
    .future-item-name { font-family: 'Cabinet Grotesk', sans-serif; font-size: 12px; font-weight: 500; color: var(--cream); }
    .future-item-desc { font-family: 'Cabinet Grotesk', sans-serif; font-size: 10px; color: var(--cream-dim); margin-top: 1px; }
    .future-item-price {
      font-family: 'Anybody', sans-serif; font-weight: 600; font-stretch: 100%;
      font-size: 13px; color: var(--cream-dim); white-space: nowrap; margin-left: 4mm;
    }
    .step-row { display: flex; gap: 4mm; align-items: flex-start; padding: 2.5mm 0; border-bottom: 1px solid var(--border); }
    .step-row:last-child { border-bottom: none; padding-bottom: 0; }
    .step-num {
      font-family: 'Anybody', sans-serif; font-weight: 700; font-stretch: 75%;
      font-size: 10px; color: var(--green); min-width: 16px; padding-top: 1px;
    }
    .step-text { font-family: 'Cabinet Grotesk', sans-serif; font-size: 11px; color: var(--cream-dim); line-height: 1.5; }
    .step-text strong { color: var(--cream); font-weight: 500; }
    .footer {
      margin-top: auto; padding-top: 8mm; border-top: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .footer-name {
      font-family: 'Anybody', sans-serif; font-weight: 700; font-stretch: 100%;
      font-size: 13px; letter-spacing: -0.02em; color: var(--cream);
    }
    .footer-contact { font-family: 'Cabinet Grotesk', sans-serif; font-size: 10px; color: var(--cream-dim); text-align: right; line-height: 1.7; }
    @media print { body { background: var(--bg); } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">GG</div>
      <div class="header-right">
        <div class="header-label">Propuesta comercial</div>
        <div class="header-date">${data.date}</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="hero">
      <div class="hero-label">Cliente</div>
      <h1 class="hero-title">${data.clientName || 'Cliente'}</h1>
      <p class="hero-subtitle">${data.intro}</p>
    </div>
    <div class="services">
      <div class="section-heading">Fase 1 — Lo que arrancamos ahora</div>
      ${phase1Rows}
    </div>
    <div class="total-row">
      <div>
        <div class="total-label">Total Fase 1</div>
        <div class="total-note">${data.paymentNote}</div>
      </div>
      <div class="total-price">${total.toLocaleString('es-ES')} €</div>
    </div>
    ${
      data.showPhase2
        ? `<div class="two-col">
        <div class="future-card">
          <span class="future-badge">Fase 2 · Próximas mejoras</span>
          ${phase2Rows}
        </div>
        <div class="steps-card">
          <span class="future-badge">Cómo empezamos</span>
          ${stepsHtml}
        </div>
      </div>`
        : `<div class="steps-card" style="margin-bottom:8mm">
        <span class="future-badge">Cómo empezamos</span>
        ${stepsHtml}
      </div>`
    }
    <div class="footer">
      <div class="footer-name">Germán Gómez</div>
      <div class="footer-contact">${data.contactEmail}<br>${data.contactWeb}</div>
    </div>
  </div>
</body>
</html>`
}

'use client'

import { useEffect, useRef } from 'react'
import {
  CreditCard,
  ClipboardList,
  Sparkles,
  FileText,
  Mail,
} from 'lucide-react'

const steps = [
  {
    icon: CreditCard,
    label: 'Stripe',
    desc: 'Pago',
  },
  {
    icon: ClipboardList,
    label: 'Onboarding',
    desc: 'Captura perfil',
  },
  {
    icon: Sparkles,
    label: 'Claude',
    desc: 'IA genera plan',
  },
  {
    icon: FileText,
    label: 'PDF',
    desc: '7 días sin repetir',
  },
  {
    icon: Mail,
    label: 'Panel',
    desc: 'Revisa y envía',
  },
]

export default function AutomationPipeline({ accent }: { accent: string }) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const anim = row.animate(
      [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 600, fill: 'forwards' },
    )

    const arrows = row.querySelectorAll<HTMLElement>('.pipeline-arrow')
    arrows.forEach((arrow, i) => {
      arrow.style.animationDelay = `${0.3 + i * 0.15}s`
    })

    return () => anim.cancel()
  }, [])

  return (
    <div
      ref={rowRef}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(0.25rem, 0.6vw, 0.5rem)',
        paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
        paddingBottom: 'clamp(1rem, 2vw, 1.5rem)',
        opacity: 0,
      }}
    >
      {steps.map((step, idx) => {
        const Icon = step.icon
        return (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 0.6vw, 0.5rem)' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                backgroundColor: `${accent}0D`,
                border: `1px solid ${accent}25`,
                borderRadius: 8,
                padding: 'clamp(8px, 0.9vw, 12px) clamp(10px, 1.3vw, 16px)',
                minWidth: 'clamp(76px, 9vw, 120px)',
                textAlign: 'center',
              }}
            >
              <Icon
                size={18}
                color={accent}
                style={{ opacity: 0.85 }}
              />
              <span
                className="font-cabinet"
                style={{
                  fontSize: 'clamp(0.7rem, 0.8vw, 0.8rem)',
                  fontWeight: 700,
                  color: '#DDD0BC',
                  letterSpacing: '0.03em',
                  lineHeight: 1,
                }}
              >
                {step.label}
              </span>
              <span
                className="font-cabinet"
                style={{
                  fontSize: 'clamp(0.65rem, 0.65vw, 0.7rem)',
                  color: accent,
                  opacity: 0.65,
                  lineHeight: 1,
                }}
              >
                {step.desc}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <span
                className="pipeline-arrow font-cabinet select-none"
                style={{
                  color: accent,
                  fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
                  opacity: 0.45,
                  fontWeight: 300,
                  lineHeight: 1,
                  margin: '0 2px',
                }}
              >
                →
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

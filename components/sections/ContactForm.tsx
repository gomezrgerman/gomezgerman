'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus]     = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      nombre:  (form.elements.namedItem('nombre')  as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      negocio: (form.elements.namedItem('negocio') as HTMLInputElement).value,
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value,
      _trap:   (form.elements.namedItem('_trap')   as HTMLInputElement).value,
    }

    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(json.error ?? 'Error al enviar el mensaje.')
      } else {
        setStatus('success')
        form.reset()
      }
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Inténtalo de nuevo.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}
    >
      {/* Honeypot anti-spam */}
      <input name="_trap" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre"  name="nombre" required />
        <Field label="Email"   name="email"  type="email" required />
      </div>

      <Field label="Negocio" name="negocio" required />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="mensaje"
          className="font-cabinet"
          style={labelStyle}
        >
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          placeholder="Cuéntame qué proceso te está costando tiempo o dinero."
          className="font-cabinet"
          style={inputStyle}
          onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(125,184,146,0.5)' }}
          onBlur={e   => { e.currentTarget.style.borderColor = 'rgba(125,184,146,0.2)' }}
        />
      </div>

      {status === 'error' && (
        <p className="font-cabinet" style={{ fontSize: '0.875rem', color: '#e07070', margin: 0 }}>
          {errorMsg}
        </p>
      )}

      {status === 'success' ? (
        <p
          className="font-cabinet"
          style={{ fontSize: '0.9375rem', color: '#7DB892', lineHeight: 1.6 }}
        >
          Mensaje enviado. Te respondo en menos de 24 horas.
        </p>
      ) : (
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-cabinet"
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: '1px solid rgba(125,184,146,0.5)',
            borderRadius: 6,
            padding: '0.875rem 2rem',
            color: '#7DB892',
            fontSize: '0.9375rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.6 : 1,
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={e => {
            if (status === 'loading') return
            e.currentTarget.style.borderColor = 'rgba(125,184,146,0.8)'
            e.currentTarget.style.backgroundColor = 'rgba(125,184,146,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(125,184,146,0.5)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      )}
    </form>
  )
}

function Field({
  label, name, type = 'text', required = false,
}: {
  label: string; name: string; type?: string; required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor={name} className="font-cabinet" style={labelStyle}>
        {label}{required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="font-cabinet"
        style={inputStyle}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(125,184,146,0.5)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(125,184,146,0.2)' }}
      />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(168,159,140,0.7)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(125,184,146,0.2)',
  borderRadius: 6,
  padding: '0.875rem 1rem',
  color: '#F5F0E8',
  fontSize: '0.9375rem',
  lineHeight: 1.6,
  outline: 'none',
  transition: 'border-color 0.2s ease',
  width: '100%',
}

'use client'

import { useState, useRef, useEffect } from 'react'

export interface Note {
  id: string
  content: string
  created_at: string
}

interface Props {
  submissionId: string
  initialNotes: Note[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function LeadNotes({ submissionId, initialNotes }: Props) {
  const [notes, setNotes]     = useState<Note[]>(initialNotes)
  const [draft, setDraft]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [notes])

  const addNote = async () => {
    const content = draft.trim()
    if (!content || saving) return
    setSaving(true)
    const optimistic: Note = { id: 'tmp-' + Date.now(), content, created_at: new Date().toISOString() }
    setNotes(prev => [...prev, optimistic])
    setDraft('')
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, content }),
      })
      const { note } = await res.json()
      setNotes(prev => prev.map(n => n.id === optimistic.id ? note : n))
    } catch {
      setNotes(prev => prev.filter(n => n.id !== optimistic.id))
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    setDeleting(noteId)
    setNotes(prev => prev.filter(n => n.id !== noteId))
    try {
      await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, noteId }),
      })
    } catch {
      // note already removed from UI, ignore
    } finally {
      setDeleting(null)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote()
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-cabinet text-xs font-bold text-green uppercase" style={{ letterSpacing: '0.1em' }}>
        Notas internas
      </p>

      {/* Note list */}
      <div
        ref={listRef}
        className="flex flex-col gap-3 overflow-y-auto"
        style={{ maxHeight: '280px' }}
      >
        {notes.length === 0 ? (
          <p className="font-cabinet text-xs text-cream-dim italic">Sin notas todavía.</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="group relative p-3 rounded"
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-cabinet text-sm text-cream whitespace-pre-wrap leading-relaxed pr-6">
                {note.content}
              </p>
              <p className="font-cabinet text-xs text-cream-dim mt-1.5" style={{ opacity: 0.5 }}>
                {formatDate(note.created_at)}
              </p>
              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                disabled={deleting === note.id}
                className="absolute top-2 right-2 font-cabinet text-base text-cream-dim opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe una nota... (Ctrl+Enter para guardar)"
          rows={3}
          className="w-full bg-transparent border px-3 py-2.5 font-cabinet text-sm text-cream placeholder:text-cream-dim/40 focus:outline-none focus:border-green transition-colors resize-none"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <button
          type="button"
          onClick={addNote}
          disabled={!draft.trim() || saving}
          className="self-end px-4 py-2 font-cabinet text-xs font-bold text-cream transition-opacity disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-green)', letterSpacing: '0.08em' }}
        >
          {saving ? 'GUARDANDO...' : 'AÑADIR NOTA'}
        </button>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Idea } from '@/types/panel'

export function useIdeas() {
  const [ideas,    setIdeas]    = useState<Idea[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      const res = await fetch('/api/ideas')
      if (res.ok) { const d = await res.json(); setIdeas(Array.isArray(d) ? d : []) }
    } catch {
      // silencioso
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
    window.addEventListener('captura-guardada', cargar)
    return () => window.removeEventListener('captura-guardada', cargar)
  }, [cargar])

  async function completarIdea(id: string) {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, estado: 'COMPLETADA' } : i))
    try {
      await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'COMPLETADA' }),
      })
    } catch { cargar() }
  }

  async function descompletarIdea(id: string) {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, estado: 'NUEVA' } : i))
    try {
      await fetch(`/api/ideas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'NUEVA' }),
      })
    } catch { cargar() }
  }

  async function eliminarIdea(id: string) {
    setIdeas(prev => prev.filter(i => i.id !== id))
    try {
      await fetch(`/api/ideas/${id}`, { method: 'DELETE' })
    } catch { cargar() }
  }

  return { ideas, cargando, recargar: cargar, completarIdea, descompletarIdea, eliminarIdea }
}

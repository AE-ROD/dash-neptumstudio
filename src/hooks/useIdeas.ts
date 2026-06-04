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
    // Recargar cuando SueltaloWidget guarda una nueva captura
    window.addEventListener('captura-guardada', cargar)
    return () => window.removeEventListener('captura-guardada', cargar)
  }, [cargar])

  return { ideas, cargando, recargar: cargar }
}

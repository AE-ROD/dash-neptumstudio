'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Pendiente } from '@/types/panel'

export function usePendientes() {
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [cargando,   setCargando]   = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await fetch('/api/pending')
    if (res.ok) { const d = await res.json(); setPendientes(Array.isArray(d) ? d : []) }
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function toggleCompletado(id: string, completado: boolean) {
    const previo = pendientes
    // Optimistic update
    setPendientes(prev => prev.map(p => p.id === id ? { ...p, completado } : p))
    try {
      const res = await fetch(`/api/pending/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completado }),
      })
      if (!res.ok) throw new Error('Error al actualizar pendiente')
    } catch {
      // Rollback si falla
      setPendientes(previo)
    }
  }

  async function agregarPendiente(texto: string) {
    await fetch('/api/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    })
    await cargar()
  }

  async function eliminarPendiente(id: string) {
    setPendientes(prev => prev.filter(p => p.id !== id))
    try {
      await fetch(`/api/pending/${id}`, { method: 'DELETE' })
    } catch { cargar() }
  }

  return { pendientes, cargando, toggleCompletado, agregarPendiente, eliminarPendiente, recargar: cargar }
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Pendiente } from '@/types/panel'

export function usePendientes() {
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [cargando,   setCargando]   = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await fetch('/api/pending')
    if (res.ok) setPendientes(await res.json())
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function toggleCompletado(id: string, completado: boolean) {
    // Optimistic update
    setPendientes(prev =>
      prev.map(p => p.id === id ? { ...p, completado } : p)
    )
    await fetch(`/api/pending/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completado }),
    })
  }

  async function agregarPendiente(texto: string) {
    await fetch('/api/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    })
    await cargar()
  }

  return { pendientes, cargando, toggleCompletado, agregarPendiente, recargar: cargar }
}

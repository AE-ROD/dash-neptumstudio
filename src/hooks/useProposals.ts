'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Propuesta } from '@/types/panel'

export function useProposals() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [cargando,   setCargando]   = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await fetch('/api/proposals')
    if (res.ok) setPropuestas(await res.json())
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function actualizarPropuesta(id: string, cambios: Partial<Propuesta>) {
    const res = await fetch(`/api/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    })
    if (!res.ok) throw new Error('Error al actualizar propuesta')
    await cargar()
  }

  return { propuestas, cargando, actualizarPropuesta, recargar: cargar }
}

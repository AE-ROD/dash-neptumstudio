'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Proyecto } from '@/types/panel'

export function useProyectos() {
  const [proyectos, setProyectos]   = useState<Proyecto[]>([])
  const [cargando,  setCargando]    = useState(true)
  const [error,     setError]       = useState<string | null>(null)

  const cargar = useCallback(async () => {
    try {
      setCargando(true)
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Error al cargar proyectos')
      const datos: Proyecto[] = await res.json()
      setProyectos(datos)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function actualizarProyecto(id: string, cambios: Partial<Proyecto>) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    })
    if (!res.ok) throw new Error('Error al actualizar proyecto')
    await cargar()
  }

  return { proyectos, cargando, error, actualizarProyecto, recargar: cargar }
}

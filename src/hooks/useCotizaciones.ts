'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Cotizacion } from '@/types/panel'

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [cargando,     setCargando]     = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    const res = await fetch('/api/cotizaciones')
    if (res.ok) { const d = await res.json(); setCotizaciones(Array.isArray(d) ? d : []) }
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function crearCotizacion(datos: Partial<Cotizacion>) {
    const res = await fetch('/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    if (!res.ok) throw new Error('Error al crear cotización')
    await cargar()
    return res.json()
  }

  async function actualizarCotizacion(id: string, datos: Partial<Cotizacion>) {
    const res = await fetch(`/api/cotizaciones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    if (!res.ok) throw new Error('Error al actualizar cotización')
    await cargar()
  }

  async function eliminarCotizacion(id: string) {
    const res = await fetch(`/api/cotizaciones/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar cotización')
    await cargar()
  }

  return { cotizaciones, cargando, crearCotizacion, actualizarCotizacion, eliminarCotizacion, recargar: cargar }
}
